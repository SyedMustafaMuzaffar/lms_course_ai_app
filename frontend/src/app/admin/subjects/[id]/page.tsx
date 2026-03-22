'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Section, Video } from '@/types';
import { Plus, Trash2, Video as VideoIcon, Layout, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SubjectManagementPage() {
    const { id: subjectId } = useParams();
    const [sections, setSections] = useState<(Section & { videos: Video[] })[]>([]);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
    
    const [sectionForm, setSectionForm] = useState({ title: '', order_index: 0 });
    const [videoForm, setVideoForm] = useState({ title: '', youtube_url: '', duration: 0, order_index: 0 });

    useEffect(() => {
        fetchContent();
    }, [subjectId]);

    const fetchContent = async () => {
        try {
            const { data: secs } = await api.get(`/courses/subjects/${subjectId}/sections`);
            const sectionsWithVideos = await Promise.all(
                secs.map(async (sec: Section) => {
                    const { data: videos } = await api.get(`/courses/sections/${sec.id}/videos`);
                    return { ...sec, videos };
                })
            );
            setSections(sectionsWithVideos);
        } catch (error) {
            toast.error('Failed to fetch curriculum');
        }
    };

    const handleCreateSection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/courses/sections', { ...sectionForm, subject_id: Number(subjectId) });
            toast.success('Section added');
            setShowSectionModal(false);
            setSectionForm({ title: '', order_index: 0 });
            fetchContent();
        } catch (error) {
            toast.error('Failed to add section');
        }
    };

    const handleCreateVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/courses/videos', { ...videoForm, section_id: activeSectionId });
            toast.success('Video added');
            setShowVideoModal(false);
            setVideoForm({ title: '', youtube_url: '', duration: 0, order_index: 0 });
            fetchContent();
        } catch (error) {
            toast.error('Failed to add video');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Curriculum <span className="text-indigo-600">Builder</span></h1>
                        <p className="mt-2 text-gray-500 font-medium text-lg">Organize your lessons into logical sections and modules.</p>
                    </div>
                    <button 
                        onClick={() => setShowSectionModal(true)}
                        className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                        <Layout className="h-5 w-5" />
                        <span>Add Section</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 bg-gray-50/50 flex justify-between items-center border-b border-gray-50">
                                <div className="flex items-center space-x-4">
                                    <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-lg text-xs font-black">
                                        {section.order_index}
                                    </span>
                                    <h3 className="text-lg font-black text-gray-900">{section.title}</h3>
                                </div>
                                <button 
                                    onClick={() => { setActiveSectionId(section.id); setShowVideoModal(true); }}
                                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Lesson</span>
                                </button>
                            </div>
                            
                            <div className="divide-y divide-gray-50">
                                {section.videos.length > 0 ? (
                                    section.videos.map((video) => (
                                        <div key={video.id} className="px-8 py-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                    <VideoIcon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{video.title}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{Math.floor(video.duration / 60)} mins • Index: {video.order_index}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <p className="text-gray-400 text-sm font-medium">No lessons added to this section yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modals - Simplified for this code block */}
                {showSectionModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <h2 className="text-2xl font-black mb-6">New <span className="text-indigo-600">Section</span></h2>
                            <form onSubmit={handleCreateSection} className="space-y-6">
                                <input 
                                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                                    placeholder="Section Title" required
                                    value={sectionForm.title} onChange={(e) => setSectionForm({...sectionForm, title: e.target.value})}
                                />
                                <input 
                                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                                    type="number" placeholder="Order Index"
                                    value={sectionForm.order_index} onChange={(e) => setSectionForm({...sectionForm, order_index: Number(e.target.value)})}
                                />
                                <div className="flex space-x-3 pt-2">
                                    <button type="button" onClick={() => setShowSectionModal(false)} className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showVideoModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <h2 className="text-2xl font-black mb-6">New <span className="text-indigo-600">Lesson</span></h2>
                            <form onSubmit={handleCreateVideo} className="space-y-6">
                                <input 
                                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                                    placeholder="Lesson Title" required
                                    value={videoForm.title} onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                                />
                                <input 
                                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                                    placeholder="YouTube URL (embed)" required
                                    value={videoForm.youtube_url} onChange={(e) => setVideoForm({...videoForm, youtube_url: e.target.value})}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        type="number" placeholder="Duration (sec)"
                                        value={videoForm.duration} onChange={(e) => setVideoForm({...videoForm, duration: Number(e.target.value)})}
                                    />
                                    <input 
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        type="number" placeholder="Index"
                                        value={videoForm.order_index} onChange={(e) => setVideoForm({...videoForm, order_index: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="flex space-x-3 pt-2">
                                    <button type="button" onClick={() => setShowVideoModal(false)} className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">Add Lesson</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
