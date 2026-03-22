export interface Subject {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
}

export interface Section {
    id: number;
    subject_id: number;
    title: string;
    order_index: number;
}

export interface Video {
    id: number;
    section_id: number;
    title: string;
    youtube_url: string;
    duration: number;
    order_index: number;
}

export interface VideoProgress {
    video_id: number;
    watched_seconds: number;
    completed: boolean;
}
