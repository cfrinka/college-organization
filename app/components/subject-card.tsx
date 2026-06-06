"use client";

import { Play, BookOpen, FileText, Trash2, Rocket } from "lucide-react";
import { Subject, TaskType } from "../types";
import { t, Language } from "../lib/translations";

const taskIcons: { type: TaskType; icon: React.ReactNode }[] = [
  { type: "video", icon: <Play className="w-4 h-4" /> },
  { type: "reading", icon: <BookOpen className="w-4 h-4" /> },
  { type: "quiz", icon: <FileText className="w-4 h-4" /> },
];

interface SubjectCardProps {
  subject: Subject;
  language: Language;
  onToggleTask: (subjectId: string, taskType: TaskType) => void;
  onToggleReleased: (subjectId: string) => void;
  onDelete: (subjectId: string) => void;
}

export default function SubjectCard({
  subject,
  language,
  onToggleTask,
  onToggleReleased,
  onDelete,
}: SubjectCardProps) {
  const completedCount = subject.tasks.filter((t) => t.completed).length;
  const totalCount = subject.tasks.length;
  const isFullyComplete = completedCount === totalCount;
  const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div
      className={`rounded-xl border-2 p-6 transition-all duration-300 flex flex-col ${
        isFullyComplete
          ? "border-emerald-500/60 bg-emerald-900/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          : "border-slate-700/50 bg-slate-800/60 hover:border-slate-600"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">{subject.name}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleReleased(subject.id)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              subject.released
                ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300"
            }`}
            title={subject.released ? t(language, "subject.markUnreleased") : t(language, "subject.markReleased")}
          >
            <Rocket className="w-3.5 h-3.5" />
            {subject.released ? t(language, "subject.released") : t(language, "subject.unreleased")}
          </button>
          <button
            type="button"
            onClick={() => onDelete(subject.id)}
            className="text-slate-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
            aria-label={`Delete ${subject.name}`}
            title={t(language, "subject.deleteSubject")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {taskIcons.map((taskIcon) => {
          const task = subject.tasks.find((t) => t.type === taskIcon.type);
          const isDone = task?.completed ?? false;
          return (
            <label
              key={taskIcon.type}
              className={`flex items-center gap-3 cursor-pointer select-none group ${
                isDone ? "opacity-50" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-500 group-hover:border-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isDone}
                  onChange={() => onToggleTask(subject.id, taskIcon.type)}
                />
                {isDone && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`flex items-center gap-2 text-sm ${
                  isDone
                    ? "text-slate-400 line-through"
                    : "text-slate-200"
                }`}
              >
                {taskIcon.icon}
                {t(language, `subject.${taskIcon.type}`)}
              </span>
            </label>
          );
        })}
      </div>

      <div className="space-y-1.5 mt-5">
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>{t(language, "subject.progress")}</span>
          <span>
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
