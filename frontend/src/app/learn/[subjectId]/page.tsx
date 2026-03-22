'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Subject, Section, Video } from '@/types';
import { ChevronDown, ChevronRight, Play, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LearnPage() {
    const params = useParams();
    const subjectId = params?.subjectId ? parseInt(params.subjectId as string) : null;

    if (!subjectId) return <div className="p-8 text-center text-gray-500">Invalid Course ID</div>;

    return (
        <ProtectedRoute>
            <LearnContent subjectId={subjectId} />
        </ProtectedRoute>
    );
}

function LearnContent({ subjectId }: { subjectId: number }) {
    const [subject, setSubject] = useState<Subject | null>(null);
    const [sections, setSections] = useState<(Section & { videos: Video[] })[]>([]);
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [progress, setProgress] = useState<Record<number, { watched_seconds: number, completed: boolean }>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (subjectId) fetchData();
    }, [subjectId]);

    const fetchData = async () => {
        try {
            const [subRes, secRes] = await Promise.all([
                api.get(`/courses/subjects`),
                api.get(`/courses/subjects/${subjectId}/sections`)
            ]);

            const sub = subRes.data.find((s: Subject) => s.id === Number(subjectId));
            setSubject(sub);

            const sectionsWithVideos = await Promise.all(
                secRes.data.map(async (sec: Section) => {
                    const { data: videos } = await api.get(`/courses/sections/${sec.id}/videos`);
                    return { ...sec, videos };
                })
            );
            setSections(sectionsWithVideos);

            const allVideos = sectionsWithVideos.flatMap(s => s.videos);
            const progressMap: any = {};
            await Promise.all(allVideos.map(async (v) => {
                const { data } = await api.get(`/progress/${v.id}`);
                progressMap[v.id] = data;
            }));
            setProgress(progressMap);

            if (allVideos.length > 0) {
                setActiveVideo(allVideos[0]);
            }
        } catch (error) {
            toast.error('Failed to load course content');
        } finally {
            setLoading(false);
        }
    };

    const handleVideoSelect = (video: Video) => {
        setActiveVideo(video);
    };

    const markAsComplete = async (videoId: number) => {
        try {
            await api.post('/progress', { videoId, watchedSeconds: activeVideo?.duration || 0, completed: true });
            setProgress(prev => ({ ...prev, [videoId]: { ...prev[videoId], completed: true } }));
            toast.success('Lesson completed!');
        } catch (error) {
            console.error('Failed to mark as complete');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    {activeVideo ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden mb-8 border-4 border-white">
                                <iframe 
                                    className="w-full h-full"
                                    src={activeVideo.youtube_url}
                                    title={activeVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{activeVideo.title}</h1>
                                    <p className="text-gray-500 flex items-center space-x-2">
                                        <Play className="h-4 w-4" />
                                        <span>Duration: {Math.floor(activeVideo.duration / 60)} mins</span>
                                    </p>
                                </div>
                                <button 
                                    onClick={() => markAsComplete(activeVideo.id)}
                                    className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${
                                        progress[activeVideo.id]?.completed 
                                        ? 'bg-green-100 text-green-700 cursor-default flex items-center space-x-2' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    {progress[activeVideo.id]?.completed ? (
                                        <><CheckCircle className="h-5 w-5" /> <span>Completed</span></>
                                    ) : 'Mark as Completed'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select a video to start learning
                        </div>
                    )}
                </div>

                <aside className="w-96 border-l border-gray-100 overflow-y-auto bg-white">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-xl font-bold text-gray-900 truncate">{subject?.title}</h2>
                        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: '30%' }}></div>
                        </div>
                        <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">30% Complete</p>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {sections.map((section) => (
                            <div key={section.id} className="p-2">
                                <div className="px-4 py-3 flex items-center justify-between text-gray-900 font-bold text-sm bg-gray-50 rounded-lg">
                                    <span>{section.title}</span>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="mt-2 space-y-1">
                                    {section.videos.map((video) => (
                                        <button
                                            key={video.id}
                                            onClick={() => handleVideoSelect(video)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                                                activeVideo?.id === video.id 
                                                ? 'bg-indigo-50 text-indigo-700' 
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {progress[video.id]?.completed ? (
                                                <CheckCircle className="h-5 w-5 text-green-500 fill-green-50" />
                                            ) : (
                                                <Play className={`h-5 w-5 ${activeVideo?.id === video.id ? 'text-indigo-600' : 'text-gray-300'}`} />
                                            )}
                                            <span className="flex-1 text-left text-sm font-medium">{video.title}</span>
                                            <span className="text-[10px] font-bold text-gray-400">{Math.floor(video.duration / 60)}m</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
