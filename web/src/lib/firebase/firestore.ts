import { db } from "./client";
import { collection, doc, getDoc, getDocs, query, where, updateDoc, addDoc, setDoc } from "firebase/firestore";

export interface Course {
  courseCode: string;
  name?: string;
  description?: string;
  professors?: string[];
}

export interface Review {
  courseCode: string;
  workload: number; // 1-5
  technicality: number; // 1-5
  vibe: string;
  hashedStudentId: string;
  timestamp: any;
}

export interface StagedSyllabus {
  id?: string;
  courseCode: string;
  fileName: string;
  fileUrl: string;
  status: "pending_review" | "approved" | "rejected";
  submittedAt: any;
}

// Admin function to get pending syllabi
export async function getPendingSyllabi(): Promise<StagedSyllabus[]> {
  const q = query(collection(db, "StagedSyllabi"), where("status", "==", "pending_review"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StagedSyllabus));
}

// Admin function to approve a syllabus
export async function approveSyllabus(syllabusId: string, courseCode: string, fileUrl: string) {
  // Mark as approved
  const syllabusRef = doc(db, "StagedSyllabi", syllabusId);
  await updateDoc(syllabusRef, { status: "approved" });

  // Add to course syllabus list (simplified: store the active syllabus URL on the course doc)
  const courseRef = doc(db, "Courses", courseCode);
  await setDoc(courseRef, { activeSyllabusUrl: fileUrl, courseCode }, { merge: true });
}

// Get reviews for a course
export async function getCourseReviews(courseCode: string): Promise<Review[]> {
  const q = query(collection(db, "Reviews"), where("courseCode", "==", courseCode));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Review);
}
