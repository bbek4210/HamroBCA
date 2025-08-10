import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin, Subject } from '../models';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hamrobca';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Subject.deleteMany({});

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      email: 'admin@gmail.com',
      password: hashedPassword
    });
    await admin.save();
    console.log('✅ Default admin created');

    // Seed subjects data
    const subjects = [
      // Semester 1
      { name: 'Computer Fundamentals & Applications', code: 'CACS101', semester: 1, creditHours: 4, lectureHours: 4, tutorialHours: 0, labHours: 4 },
      { name: 'Society and Technology', code: 'CACO102', semester: 1, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 0 },
      { name: 'English I', code: 'CAEN103', semester: 1, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'Mathematics I', code: 'CAMT104', semester: 1, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 1 },
      { name: 'Digital Logic', code: 'CACS105', semester: 1, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },

      // Semester 2
      { name: 'C Programming', code: 'CACS151', semester: 2, creditHours: 4, lectureHours: 4, tutorialHours: 1, labHours: 3 },
      { name: 'Financial Accounting', code: 'CAAC152', semester: 2, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 1 },
      { name: 'English II', code: 'CAEN153', semester: 2, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'Mathematics II', code: 'CAMT154', semester: 2, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 1 },
      { name: 'Microprocessor and Computer Architecture', code: 'CACS155', semester: 2, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 2 },

      // Semester 3
      { name: 'Data Structures and Algorithms', code: 'CACS201', semester: 3, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 3 },
      { name: 'Probability and Statistics', code: 'CAST202', semester: 3, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 1 },
      { name: 'System Analysis and Design', code: 'CACS203', semester: 3, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'OOP in Java', code: 'CACS204', semester: 3, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 2 },
      { name: 'Web Technology', code: 'CACS205', semester: 3, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 3 },

      // Semester 4
      { name: 'Operating System', code: 'CACS251', semester: 4, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 2 },
      { name: 'Numerical Methods', code: 'CACS252', semester: 4, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 2 },
      { name: 'Software Engineering', code: 'CACS253', semester: 4, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'Scripting Language', code: 'CACS254', semester: 4, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 3 },
      { name: 'Database Management System', code: 'CACS255', semester: 4, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 2 },
      { name: 'Project I', code: 'CAPJ256', semester: 4, creditHours: 2, lectureHours: 0, tutorialHours: 0, labHours: 4 },

      // Semester 5
      { name: 'MIS and E-Business', code: 'CACS301', semester: 5, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'DotNet Technology', code: 'CACS302', semester: 5, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 3 },
      { name: 'Computer Networking', code: 'CACS303', semester: 5, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Introduction to Management', code: 'CAMG304', semester: 5, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'Computer Graphics and Animation', code: 'CACS305', semester: 5, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 2 },

      // Semester 6
      { name: 'Mobile Programming', code: 'CACS351', semester: 6, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 3 },
      { name: 'Distributed System', code: 'CACS352', semester: 6, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'Applied Economics', code: 'CAEC353', semester: 6, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'Advanced Java Programming', code: 'CACS354', semester: 6, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 3 },
      { name: 'Network Programming', code: 'CACS355', semester: 6, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Project II', code: 'CAPJ356', semester: 6, creditHours: 2, lectureHours: 0, tutorialHours: 0, labHours: 4 },

      // Semester 7
      { name: 'Cyber Law and Professional Ethics', code: 'CACS401', semester: 7, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'Cloud Computing', code: 'CACS402', semester: 7, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 3 },
      { name: 'Internship', code: 'CAIN403', semester: 7, creditHours: 3, lectureHours: 0, tutorialHours: 0, labHours: 0 },
      { name: 'Image Processing', code: 'CACS404', semester: 7, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Database Administration', code: 'CACS405', semester: 7, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Network Administration', code: 'CACS406', semester: 7, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Advanced Dot Net Technology', code: 'CACS408', semester: 7, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'E-Governance', code: 'CACS409', semester: 7, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Artificial Intelligence', code: 'CACS410', semester: 7, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },

      // Semester 8
      { name: 'Operations Research', code: 'CAOR451', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 1, labHours: 0 },
      { name: 'Project III', code: 'CAPJ452', semester: 8, creditHours: 6, lectureHours: 0, tutorialHours: 0, labHours: 12 },
      { name: 'Database Programming', code: 'CACS453', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Geographical Information System', code: 'CACS454', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Data Analysis and Visualization', code: 'CACS455', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Machine Learning', code: 'CACS456', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Multimedia System', code: 'CACS457', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Knowledge Engineering', code: 'CACS458', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Information Security', code: 'CACS459', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 },
      { name: 'Internet of Things', code: 'CACS460', semester: 8, creditHours: 3, lectureHours: 3, tutorialHours: 0, labHours: 2 }
    ];

    await Subject.insertMany(subjects);
    console.log('✅ Subjects data seeded');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
