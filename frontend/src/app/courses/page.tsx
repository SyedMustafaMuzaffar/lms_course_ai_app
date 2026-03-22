'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Subject } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'react-hot-toast';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CoursesPage() {
    return (
        <ProtectedRoute>
            <CoursesContent />
        </ProtectedRoute>
    );
}

function CoursesContent() {
    const [courses, setCourses] = useState<Subject[]>([]);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses/subjects');
            setCourses(data);
        } catch (error) {
            toast.error('Failed to fetch courses');
        }
    };

    const handleEnroll = async (subjectId: number) => {
        if (!user) {
            toast.error('Please login to enroll');
            return;
        }

        // Simulating a payment flow
        const confirmPayment = window.confirm("Proceed to pay for this course?");
        if (!confirmPayment) return;

        const loadingToast = toast.loading('Processing payment...');

        try {
            // Mock payment delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            await api.post('/enrollments', { subjectId });
            toast.success('Payment successful & Enrolled!', { id: loadingToast });
            
            // Redirect to classroom immediately
            router.push(`/learn/${subjectId}`);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Enrollment failed';
            toast.error(message, { id: loadingToast });
            
            if (error.response?.status === 401) {
                // If session is stale, logout the user
                localStorage.removeItem('accessToken');
                router.push('/login');
            }
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-16">
                <header className="mb-16 text-center lg:text-left">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Premium Learning Catalog
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                        Elevate your career with industry-standard courses designed by experts.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {courses.map((course) => (
                        <div key={course.id} className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-500 hover:-translate-y-2">
                            <div className="relative h-56 overflow-hidden">
                                <img 
                                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} 
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Expert Choice</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8 h-10">
                                    {course.description}
                                </p>
                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <button
                                        onClick={() => handleEnroll(course.id)}
                                        className="relative flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] active:scale-95"
                                    >
                                        Enroll Now
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Access</span>
                                        <span className="text-xs font-bold text-slate-900 mt-1">Lifetime</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
