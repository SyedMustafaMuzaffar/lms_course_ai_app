'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Subject } from '@/types';
import { Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
    return (
        <ProtectedRoute adminOnly={true}>
            <AdminContent />
        </ProtectedRoute>
    );
}

function AdminContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', thumbnail: '' });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const { data } = await api.get('/courses/subjects');
            setSubjects(data);
        } catch (error) {
            toast.error('Failed to fetch subjects');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/courses/subjects/${editingId}`, formData);
                toast.success('Subject updated');
            } else {
                await api.post('/courses/subjects', formData);
                toast.success('Subject created');
            }
            setShowModal(false);
            setFormData({ title: '', description: '', thumbnail: '' });
            setEditingId(null);
            fetchSubjects();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this subject?')) return;
        try {
            await api.delete(`/courses/subjects/${id}`);
            toast.success('Subject deleted');
            fetchSubjects();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin <span className="text-indigo-600">Command Center</span></h1>
                        <p className="mt-2 text-gray-500 font-medium">Create and manage your educational content with ease.</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Create Subject</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((sub) => (
                        <div key={sub.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="relative h-48">
                                <img src={sub.thumbnail} alt={sub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button 
                                        onClick={() => { setEditingId(sub.id); setFormData(sub); setShowModal(true); }}
                                        className="p-2 bg-white/90 backdrop-blur rounded-xl text-gray-700 hover:text-indigo-600"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(sub.id)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-xl text-gray-700 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{sub.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-6">{sub.description}</p>
                                <Link 
                                    href={`/admin/subjects/${sub.id}`}
                                    className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group/btn"
                                >
                                    <span>Manage Curriculum</span>
                                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-2xl font-black text-gray-900">{editingId ? 'Edit' : 'Create'} <span className="text-indigo-600">Subject</span></h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Subject Title</label>
                                    <input 
                                        type="text" required value={formData.title} 
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="e.g. Next.js Mastery"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                                    <textarea 
                                        required value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium h-32 resize-none"
                                        placeholder="Write a brief overview of the subject..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Thumbnail URL</label>
                                    <input 
                                        type="url" value={formData.thumbnail}
                                        onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                <div className="flex space-x-4 pt-4">
                                    <button 
                                        type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 px-8 py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                    >
                                        {editingId ? 'Save Changes' : 'Create Subject'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
