
import React, { useState, useEffect } from 'react';
import { Course, Note, User } from './types';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import AddCourseModal from './components/AddCourseModal';
import AddNoteModal from './components/AddNoteModal';
import ConfirmationModal from './components/ConfirmationModal';
import Auth from './components/Auth';
import Header from './components/Header';
import * as authService from './services/authService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // Modal states
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // State for editing/deleting
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{type: 'course' | 'note', id: string} | null>(null);


  useEffect(() => {
    if (!currentUser) {
      setCourses([]);
      return;
    }
    try {
      const savedCourses = localStorage.getItem(`courses_${currentUser.id}`);
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses));
      } else {
        setCourses([]);
      }
    } catch (error) {
        console.error("Failed to load courses from localStorage", error);
        setCourses([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    try {
        localStorage.setItem(`courses_${currentUser.id}`, JSON.stringify(courses));
    } catch (error) {
        console.error("Failed to save courses to localStorage", error);
    }
  }, [courses, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setSelectedCourseId(null);
  };

  const handleSelectCourse = (id: string) => {
    setSelectedCourseId(id);
  };

  const openAddCourseModal = () => {
    setCourseToEdit(null);
    setIsAddCourseModalOpen(true);
  };
  
  const openEditCourseModal = (course: Course) => {
    setCourseToEdit(course);
    setIsAddCourseModalOpen(true);
  };

  const handleSaveCourse = (courseData: Omit<Course, 'id' | 'notes'> & { id?: string }) => {
    if (courseData.id) { // Editing existing course
      setCourses(courses.map(c => c.id === courseData.id ? { ...c, name: courseData.name, description: courseData.description } : c));
    } else { // Adding new course
      const newCourse: Course = {
        id: Date.now().toString(),
        name: courseData.name,
        description: courseData.description,
        notes: []
      };
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      setSelectedCourseId(newCourse.id);
    }
    setIsAddCourseModalOpen(false);
  };

  const handleAddNote = (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    if (!selectedCourseId) return;

    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setCourses(courses.map(c => 
      c.id === selectedCourseId 
        ? { ...c, notes: [...c.notes, newNote].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) } 
        : c
    ));
    setIsAddNoteModalOpen(false);
  };
  
  const handleDeleteRequest = (type: 'course' | 'note', id: string) => {
    setItemToDelete({ type, id });
    setIsConfirmModalOpen(true);
  };

  const confirmDeletion = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'course') {
        const newCourses = courses.filter(c => c.id !== itemToDelete.id);
        setCourses(newCourses);
        if (selectedCourseId === itemToDelete.id) {
            setSelectedCourseId(newCourses.length > 0 ? newCourses[0].id : null);
        }
    } else if (itemToDelete.type === 'note') {
        setCourses(courses.map(c => 
            c.id === selectedCourseId
            ? { ...c, notes: c.notes.filter(n => n.id !== itemToDelete.id) }
            : c
        ));
    }
    
    setIsConfirmModalOpen(false);
    setItemToDelete(null);
  };
  
  if (!currentUser) {
    return <Auth onAuthSuccess={handleLogin} />;
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || null;
  
  return (
    <div className="flex flex-col h-screen font-sans bg-slate-900 text-slate-100">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="flex flex-row flex-grow" style={{ height: 'calc(100vh - 4rem)'}}>
        <CourseList 
          courses={courses}
          selectedCourseId={selectedCourseId}
          onSelectCourse={handleSelectCourse}
          onAddCourse={openAddCourseModal}
          onEditCourse={openEditCourseModal}
          onDeleteCourse={(id) => handleDeleteRequest('course', id)}
        />
        <CourseDetail 
          course={selectedCourse}
          onAddNote={() => setIsAddNoteModalOpen(true)}
          onDeleteNote={(id) => handleDeleteRequest('note', id)}
        />
      </main>

      <AddCourseModal 
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
      />

      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSave={handleAddNote}
      />
      
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeletion}
        title={`Delete ${itemToDelete?.type}?`}
        message={`Are you sure you want to permanently delete this ${itemToDelete?.type}? This action cannot be undone.`}
      />
    </div>
  );
};

export default App;
