require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const bcrypt = require("bcrypt");
const {
  sequelize,
  Role,
  User,
  University,
  Major,
  Scholarship,
  ApplicationStatus,
  Application,
  ApplicantProfile,
  AcademicInformation,
  Review,
} = require("../models");

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Tables recreated.");

    // Roles
    await Role.bulkCreate([
      { role_id: 1, role_name: "user" },
      { role_id: 2, role_name: "admin" },
    ]);
    console.log("Roles seeded.");

    // Application statuses
    await ApplicationStatus.bulkCreate([
      { status_id: 1, status_name: "Pending" },
      { status_id: 2, status_name: "Approved" },
      { status_id: 3, status_name: "Rejected" },
    ]);
    console.log("Application statuses seeded.");

    // ==========================================
    // MASTER DATA: REAL PARTNER UNIVERSITIES
    // ==========================================
    await University.bulkCreate([
      {
        university_id: 1,
        name: "Cambodia Academy of Digital Technology (CADT)",
        description: "The premier national flagship institution specialized in digital technology education, research, and innovation, producing top-tier engineering talent under the Ministry of Post and Telecommunications.",
        country: "Cambodia",
        city: "Phnom Penh",
        address: "Bridge 2, National Road 6A, Sangkat Prek Leap, Khan Chroy Changvar",
        website: "https://www.cadt.edu.kh",
        email: "info@cadt.edu.kh",
        phone: "+855 12 770 123",
        logo: "logos/cadt_main_logo.png",
        ranking: 1,
        acceptance_rate: 15.50,
      },
      {
        university_id: 2,
        name: "American University of Phnom Penh (AUPP)",
        description: "A leading private university providing high-quality American-style education in partnership with top US universities, offering dual-degree paths in high demand sectors like Cybersecurity and IT.",
        country: "Cambodia",
        city: "Phnom Penh",
        address: "Building 278H, Street 201R, Sangkat Kilomet Lek 6, Khan Russey Keo",
        website: "https://www.aupp.edu.kh",
        email: "info@aupp.edu.kh",
        phone: "+855 23 990 023",
        logo: "logos/aupp_main_logo.png",
        ranking: 2,
        acceptance_rate: 45.00,
      },
      {
        university_id: 3,
        name: "Institute of Technology of Cambodia (ITC)",
        description: 'Historically known as "Sala Techno," this highly prestigious public higher education engineering institution specializes in rigorous technical fields, computing sciences, and manufacturing automation.',
        country: "Cambodia",
        city: "Phnom Penh",
        address: "Russian Federation Blvd, Sangkat Teuk Laak I, Khan Toul Kork",
        website: "https://www.itc.edu.kh",
        email: "info@itc.edu.kh",
        phone: "+855 23 880 370",
        logo: "logos/itc_main_logo.png",
        ranking: 3,
        acceptance_rate: 22.00,
      },
      {
        university_id: 4,
        name: "National University of Management (NUM)",
        description: "A premier public business university featuring a pioneering state-of-the-art Faculty of Digital Economy and Faculty of Information Technology focused on high-tech business integration.",
        country: "Cambodia",
        city: "Phnom Penh",
        address: "Corner of Monivong Blvd and Christopher Howes St (96), Sangkat Wat Phnom, Khan Daun Penh",
        website: "https://www.num.edu.kh",
        email: "info@num.edu.kh",
        phone: "+855 23 428 120",
        logo: "logos/num_main_logo.png",
        ranking: 4,
        acceptance_rate: 65.00,
      },
      {
        university_id: 5,
        name: "Royal University of Phnom Penh (RUPP)",
        description: "The oldest and largest public higher education institution in Cambodia, featuring an established Department of Computer Science and extensive academic research programs.",
        country: "Cambodia",
        city: "Phnom Penh",
        address: "Russian Federation Blvd, Sangkat Teuk Laak III, Khan Tuol Kouk",
        website: "https://www.rupp.edu.kh",
        email: "info.fe@rupp.edu.kh",
        phone: "+855 23 883 640",
        logo: "logos/rupp_main_logo.png",
        ranking: 5,
        acceptance_rate: 55.00,
      },
      {
        university_id: 6,
        name: "Paragon International University (PARAGON)",
        description: "A distinguished private university recognized for its advanced technological infrastructure and completely English-taught programs in Software Engineering, MIS, and Management.",
        country: "Cambodia",
        city: "Phnom Penh",
        address: "Street 315, Sangkat Boeung Kak I, Khan Tuol Kork",
        website: "https://paragoniu.edu.kh",
        email: "info@paragoniu.edu.kh",
        phone: "+855 23 996 111",
        logo: "logos/paragon_main_logo.png",
        ranking: 6,
        acceptance_rate: 50.00,
      },
      {
        university_id: 7,
        name: "University of Cambodia (UC)",
        description: "A comprehensive, student-centered private university dedicated to human resource development through high-quality research, language training, and foundational computer sciences.",
        country: "Cambodia",
        city: "Phnom Penh",
        address: "Northbridge Road, Sangkat Toek Thla, Khan Saensokh",
        website: "https://www.uc.edu.kh",
        email: "info@uc.edu.kh",
        phone: "+855 23 993 274",
        logo: "logos/uc_main_logo.png",
        ranking: 7,
        acceptance_rate: 70.00,
      },
    ]);
    console.log("Seeded 7 universities.");

    // ==========================================
    // MASTER DATA: MAJORS (Official Techo Programs)
    // ==========================================
    await Major.bulkCreate([
      // CADT (200 spots)
      { major_id: 1, university_id: 1, major_name: "Software Engineering", degree_level: "Bachelor", duration: "4 Years", description: "Software Engineering", tuition_fee: 6500 },
      { major_id: 2, university_id: 1, major_name: "Data Science", degree_level: "Bachelor", duration: "4 Years", description: "Data Science", tuition_fee: 6500 },
      { major_id: 3, university_id: 1, major_name: "e-Commerce", degree_level: "Bachelor", duration: "4 Years", description: "e-Commerce", tuition_fee: 6500 },
      { major_id: 4, university_id: 1, major_name: "Telecommunications and Networking Engineering (Including Satellite)", degree_level: "Bachelor", duration: "4 Years", description: "Telecommunications and Networking Engineering (Including Satellite)", tuition_fee: 6500 },
      { major_id: 5, university_id: 1, major_name: "Cybersecurity", degree_level: "Bachelor", duration: "4 Years", description: "Cybersecurity", tuition_fee: 6500 },
      // AUPP (200 spots)
      { major_id: 6, university_id: 2, major_name: "IT Management / Computer Science", degree_level: "Bachelor", duration: "4 Years", description: "IT Management / Computer Science", tuition_fee: 12000 },
      { major_id: 7, university_id: 2, major_name: "Information and Communication Technology", degree_level: "Bachelor", duration: "4 Years", description: "Information and Communication Technology", tuition_fee: 12000 },
      { major_id: 8, university_id: 2, major_name: "Cybersecurity", degree_level: "Bachelor", duration: "4 Years", description: "Cybersecurity", tuition_fee: 12000 },
      { major_id: 9, university_id: 2, major_name: "Artificial Intelligence", degree_level: "Bachelor", duration: "4 Years", description: "Artificial Intelligence", tuition_fee: 12000 },
      { major_id: 10, university_id: 2, major_name: "Digital Infrastructure", degree_level: "Bachelor", duration: "4 Years", description: "Digital Infrastructure", tuition_fee: 12000 },
      { major_id: 11, university_id: 2, major_name: "Software Development", degree_level: "Bachelor", duration: "4 Years", description: "Software Development", tuition_fee: 12000 },
      { major_id: 12, university_id: 2, major_name: "Data Analytics / Information Systems", degree_level: "Bachelor", duration: "4 Years", description: "Data Analytics / Information Systems", tuition_fee: 12000 },
      { major_id: 13, university_id: 2, major_name: "Interactive App Design and Development", degree_level: "Bachelor", duration: "4 Years", description: "Interactive App Design and Development", tuition_fee: 12000 },
      // RUPP (75 spots)
      { major_id: 14, university_id: 5, major_name: "Telecommunications and Satellite Engineering", degree_level: "Bachelor", duration: "4 Years", description: "Telecommunications and Satellite Engineering", tuition_fee: 3500 },
      { major_id: 15, university_id: 5, major_name: "Data Science and Engineering", degree_level: "Bachelor", duration: "4 Years", description: "Data Science and Engineering", tuition_fee: 3500 },
      // ITC (65 spots)
      { major_id: 16, university_id: 3, major_name: "Aerospace and Autonomous Systems Engineering", degree_level: "Bachelor", duration: "4 Years", description: "Aerospace and Autonomous Systems Engineering", tuition_fee: 3100 },
      { major_id: 17, university_id: 3, major_name: "Software Engineering", degree_level: "Bachelor", duration: "4 Years", description: "Software Engineering", tuition_fee: 3100 },
      { major_id: 18, university_id: 3, major_name: "AI Engineering and Cybersecurity", degree_level: "Bachelor", duration: "4 Years", description: "AI Engineering and Cybersecurity", tuition_fee: 3100 },
      // NUM (20 spots)
      { major_id: 19, university_id: 4, major_name: "Digital Economy", degree_level: "Bachelor", duration: "4 Years", description: "Digital Economy", tuition_fee: 3500 },
      { major_id: 20, university_id: 4, major_name: "Financial Technology", degree_level: "Bachelor", duration: "4 Years", description: "Financial Technology", tuition_fee: 3500 },
      { major_id: 21, university_id: 4, major_name: "Global Entrepreneurship and Innovation", degree_level: "Bachelor", duration: "4 Years", description: "Global Entrepreneurship and Innovation", tuition_fee: 3500 },
      // Paragon (20 spots)
      { major_id: 22, university_id: 6, major_name: "Computer Science", degree_level: "Bachelor", duration: "4 Years", description: "Computer Science", tuition_fee: 8000 },
      { major_id: 23, university_id: 6, major_name: "Management of Information System", degree_level: "Bachelor", duration: "4 Years", description: "Management of Information System", tuition_fee: 8000 },
      { major_id: 24, university_id: 6, major_name: "Digital Arts and Design", degree_level: "Bachelor", duration: "4 Years", description: "Digital Arts and Design", tuition_fee: 8000 },
      // UC (20 spots)
      { major_id: 25, university_id: 7, major_name: "Information Technology", degree_level: "Bachelor", duration: "4 Years", description: "Information Technology", tuition_fee: 4200 },
    ]);
    console.log("Seeded 25 majors (official Techo programs).");

    // ==========================================
    // MASTER DATA: SCHOLARSHIPS (Official Techo 2026-2027)
    // ==========================================
    await Scholarship.bulkCreate([
      {
        scholarship_id: 1, university_id: 1,
        title: "Techo Digital Talent Scholarship 2026-2027 (CADT)",
        amount: 0.00, spots: 200,
        deadline: "2026-09-30",
        description: "100% Scholarship + Laptop | 200 spots at Cambodia Academy of Digital Technology. Programs: Software Engineering, Data Science, e-Commerce, Telecommunications & Networking (Satellite), Cybersecurity. Register at www.cadt.edu.kh/scholarship",
        eligibility: "Bacc II 2026 graduates with grades A, B, or C",
        registration_url: "https://www.cadt.edu.kh/scholarship",
        contact_info: "015 335 877 / 077 335 877",
      },
      {
        scholarship_id: 2, university_id: 2,
        title: "Techo Digital Talent Scholarship 2026-2027 (AUPP)",
        amount: 0.00, spots: 200,
        deadline: "2026-09-18",
        description: "100% Scholarship + Laptop | 200 spots at American University of Phnom Penh. Programs: IT Management/CS, ICT, Cybersecurity, AI, Digital Infrastructure, Software Development, Data Analytics, Interactive App Design. Register in person at AUPP campus.",
        eligibility: "Bacc II 2026 graduates with grades A, B, or C",
        registration_url: null,
        contact_info: "070 366 623 / 093 366 623 | admissions@aupp.edu.kh",
      },
      {
        scholarship_id: 3, university_id: 5,
        title: "Techo Digital Talent Scholarship 2026-2027 (RUPP)",
        amount: 0.00, spots: 75,
        deadline: "2026-09-30",
        description: "100% Scholarship + Laptop | 75 spots at Royal University of Phnom Penh. Programs: Telecommunications & Satellite Engineering, Data Science & Engineering. Register at www.cadt.edu.kh/scholarship",
        eligibility: "Bacc II 2026 graduates with grades A, B, or C",
        registration_url: "https://www.cadt.edu.kh/scholarship",
        contact_info: "015 335 877 / 077 335 877",
      },
      {
        scholarship_id: 4, university_id: 3,
        title: "Techo Digital Talent Scholarship 2026-2027 (ITC)",
        amount: 0.00, spots: 65,
        deadline: "2026-09-30",
        description: "100% Scholarship + Laptop | 65 spots at Institute of Technology of Cambodia. Programs: Aerospace & Autonomous Systems Engineering, Software Engineering, AI Engineering & Cybersecurity. Register at www.cadt.edu.kh/scholarship",
        eligibility: "Bacc II 2026 graduates with grades A, B, or C (must meet ITC additional requirements)",
        registration_url: "https://www.cadt.edu.kh/scholarship",
        contact_info: "015 335 877 / 077 335 877",
      },
      {
        scholarship_id: 5, university_id: 4,
        title: "Techo Digital Talent Scholarship 2026-2027 (NUM)",
        amount: 0.00, spots: 20,
        deadline: "2026-09-30",
        description: "100% Scholarship + Laptop | 20 spots at National University of Management. Programs: Digital Economy, Financial Technology, Global Entrepreneurship & Innovation. Register at www.cadt.edu.kh/scholarship",
        eligibility: "Bacc II 2026 graduates with grades A, B, or C",
        registration_url: "https://www.cadt.edu.kh/scholarship",
        contact_info: "015 335 877 / 077 335 877",
      },
      {
        scholarship_id: 6, university_id: 6,
        title: "Techo Digital Talent Scholarship 2026-2027 (Paragon)",
        amount: 0.00, spots: 20,
        deadline: "2026-09-30",
        description: "100% Scholarship + Laptop | 20 spots at Paragon International University. Programs: Computer Science, Management of Information System, Digital Arts & Design. Register at www.cadt.edu.kh/scholarship",
        eligibility: "Bacc II 2026 graduates with grades A, B, or C",
        registration_url: "https://www.cadt.edu.kh/scholarship",
        contact_info: "015 335 877 / 077 335 877",
      },
      {
        scholarship_id: 7, university_id: 7,
        title: "Techo Digital Talent Scholarship 2026-2027 (UC)",
        amount: 0.00, spots: 20,
        deadline: "2026-09-30",
        description: "100% Scholarship + Laptop | 20 spots at University of Cambodia. Programs: Information Technology. Register at www.cadt.edu.kh/scholarship",
        eligibility: "Bacc II 2026 graduates with grades A, B, or C",
        registration_url: "https://www.cadt.edu.kh/scholarship",
        contact_info: "015 335 877 / 077 335 877",
      },
    ]);
    console.log("Seeded 7 Techo scholarships (official 2026-2027 data).");

    // ==========================================
    // USER ACCOUNTS
    // ==========================================
    const hash = await bcrypt.hash("password123", 10);
    await User.bulkCreate([
      { user_id: 1, role_id: 2, first_name: "Admin", last_name: "User", email: "admin@campuspost.com", password: hash, phone: "099999999" },
      { user_id: 2, role_id: 1, first_name: "Samnang", last_name: "Sok", email: "samnang.sok@gmail.com", password: hash, phone: "012345678" },
      { user_id: 3, role_id: 1, first_name: "Sreypov", last_name: "Chan", email: "sreypov.chan@gmail.com", password: hash, phone: "098765432" },
      { user_id: 4, role_id: 1, first_name: "Piseth", last_name: "Keo", email: "piseth.keo@gmail.com", password: hash, phone: "077889900" },
      { user_id: 5, role_id: 1, first_name: "Boramy", last_name: "Vannak", email: "boramy.vannak@gmail.com", password: hash, phone: "011223344" },
      { user_id: 6, role_id: 1, first_name: "Rotha", last_name: "Chhoun", email: "rotha.chhoun@gmail.com", password: hash, phone: "085556677" },
      { user_id: 7, role_id: 1, first_name: "Somaly", last_name: "Nguon", email: "somaly.nguon@gmail.com", password: hash, phone: "015998877" },
      { user_id: 8, role_id: 1, first_name: "Mengleang", last_name: "Seng", email: "mengleang.seng@gmail.com", password: hash, phone: "069123456" },
      { user_id: 9, role_id: 1, first_name: "Kalyan", last_name: "Ouk", email: "kalyan.ouk@gmail.com", password: hash, phone: "089776655" },
    ]);
    console.log("Seeded 9 users.");

    // ==========================================
    // APPLICATIONS
    // ==========================================
    const apps = await Application.bulkCreate([
      { user_id: 2, scholarship_id: 1, university_id: 1, major_id: 1, status_id: 1, ref_no: "TECHO-CADT-001", admin_status: "pending" },
      { user_id: 3, scholarship_id: 1, university_id: 1, major_id: 2, status_id: 1, ref_no: "TECHO-CADT-002", admin_status: "pending" },
      { user_id: 4, scholarship_id: 2, university_id: 2, major_id: 6, status_id: 1, ref_no: "TECHO-AUPP-003", admin_status: "pending" },
      { user_id: 5, scholarship_id: 4, university_id: 3, major_id: 17, status_id: 1, ref_no: "TECHO-ITC-004", admin_status: "pending" },
      { user_id: 6, scholarship_id: 5, university_id: 4, major_id: 19, status_id: 1, ref_no: "TECHO-NUM-005", admin_status: "pending" },
      { user_id: 7, scholarship_id: 3, university_id: 5, major_id: 14, status_id: 1, ref_no: "TECHO-RUPP-006", admin_status: "pending" },
      { user_id: 8, scholarship_id: 6, university_id: 6, major_id: 22, status_id: 1, ref_no: "TECHO-PARA-007", admin_status: "pending" },
      { user_id: 9, scholarship_id: 7, university_id: 7, major_id: 25, status_id: 1, ref_no: "TECHO-UC-008", admin_status: "pending" },
    ]);
    console.log("Seeded 8 applications.");

    // ==========================================
    // APPLICANT PROFILES
    // ==========================================
    await ApplicantProfile.bulkCreate([
      { application_id: apps[0].application_id, full_name: "Sok Samnang", gender: "Male", date_of_birth: "2006-05-12", email: "samnang.sok@gmail.com", phone: "012345678", city: "Phnom Penh", address: "St. 271, Khan Boeung Keng Kang" },
      { application_id: apps[1].application_id, full_name: "Chan Sreypov", gender: "Female", date_of_birth: "2006-11-23", email: "sreypov.chan@gmail.com", phone: "098765432", city: "Battambang", address: "Krong Battambang" },
      { application_id: apps[2].application_id, full_name: "Keo Piseth", gender: "Male", date_of_birth: "2006-02-15", email: "piseth.keo@gmail.com", phone: "077889900", city: "Siem Reap", address: "Krong Siem Reap" },
      { application_id: apps[3].application_id, full_name: "Vannak Boramy", gender: "Female", date_of_birth: "2006-08-09", email: "boramy.vannak@gmail.com", phone: "011223344", city: "Phnom Penh", address: "Sangkat Tuol Svay Prey" },
      { application_id: apps[4].application_id, full_name: "Chhoun Rotha", gender: "Male", date_of_birth: "2005-12-30", email: "rotha.chhoun@gmail.com", phone: "085556677", city: "Kandal", address: "Krong Ta Khmao" },
      { application_id: apps[5].application_id, full_name: "Nguon Somaly", gender: "Female", date_of_birth: "2006-04-03", email: "somaly.nguon@gmail.com", phone: "015998877", city: "Kampong Cham", address: "Krong Kampong Cham" },
      { application_id: apps[6].application_id, full_name: "Seng Mengleang", gender: "Male", date_of_birth: "2006-01-17", email: "mengleang.seng@gmail.com", phone: "069123456", city: "Phnom Penh", address: "Sangkat Chroy Changvar" },
      { application_id: apps[7].application_id, full_name: "Ouk Kalyan", gender: "Female", date_of_birth: "2006-07-26", email: "kalyan.ouk@gmail.com", phone: "089776655", city: "Takeo", address: "Krong Doun Kaev" },
    ]);
    console.log("Seeded applicant profiles.");

    // ==========================================
    // ACADEMIC INFORMATION
    // ==========================================
    await AcademicInformation.bulkCreate([
      { application_id: apps[0].application_id, high_school: "Bak Touk High School", graduation_year: "2025", gpa: "3.95", grade: "A", study_program: "Science Track", english_proficiency: "IELTS 6.0", awards: "1st Place Regional Math Olympiad" },
      { application_id: apps[1].application_id, high_school: "Net Yang High School", graduation_year: "2025", gpa: "3.80", grade: "B", study_program: "Science Track", english_proficiency: "IELTS 5.5", awards: "Outstanding Female STEM Student Award" },
      { application_id: apps[2].application_id, high_school: "Hun Sen Siem Reap High School", graduation_year: "2025", gpa: "4.00", grade: "A", study_program: "Science Track", english_proficiency: "IELTS 6.5" },
      { application_id: apps[3].application_id, high_school: "Sisowath High School", graduation_year: "2025", gpa: "3.75", grade: "B", study_program: "Social Science Track", english_proficiency: "Duolingo 115" },
      { application_id: apps[4].application_id, high_school: "Hun Sen Khsach Kandal High School", graduation_year: "2025", gpa: "3.90", grade: "A", study_program: "Science Track", english_proficiency: "IELTS 6.0", awards: "National Physics Top 10" },
      { application_id: apps[5].application_id, high_school: "Preah Sihanouk High School", graduation_year: "2025", gpa: "3.88", grade: "A", study_program: "Science Track", english_proficiency: "IELTS 5.5" },
      { application_id: apps[6].application_id, high_school: "E2STEM Preah Yukanthor", graduation_year: "2025", gpa: "3.92", grade: "A", study_program: "Science Track", english_proficiency: "IELTS 6.5", awards: "Robotics Club Lead" },
      { application_id: apps[7].application_id, high_school: "Chea Sim Takeo High School", graduation_year: "2025", gpa: "3.70", grade: "C", study_program: "Science Track", english_proficiency: "IELTS 5.0" },
    ]);
    console.log("Seeded academic information.");

    console.log("\n=== Seed complete ===");
    console.log("All your real data has been restored.");
    console.log("Login: samnang.sok@gmail.com / password123");
    console.log("Admin: admin@campuspost.com / password123");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
