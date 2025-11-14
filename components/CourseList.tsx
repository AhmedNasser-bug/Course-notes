
import React, { useState } from 'react';
import { Course } from '../types';
import Icon from './Icon';

interface CourseListProps {
  courses: Course[];
  selectedCourseId: string | null;
  onSelectCourse: (id: string) => void;
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, selectedCourseId, onSelectCourse, onAddCourse, onEditCourse, onDeleteCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-800 p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center">
          <Icon name="book" className="w-7 h-7 mr-2 text-teal-400" />
          Courses
        </h1>
        <button onClick={onAddCourse} className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-500 transition-colors">
          <Icon name="plus" className="w-5 h-5" />
        </button>
      </div>
      <div className="mb-4 relative shrink-0">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-10 pr-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="search" className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      <div className="overflow-y-auto flex-grow">
        {courses.length > 0 && filteredCourses.length === 0 ? (
          <div className="text-center text-slate-400 mt-10">
            <p>No courses match your search.</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center text-slate-400 mt-10">
            <p>No courses yet.</p>
            <p>Click the '+' button to add one!</p>
          </div>
        ) : (
          <ul>
            {filteredCourses.map((course) => (
              <li
                key={course.id}
                className={`group flex items-center justify-between p-3 my-2 rounded-lg cursor-pointer transition-colors ${
                  selectedCourseId === course.id ? 'bg-teal-500 bg-opacity-30' : 'hover:bg-slate-700'
                }`}
                onClick={() => onSelectCourse(course.id)}
              >
                <div className="flex-1 overflow-hidden">
                    <p className={`font-semibold truncate ${selectedCourseId === course.id ? 'text-teal-300' : 'text-slate-200'}`}>{course.name}</p>
                    <p className={`text-sm truncate ${selectedCourseId === course.id ? 'text-slate-400' : 'text-slate-500'}`}>{course.notes.length} {course.notes.length === 1 ? 'note' : 'notes'}</p>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onEditCourse(course); }} className="p-2 text-slate-400 hover:text-sky-400">
                    <Icon name="edit" className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }} className="p-2 text-slate-400 hover:text-red-500">
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseList;
