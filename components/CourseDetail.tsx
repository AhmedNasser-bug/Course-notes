
import React, { useMemo, useState } from 'react';
import { Course, Note } from '../types';
import Icon from './Icon';

interface CourseDetailProps {
  course: Course | null;
  onAddNote: () => void;
  onDeleteNote: (noteId: string) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onAddNote, onDeleteNote }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    if (!course) return [];
    const tagsSet = new Set<string>();
    course.notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [course]);

  const filteredNotes = useMemo(() => {
    if (!course) return [];
    return course.notes.filter(note => {
      const keywordMatch = keyword.length === 0 ||
        note.title.toLowerCase().includes(keyword.toLowerCase()) ||
        note.content.toLowerCase().includes(keyword.toLowerCase()) ||
        note.summary.toLowerCase().includes(keyword.toLowerCase());

      const tagsMatch = selectedTags.length === 0 ||
        selectedTags.every(tag => note.tags && note.tags.includes(tag));

      return keywordMatch && tagsMatch;
    });
  }, [course, keyword, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    };
    
  const clearFilters = () => {
    setKeyword('');
    setSelectedTags([]);
  }

  if (!course) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-slate-500 p-8">
        <Icon name="book" className="w-24 h-24 mb-4 text-slate-700" />
        <h2 className="text-2xl font-semibold">Select a course</h2>
        <p>Choose a course from the list to see its notes.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">{course.name}</h2>
          <p className="text-slate-400">{course.description}</p>
        </div>
        <button onClick={onAddNote} className="px-4 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-500 transition-colors flex items-center space-x-2">
          <Icon name="plus" className="w-5 h-5" />
          <span>Add Note</span>
        </button>
      </div>
      
       <div className="mb-6 p-4 bg-slate-800 rounded-lg shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-slate-200">Filter Notes</h3>
           {(keyword || selectedTags.length > 0) && (
             <button onClick={clearFilters} className="text-sm text-sky-400 hover:text-sky-300">Clear Filters</button>
           )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in notes..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-10 pr-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Filter by Tags:</h4>
            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${selectedTags.includes(tag) ? 'bg-sky-500 text-white' : 'bg-slate-600 text-slate-200 hover:bg-slate-500'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No tags in this course yet.</p>
            )}
          </div>
        </div>
      </div>

      {course.notes.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
          <Icon name="note" className="w-20 h-20 mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold">No notes for this course yet.</h3>
          <p>Click "Add Note" to get started!</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
          <Icon name="search" className="w-20 h-20 mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold">No notes match your filters.</h3>
          <p>Try adjusting your search or tag selection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-slate-800 p-5 rounded-lg shadow-lg relative group">
              <button 
                onClick={() => onDeleteNote(note.id)} 
                className="absolute top-3 right-3 p-1 rounded-full bg-slate-700 text-slate-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Icon name="trash" className="w-4 h-4"/>
              </button>
              <h3 className="text-xl font-bold text-sky-400 mb-2">{note.title}</h3>
              <p className="text-xs text-slate-500 mb-4">Created: {new Date(note.createdAt).toLocaleString()}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-slate-300 mb-1">AI Summary</h4>
                <p className="text-slate-400 bg-slate-700 p-3 rounded-md text-sm">{note.summary}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-slate-300 mb-1">Full Content</h4>
                <p className="text-slate-300 whitespace-pre-wrap text-sm">{note.content}</p>
              </div>

              {note.fileName && (
                <div>
                  <h4 className="font-semibold text-slate-300 mb-1">Attachment</h4>
                  <div className="flex items-center space-x-2 text-sky-400">
                    <Icon name="file" className="w-5 h-5"/>
                    <span>{note.fileName}</span>
                  </div>
                </div>
              )}

              {note.tags && note.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-slate-600 text-slate-200">
                        <Icon name="tag" className="w-3 h-3 mr-1.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
