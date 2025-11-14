
import React, { useState } from 'react';
import { Note } from '../types';
import { generateSummary } from '../services/geminiService';
import Icon from './Icon';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'createdAt'>) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsGenerating(true);
    try {
      const summary = await generateSummary(content);
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      onSave({
        title,
        content,
        summary,
        fileName: file?.name,
        tags: tagsArray,
      });
      onClose();
      // Reset form
      setTitle('');
      setContent('');
      setTags('');
      setFile(null);
    } catch (error) {
      console.error("Failed to add note", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-sky-400">Add New Note</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="noteTitle" className="block text-slate-300 mb-2 font-semibold">Note Title</label>
            <input
              id="noteTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. Lecture 1: State and Props"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="noteContent" className="block text-slate-300 mb-2 font-semibold">Content</label>
            <textarea
              id="noteContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 h-48"
              placeholder="Paste your notes here..."
              required
            />
          </div>
           <div className="mb-4">
            <label htmlFor="noteTags" className="block text-slate-300 mb-2 font-semibold">Tags (comma-separated)</label>
            <input
              id="noteTags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. react, hooks, state-management"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="noteFile" className="block text-slate-300 mb-2 font-semibold">Attach File (Optional)</label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Icon name="file" className="w-8 h-8 mb-4 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500">PDF, DOCX, PNG, JPG (MAX. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                </label>
            </div> 
            {file && <p className="text-sm text-slate-400 mt-2">Selected: {file.name}</p>}
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isGenerating} className="px-6 py-2 rounded-md bg-sky-600 text-white font-semibold hover:bg-sky-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center">
              {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Summary...
                  </>
              ) : "Save Note & Summarize"}
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes fade-in-scale { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AddNoteModal;
