// ============================================
// SkillBridge Configuration
// Domain-specific constants and Firebase re-exports
// ============================================

import {
    app, auth, db,
    ADMIN_EMAILS, DEPARTMENTS,
    onAuthStateChanged, signOut,
    collection, onSnapshot, getDocs, doc, getDoc,
    deleteDoc, addDoc, updateDoc, setDoc, serverTimestamp,
    query, orderBy, where, Timestamp
} from "./firebase-config.js";

// SkillBridge Domain Constants
const SKILL_LEVELS = [
    { value: 1, label: "Beginner (Learning)" },
    { value: 2, label: "Basic (Academic projects)" },
    { value: 3, label: "Intermediate (Can work independently)" },
    { value: 4, label: "Advanced (Industry ready)" },
    { value: 5, label: "Expert (Can mentor others)" }
];

const INDUSTRY_TYPES = [
    "IT / Software", "Healthcare", "Finance", 
    "Manufacturing", "Automotive", "E-commerce", 
    "Education Tech", "Other"
];

const LISTING_TYPES = [
    "Internship (Full-time)", "Internship (Part-time)",
    "Job (Full-time)", "Project-based / Freelance"
];

const COMMON_SKILLS = [
    "JavaScript", "Python", "Java", "C++", "React", "Angular", "Vue",
    "Node.js", "Express", "Django", "Flask", "Spring Boot",
    "SQL", "MongoDB", "Firebase", "AWS", "Azure", "GCP",
    "Machine Learning", "Data Analysis", "UI/UX Design",
    "Project Management", "Digital Marketing", "Content Writing"
];

export {
    app, auth, db,
    ADMIN_EMAILS, DEPARTMENTS,
    SKILL_LEVELS, INDUSTRY_TYPES, LISTING_TYPES, COMMON_SKILLS,
    onAuthStateChanged, signOut,
    collection, onSnapshot, getDocs, doc, getDoc,
    deleteDoc, addDoc, updateDoc, setDoc, serverTimestamp,
    query, orderBy, where, Timestamp
};
