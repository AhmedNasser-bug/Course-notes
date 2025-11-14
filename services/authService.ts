
import { User } from '../types';

const USERS_KEY = 'course_notes_users';
const CURRENT_USER_KEY = 'course_notes_current_user';

const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = (email: string, password: string): User | null => {
  const users = getUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }
  const newUser: User = { id: Date.now().toString(), email, password }; // In a real app, hash the password!
  saveUsers([...users, newUser]);
  return newUser;
};

export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  throw new Error("Invalid email or password.");
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};
