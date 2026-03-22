const pool = require('../config/db');

const enroll = async (req, res) => {
    try {
        const { subjectId } = req.body;
        const userId = req.user.id;

        const [result] = await pool.execute(
            'INSERT INTO enrollments (user_id, subject_id) VALUES (?, ?)',
            [userId, subjectId]
        );
        res.status(201).json({ message: 'Enrolled successfully', enrollmentId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already enrolled in this subject' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(401).json({ message: 'Session expired or invalid user. Please logout and login again.' });
        }
        res.status(500).json({ message: error.message });
    }
};

const getEnrollments = async (req, res) => {
    try {
        const userId = req.user.id;
        const [enrollments] = await pool.execute(
            `SELECT s.*, e.enrolled_at 
             FROM subjects s 
             JOIN enrollments e ON s.id = e.subject_id 
             WHERE e.user_id = ?`,
            [userId]
        );
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { enroll, getEnrollments };
