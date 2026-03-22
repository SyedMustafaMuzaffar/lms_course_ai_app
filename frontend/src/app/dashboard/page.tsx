'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Subject } from '@/types';
import Link from 'next/link';
import { Play, CheckCircle } from 'lucide-react';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const [enrolledCourses, setEnrolledCourses] = useState<Subject[]>([]);

    useEffect(() => {
        fetchEnrolled();
    }, []);

    const fetchEnrolled = async () => {
        try {
            const { data } = await api.get('/enrollments/my-courses');
            setEnrolledCourses(data);
        } catch (error) {
            console.error('Failed to fetch enrolled courses');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                        <p className="text-gray-500">Pick up where you left off.</p>
                    </div>
                </header>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">Continue Learning</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.length > 0 ? (
                            enrolledCourses.map((course) => (
                                <Link 
                                    key={course.id} 
                                    href={`/learn/${course.id}`}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all flex space-x-4 group"
                                >
                                    <div className="relative flex-shrink-0">
                                        <img 
                                            src={course.thumbnail} 
                                            alt={course.title} 
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all">
                                            <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase text-xs tracking-wider mb-1">Subject</h3>
                                            <p className="text-gray-900 font-bold line-clamp-1">{course.title}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div className="bg-green-500 h-1.5 rounded-full w-[45%]"></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">45%</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                                <Link href="/courses" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">Browse Courses</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
