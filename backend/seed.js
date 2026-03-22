const pool = require('./config/db');
const { hashPassword } = require('./utils/authUtils');

const seed = async () => {
    try {
        console.log('Seeding database with expanded content...');

        // 1. Create Users
        const adminPass = await hashPassword('admin123');
        const studentPass = await hashPassword('student123');

        await pool.execute('DELETE FROM users');
        await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
            ['Admin User', 'admin@lms.com', adminPass, 'Admin', 'Student User', 'student@lms.com', studentPass, 'Student']
        );

        // 2. Course Data
        const validYtEmbed = 'https://www.youtube.com/embed/ZVnjOPwW4ZA'; // freeCodeCamp Next.js tutorial
        const courses = [
            { title: 'Next.js Mastery', desc: 'The most comprehensive Next.js course on the market.', thumb: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800', yt: validYtEmbed },
            { title: 'Node.js Backend Essentials', desc: 'Learn to build scalable backends with Express.', thumb: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800', yt: validYtEmbed },
            { title: 'React Performance Pro', desc: 'Optimize your React apps for lightning speed.', thumb: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', yt: validYtEmbed },
            { title: 'TypeScript Deep Dive', desc: 'Master type-safe development with TypeScript.', thumb: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', yt: validYtEmbed },
            { title: 'Tailwind CSS Magic', desc: 'Build stunning UIs faster than ever before.', thumb: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800', yt: validYtEmbed },
            { title: 'AWS Cloud Foundations', desc: 'Get started with the world\'s leading cloud provider.', thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', yt: validYtEmbed },
            { title: 'Python for Data Science', desc: 'Data analysis and visualization from scratch.', thumb: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', yt: validYtEmbed },
            { title: 'Docker and Kubernetes', desc: 'Containerize and orchestrate your apps.', thumb: 'https://images.unsplash.com/photo-1605745341112-85968b193ef1?w=800', yt: validYtEmbed },
            { title: 'UI/UX Design Masterclass', desc: 'Design beautiful, user-centric interfaces.', thumb: 'https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?w=800', yt: validYtEmbed },
            { title: 'GraphQL with Apollo', desc: 'Modern data fetching with GraphQL.', thumb: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', yt: validYtEmbed },
            { title: 'Cybersecurity 101', desc: 'Protect your apps from modern threats.', thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', yt: validYtEmbed },
            { title: 'DevOps Engineering', desc: 'Bridge the gap between dev and ops.', thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', yt: validYtEmbed },
            { title: 'Rust Programming', desc: 'Memory safe, fast, and modern systems language.', thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', yt: validYtEmbed },
            { title: 'Solidity and Web3', desc: 'Build the decentralized future.', thumb: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800', yt: validYtEmbed },
            { title: 'Mobile Apps with Flutter', desc: 'Cross-platform mobile development.', thumb: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', yt: validYtEmbed }
        ];

        await pool.execute('DELETE FROM subjects');
        await pool.execute('DELETE FROM sections');
        await pool.execute('DELETE FROM videos');

        for (const c of courses) {
            const [subRes] = await pool.execute(
                'INSERT INTO subjects (title, description, thumbnail) VALUES (?, ?, ?)',
                [c.title, c.desc, c.thumb]
            );
            const subId = subRes.insertId;

            const [secRes] = await pool.execute(
                'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)',
                [subId, 'Main Content', 1]
            );
            const secId = secRes.insertId;

            await pool.execute(
                'INSERT INTO videos (section_id, title, youtube_url, duration, order_index) VALUES (?, ?, ?, ?, ?)',
                [secId, 'Full Workshop', c.yt, 3600, 1]
            );
        }

        console.log(`Successfully seeded ${courses.length} courses!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
