
import React from 'react';
import { User } from '../types';
import Icon from './Icon';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    return (
        <header className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center h-16 shrink-0">
            <div className="flex items-center">
                <Icon name="book" className="w-8 h-8 mr-3 text-teal-400" />
                <h1 className="text-xl font-bold text-slate-100 hidden sm:block">Course Notes AI</h1>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-slate-300 text-sm hidden md:block">Welcome, <span className="font-semibold">{user.email}</span></span>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-semibold rounded-md bg-teal-600 text-white hover:bg-teal-500 transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
