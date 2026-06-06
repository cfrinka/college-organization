"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Plus, GraduationCap, Trash2, Languages } from "lucide-react";
import SubjectCard from "./components/subject-card";
import { Course, Subject, TaskType } from "./types";
import {
  subscribeToCourses,
  subscribeToSubjects,
  createCourse,
  deleteCourse as deleteCourseFs,
  createSubject,
  updateSubjectTasks,
  updateSubjectReleased,
  deleteSubject as deleteSubjectFs,
  resetAllTasks as resetAllTasksFs,
} from "./lib/firestore";
import { t, Language } from "./lib/translations";

function createDefaultTasks() {
  return [
    { type: "video" as TaskType, completed: false },
    { type: "reading" as TaskType, completed: false },
    { type: "quiz" as TaskType, completed: false },
  ];
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const unsubCourses = subscribeToCourses((data) => {
      setCourses(data);
      setLoading(false);
    });
    const unsubSubjects = subscribeToSubjects((data) => {
      setSubjects(data);
    });
    return () => {
      unsubCourses();
      unsubSubjects();
    };
  }, []);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  async function addCourse(e: React.FormEvent) {
    e.preventDefault();
    const name = newCourseName.trim();
    if (!name) return;
    const ref = await createCourse(name);
    setSelectedCourseId(ref.id);
    setNewCourseName("");
  }

  async function handleDeleteCourse(id: string) {
    await deleteCourseFs(id);
    if (selectedCourseId === id) {
      setSelectedCourseId("");
    }
  }

  async function addSubjects(e: React.FormEvent) {
    e.preventDefault();
    const raw = newSubjectName.trim();
    if (!raw) return;
    const targetCourseId = selectedCourseId || courses[0]?.id;
    if (!targetCourseId) return;
    const names = raw
      .split(/[,\n]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) return;
    await Promise.all(
      names.map((name) => createSubject(name, targetCourseId, createDefaultTasks()))
    );
    setNewSubjectName("");
  }

  async function handleDeleteSubject(id: string) {
    await deleteSubjectFs(id);
  }

  async function toggleTask(subjectId: string, taskType: TaskType) {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    const nextTasks = subject.tasks.map((t) =>
      t.type === taskType ? { ...t, completed: !t.completed } : t
    );
    await updateSubjectTasks(subjectId, nextTasks);
  }

  async function toggleReleased(subjectId: string) {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) {
      console.error("Subject not found:", subjectId);
      return;
    }
    const newReleased = !subject.released;
    console.log("Toggling released for subject", subjectId, "from", subject.released, "to", newReleased);
    
    // Optimistic UI update
    setSubjects((prev) =>
      prev.map((s) => (s.id === subjectId ? { ...s, released: newReleased } : s))
    );
    
    try {
      await updateSubjectReleased(subjectId, newReleased);
      console.log("Update successful");
    } catch (error) {
      console.error("Failed to update released status:", error);
      // Revert on error
      setSubjects((prev) =>
        prev.map((s) => (s.id === subjectId ? { ...s, released: subject.released } : s))
      );
    }
  }

  async function resetAllTasks() {
    await resetAllTasksFs(subjects);
    setShowResetModal(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl">
              <GraduationCap className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t(language, "header.title")}
              </h1>
              <p className="text-sm text-slate-400">
                {t(language, "header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "en" ? "pt-BR" : "en")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700/50 text-sm font-medium"
              title={language === "en" ? "Switch to Portuguese" : "Mudar para Inglês"}
            >
              <span className="text-lg">{language === "en" ? "🇧🇷" : "🇺🇸"}</span>
              <span className="hidden sm:inline">{language === "en" ? "PT" : "EN"}</span>
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700/50 text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              {t(language, "header.resetAllTasks")}
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-6 mb-10">
          <form
            onSubmit={addCourse}
            className="flex items-center gap-3 max-w-xl"
          >
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder={t(language, "course.placeholder")}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors font-medium text-sm border border-slate-600/50"
            >
              <Plus className="w-4 h-4" />
              {t(language, "course.addCourse")}
            </button>
          </form>

          {courses.length > 0 && (
            <form
              onSubmit={addSubjects}
              className="flex items-center gap-3 max-w-xl"
            >
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all text-sm"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder={t(language, "subject.placeholder")}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                {t(language, "subject.addSubject")}
              </button>
            </form>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-700/40 rounded-2xl">
            <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-300 mb-1">
              {t(language, "course.noCourses")}
            </h2>
            <p className="text-slate-500">
              {t(language, "course.noCoursesDesc")}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-8 border-b border-slate-700/50 pb-1 overflow-x-auto">
              {courses.map((course) => {
                const isActive = course.id === selectedCourseId;
                const courseSubjects = subjects.filter(
                  (s) => s.courseId === course.id
                );
                const total = courseSubjects.length;
                const completed = courseSubjects.filter(
                  (s) => s.tasks.every((t) => t.completed)
                ).length;
                const progressPercent = total === 0 ? 0 : (completed / total) * 100;
                return (
                  <div
                    key={course.id}
                    className={`relative flex flex-col gap-1.5 px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors min-w-[140px] ${
                      isActive
                        ? "text-emerald-400 bg-slate-800"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="cursor-pointer"
                        onClick={() => setSelectedCourseId(course.id)}
                      >
                        {course.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {completed}/{total}
                        </span>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-0.5"
                          aria-label={`Delete ${course.name}`}
                          title={t(language, "course.deleteCourse")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          isActive ? "bg-emerald-500" : "bg-slate-500"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>

            {(() => {
              const activeCourse = courses.find(
                (c) => c.id === selectedCourseId
              );
              const courseSubjects = activeCourse
                ? subjects
                    .filter((s) => s.courseId === activeCourse.id)
                    .sort((a, b) => {
                      if (a.released !== b.released) {
                        return a.released ? -1 : 1;
                      }
                      const aCompleted = a.tasks.filter((t) => t.completed).length;
                      const bCompleted = b.tasks.filter((t) => t.completed).length;
                      return aCompleted - bCompleted;
                    })
                : [];
              return (
                <div>
                  {courseSubjects.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      {t(language, "subject.noSubjects")}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {courseSubjects.map((subject) => (
                        <SubjectCard
                          key={subject.id}
                          subject={subject}
                          language={language}
                          onToggleTask={toggleTask}
                          onToggleReleased={toggleReleased}
                          onDelete={handleDeleteSubject}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              {t(language, "modal.resetTitle")}
            </h3>
            <p className="text-slate-400 mb-6">
              {t(language, "modal.resetMessage")}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                {t(language, "modal.cancel")}
              </button>
              <button
                onClick={resetAllTasks}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors text-sm font-medium"
              >
                {t(language, "modal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
