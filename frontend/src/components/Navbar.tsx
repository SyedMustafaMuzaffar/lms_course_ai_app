'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <BookOpen className="h-8 w-8 text-indigo-600" />
                            <span className="text-xl font-bold text-gray-900">LMS<span className="text-indigo-600">Pro</span></span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link 
                                    href={user.role === 'Admin' ? '/admin' : '/dashboard'} 
                                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <Link 
                                    href="/courses" 
                                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    <span>Courses</span>
                                </Link>
                                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs font-semibold text-gray-700">{user.name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Login</Link>
                                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition-colors">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
