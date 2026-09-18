const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const { connectDB } = require('../config/db');

const posts = [
  {
    title: 'Top 7 Essential Skills Every College Student Should Learn',
    excerpt: 'Practical habits and abilities that help students grow academically and professionally.',
    author: 'Riya Sen',
    category: 'Skills',
    date: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    content: 'College is not only about exams and marks. It is also about becoming confident, useful, and ready for real-life challenges. Students who learn important skills early often feel more prepared for internships, projects, and leadership roles. These seven skills can make a visible difference during college and beyond.\n\nCommunication is one of the strongest skills a student can build. Speaking clearly, writing well, and listening carefully help you in class presentations, team projects, and job interviews. You do not need to become perfect; you just need to keep improving.\n\nTime management is another major skill. Students often feel stressed because they try to do everything at once. A simple schedule, study plan, and priority list can reduce panic and improve performance. Good planning makes work easier and sharper.\n\nCritical thinking matters because real life is not based on memorization alone. Students who ask questions, compare facts, and think logically tend to solve problems better. This helps in assignments, case studies, and even day-to-day decisions.\n\nDigital literacy is now essential. Students should be comfortable with spreadsheets, online tools, presentations, and communication platforms. These are often used in group assignments, internships, and professional life.\n\nEmotional intelligence helps students build better relationships. It means understanding emotions, respecting others, and responding calmly in difficult situations. This is useful in college groups, leadership roles, and campus life.\n\nFinancial awareness is important even for students with small budgets. Learning how to save, spend wisely, and manage expenses teaches maturity. It also prevents stress when college costs pile up.\n\nAdaptability is one of the best survival skills. Plans change, situations change, and careers sometimes evolve differently than expected. Students who stay calm, curious, and flexible can handle uncertainty far better.'
  },
  {
    title: 'How Digital Communities Can Improve College Student Life',
    excerpt: 'Online student groups can support learning, reduce stress, and create stronger campus connections.',
    author: 'Aarav Mehta',
    category: 'Campus Life',
    date: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    content: 'Digital communities have become a practical support system for students. They are not just social groups but useful spaces where students share exam tips, career opportunities, and daily advice. In many colleges, students rely on WhatsApp groups, Telegram communities, and discussion forums to stay updated.\n\nOne of the biggest advantages is access to information. Students can learn about scholarships, event deadlines, internship openings, and course updates quickly. Instead of waiting for notices, they can get quick answers from peers and seniors.\n\nAnother advantage is emotional support. College life can feel stressful, especially during deadlines or placements. A digital community can make students feel less isolated because they know others are going through similar experiences. This sense of belonging matters more than most people realize.\n\nA healthy digital community also improves learning. Students can exchange notes, ask questions, and clarify difficult topics with classmates. Sharing resources in a respectful way often makes study routines more effective.\n\nThe key is to use these groups wisely. Good communities are respectful, helpful, and focused on growth. Students should verify facts and avoid spreading misinformation. When used the right way, digital communities can make college life more connected, confident, and motivating.'
  },
  {
    title: 'Why Finding the Right Study Partner Matters',
    excerpt: 'A good study partner can improve focus, accountability, and confidence during exam season.',
    author: 'Mehak Sharma',
    category: 'Study Skills',
    date: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    content: 'Many students study alone because they think independence is better. But learning with the right partner can make a big difference in motivation, discipline, and understanding. A study partner is not just someone to sit with; it is someone who keeps your effort active and honest.\n\nThe right study partner should match your goals and study style. If one person prefers quiet revision and the other likes loud discussions, conflict can happen. A good partner respects your pace, encourages you, and helps you stay consistent without adding pressure.\n\nA strong study partner also adds accountability. When you know you are meeting someone regularly, you feel more responsible. This helps you avoid procrastination and keeps your goals clear. In the long run, this kind of routine leads to better preparation and less stress.\n\nStudy partners can also help with different perspectives. Sometimes one person explains a concept in a way that makes it clearer for another. This improves understanding and builds confidence. The best study relationships are cooperative, respectful, and honest.'
  },
  {
    title: '5 Smart Study Habits Every Student Should Build',
    excerpt: 'Simple routines can improve consistency, retention, and attention during busy college weeks.',
    author: 'Kabir Joshi',
    category: 'Study Habits',
    date: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    content: 'Students often think effective learning means spending more hours studying. In reality, good habits matter more than long hours. Smart study habits help you learn with less stress and better focus.\n\nOne useful habit is revising regularly instead of leaving everything for the last minute. Short revision sessions are often more effective than one long and tiring study block. This keeps the information fresh and easier to remember.\n\nAnother habit is making clear notes. When students summarize concepts in their own words, they understand better. It also helps during exam revision because information is easier to review.\n\nSetting small goals is also helpful. For example, finishing one chapter or solving ten questions can create progress without feeling overwhelming. These small wins build confidence and consistency.\n\nA healthy study routine also includes short breaks and enough sleep. Many students ignore this because they feel busy, but tired brains learn less. Rest is part of effective learning.\n\nGood study habits are not complicated. They are practical, repeatable, and easy to start. The more consistent you are, the more naturally improvement follows.'
  },
  {
    title: 'How Students Can Prepare for Internships',
    excerpt: 'Internships become more approachable when students build practical skills and confidence early.',
    author: 'Nisha Verma',
    category: 'Career Tips',
    date: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    content: 'Internships help students test their skills before graduation and make them more eligible for jobs. But many students wait until the final year to start preparing. The earlier you begin, the more comfortable you become with interviews, resume writing, and professional communication.\n\nTo prepare, students should first build a basic resume that highlights projects, skills, and coursework. Even a simple resume looks stronger when it includes clear achievements and practical work.\n\nStudents should also improve core skills such as communication, teamwork, and digital tools. These are often valued in internships, even when companies are hiring for entry-level roles. Practice speaking clearly, writing professionally, and staying organized.\n\nAnother important step is to build confidence through projects or volunteering. Students who take on small responsibilities often become better at handling real work situations. This makes them more memorable during interviews and selection rounds.\n\nInternships are not just about company names. They are about learning how to work, communicate, and grow. Starting early gives students more time to improve and more chances to succeed.'
  },
  {
    title: 'The Importance of Communication Skills in College',
    excerpt: 'Clear communication can improve presentations, friendships, teamwork, and future career opportunities.',
    author: 'Sana Khan',
    category: 'Communication',
    date: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    content: 'Communication is one of the most useful skills a student can develop in college. It affects how you speak in class, how you work in groups, and how you present yourself in interviews or networking conversations. When communication is clear, confidence grows.\n\nA lot of misunderstandings happen because people do not speak or listen carefully. Good communication means expressing ideas clearly, listening without interrupting, and being open to different opinions. These habits help in daily campus life and in future professional situations.\n\nStudents who can present ideas confidently tend to stand out. This matters during seminars, project discussions, and internship interviews. Even simple habits like writing clear emails or speaking politely can make a strong impression.\n\nImproving communication does not require dramatic changes. You can begin by speaking more clearly in class, asking thoughtful questions, and practicing short presentations. Over time, these habits build confidence and open more opportunities.'
  },
  {
    title: 'How Technology Is Changing Student Learning',
    excerpt: 'Modern tools are changing how students learn, collaborate, and stay organized in college life.',
    author: 'Dev Shah',
    category: 'Technology',
    date: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    content: 'Technology has completely changed how students learn. Today, students can access lectures, notes, tutorials, and online communities from almost anywhere. This flexibility makes learning more accessible and more practical.\n\nDigital tools help students stay organized. Calendars, cloud notes, task apps, and document sharing systems allow students to plan better and reduce stress. Students can organize assignments and revision timelines without relying on paper alone.\n\nTechnology also makes collaboration easier. Students can work together on reports, presentations, and project files in real time. This improves teamwork and helps students learn from each other.\n\nAt the same time, technology should be used wisely. Too much screen time or constant distractions can reduce focus. Students should use tools carefully and keep their learning goals in mind. When used intentionally, technology becomes a support system rather than a distraction.'
  }
];

async function seedBlogs() {
  try {
    await connectDB();
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await Blog.insertMany(posts);
    console.log(`${posts.length} blog posts inserted successfully.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

seedBlogs();