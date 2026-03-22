const pool = require('../config/db');

// Subjects
const getSubjects = async (req, res) => {
    try {
        const [subjects] = await pool.execute('SELECT * FROM subjects');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSubject = async (req, res) => {
    try {
        const { title, description, thumbnail } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO subjects (title, description, thumbnail) VALUES (?, ?, ?)',
            [title, description, thumbnail]
        );
        res.status(201).json({ id: result.insertId, title, description, thumbnail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, thumbnail } = req.body;
        await pool.execute(
            'UPDATE subjects SET title = ?, description = ?, thumbnail = ? WHERE id = ?',
            [title, description, thumbnail, id]
        );
        res.json({ message: 'Subject updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('DELETE FROM subjects WHERE id = ?', [id]);
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Sections
const getSectionsBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const [sections] = await pool.execute(
            'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC',
            [subjectId]
        );
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSection = async (req, res) => {
    try {
        const { subject_id, title, order_index } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)',
            [subject_id, title, order_index || 0]
        );
        res.status(201).json({ id: result.insertId, subject_id, title, order_index });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Videos (Lessons)
const getVideosBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const [videos] = await pool.execute(
            'SELECT * FROM videos WHERE section_id = ? ORDER BY order_index ASC',
            [sectionId]
        );
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVideo = async (req, res) => {
    try {
        const { section_id, title, youtube_url, duration, order_index } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES (?, ?, ?, ?, ?)',
            [section_id, title, youtube_url, duration || 0, order_index || 0]
        );
        res.status(201).json({ id: result.insertId, section_id, title, youtube_url, duration, order_index });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubjects, createSubject, updateSubject, deleteSubject,
    getSectionsBySubject, createSection,
    getVideosBySection, createVideo
};
