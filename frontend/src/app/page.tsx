'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BookOpen, Sparkles, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(user.role === 'Admin' ? '/admin' : '/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* ... rest of the component ... */}
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-50 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-bounce">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-600">The Future of Online Learning</span>
            </div>
            <h1 className="text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
              Master Any Skill with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">LMS Pro</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
              Empower your journey with our premium learning management system. Expert-led courses, seamless progress tracking, and professional-grade curriculum.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/courses" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center justify-center space-x-3">
                <span>Browse Courses</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-lg hover:border-gray-200 transition-all flex items-center justify-center">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8">
                <Zap className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Fast Learning</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Compressed, high-impact lessons designed for busy professionals and students.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-8">
                <Shield className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Certified Content</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Our curriculum is reviewed by industry experts to ensure the highest quality standards.</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-8">
                <BookOpen className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Rich Curriculum</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Deep dive into subjects with modular sections and interactive video elements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-black text-gray-900">LMS<span className="text-indigo-600">Pro</span></span>
          </div>
          <p className="text-gray-400 font-medium">&copy; 2024 LMS Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
