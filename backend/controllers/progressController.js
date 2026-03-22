const pool = require('../config/db');

const saveProgress = async (req, res) => {
    try {
        const { videoId, watchedSeconds, completed } = req.body;
        const userId = req.user.id;

        await pool.execute(
            `INSERT INTO video_progress (user_id, video_id, watched_seconds, completed) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE watched_seconds = ?, completed = ?`,
            [userId, videoId, watchedSeconds, completed, watchedSeconds, completed]
        );
        res.json({ message: 'Progress saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProgress = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user.id;

        const [results] = await pool.execute(
            'SELECT * FROM video_progress WHERE user_id = ? AND video_id = ?',
            [userId, videoId]
        );
        res.json(results[0] || { watched_seconds: 0, completed: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourseProgress = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const userId = req.user.id;

        const [videos] = await pool.execute(
            `SELECT v.id FROM videos v 
             JOIN sections s ON v.section_id = s.id 
             WHERE s.subject_id = ?`,
            [subjectId]
        );

        if (videos.length === 0) return res.json({ percentage: 0 });

        const [progress] = await pool.execute(
            `SELECT COUNT(*) as completed_count 
             FROM video_progress vp
             JOIN videos v ON vp.video_id = v.id
             JOIN sections s ON v.section_id = s.id
             WHERE vp.user_id = ? AND s.subject_id = ? AND vp.completed = 1`,
            [userId, subjectId]
        );

        const percentage = Math.round((progress[0].completed_count / videos.length) * 100);
        res.json({ percentage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveProgress, getProgress, getCourseProgress };
