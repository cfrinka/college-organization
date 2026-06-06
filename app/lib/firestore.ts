import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Course, Subject } from "../types";

const coursesCol = collection(db, "courses");
const subjectsCol = collection(db, "subjects");

export function subscribeToCourses(callback: (courses: Course[]) => void) {
  const q = query(coursesCol, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const courses: Course[] = snapshot.docs.map((d) => ({
      id: d.id,
      name: d.data().name as string,
    }));
    callback(courses);
  });
}

export function subscribeToSubjects(callback: (subjects: Subject[]) => void) {
  const q = query(subjectsCol, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const subjects: Subject[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name as string,
        courseId: data.courseId as string,
        tasks: (data.tasks as Subject["tasks"]) ?? [],
        released: (data.released as boolean) ?? false,
      };
    });
    callback(subjects);
  });
}

export async function createCourse(name: string) {
  return addDoc(coursesCol, {
    name,
    createdAt: Timestamp.now(),
  });
}

export async function deleteCourse(courseId: string) {
  await deleteDoc(doc(db, "courses", courseId));
}

export async function createSubject(
  name: string,
  courseId: string,
  tasks: Subject["tasks"]
) {
  return addDoc(subjectsCol, {
    name,
    courseId,
    tasks,
    released: false,
    createdAt: Timestamp.now(),
  });
}

export async function updateSubjectTasks(subjectId: string, tasks: Subject["tasks"]) {
  await updateDoc(doc(db, "subjects", subjectId), { tasks });
}

export async function updateSubjectReleased(subjectId: string, released: boolean) {
  await updateDoc(doc(db, "subjects", subjectId), { released });
}

export async function deleteSubject(subjectId: string) {
  await deleteDoc(doc(db, "subjects", subjectId));
}

export async function batchCreateCourses(courses: Omit<Course, "id">[]) {
  const results = await Promise.all(
    courses.map((c) =>
      addDoc(coursesCol, {
        name: c.name,
        createdAt: Timestamp.now(),
      })
    )
  );
  return results.map((ref) => ref.id);
}

export async function batchCreateSubjects(subjects: Omit<Subject, "id">[]) {
  await Promise.all(
    subjects.map((s) =>
      addDoc(subjectsCol, {
        name: s.name,
        courseId: s.courseId,
        tasks: s.tasks,
        released: s.released ?? false,
        createdAt: Timestamp.now(),
      })
    )
  );
}

export async function resetAllTasks(subjects: Subject[]) {
  await Promise.all(
    subjects.map((s) =>
      updateDoc(doc(db, "subjects", s.id), {
        tasks: s.tasks.map((t) => ({ ...t, completed: false })),
      })
    )
  );
}
