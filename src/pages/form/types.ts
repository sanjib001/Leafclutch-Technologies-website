export interface FormData {
  fullName: string;
  whatsappNumber: string;
  program: string;
  reason: string;
  otherReason: string;
  semester: string;
  email: string;
  linkedin: string;
  github: string;
}

export const PROGRAMS = [
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Cybersecurity",
  "Graphic Design",
  "UI/UX Design",
  "SEO (Search Engine Optimization)",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Analyst",
  "Data Science",
  "Agentic AI",
  "DSA + 350 DSA questions (leetcode, GFG, Hackerrank, etc)",
  "Python Language Programming",
  "C Language Programming",
  "C++ Language Programming",
  "Java Language Programming",
  "Javascript Language Programming",
  "Generative AI",
];

export const REASONS = [
  "To gain practical experience",
  "It is mandatory to complete an internship for my college requirements",
];

export const CONTACTS = [
  { name: "Shubham Deo", phone: "+977-9766715669" },
  { name: "Siddhartha Pathak", phone: "+977-9766715666" },
  { name: "Shibika Nepal", phone: "+977-9766715768", isRecommended: true },
];
