
import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import Icon from './Icon';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id' | 'notes'> & { id?: string }) => void;
  courseToEdit: Course | null;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onSave, courseToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (courseToEdit) {
      setName(courseToEdit.name);
      setDescription(courseToEdit.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [courseToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ id: courseToEdit?.id, name, description });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg mx-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-400">{courseToEdit ? 'Edit Course' : 'Add New Course'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="courseName" className="block text-slate-300 mb-2 font-semibold">Course Name</label>
            <input
              id="courseName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Introduction to React"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="courseDescription" className="block text-slate-300 mb-2 font-semibold">Description</label>
            <textarea
              id="courseDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 h-28"
              placeholder="A brief description of the course."
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 rounded-md bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors">
              {courseToEdit ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddCourseModal;
