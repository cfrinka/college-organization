export type Language = "en" | "pt-BR";

export const translations = {
  en: {
    header: {
      title: "College Task Dashboard",
      subtitle: "Manage your coursework across all subjects",
      resetAllTasks: "Reset All Tasks",
    },
    course: {
      addCourse: "Add Course",
      placeholder: "Add a new course (e.g. Fall 2026)",
      noCourses: "No courses yet",
      noCoursesDesc: "Add a course above to start organizing your subjects.",
      deleteCourse: "Delete course",
    },
    subject: {
      addSubject: "Add Subject",
      selectCourse: "Select a course",
      placeholder: "Calculus, History 101, Biology",
      noSubjects: "No subjects in this course yet.",
      deleteSubject: "Delete subject",
      video: "Video",
      reading: "Reading",
      quiz: "Quiz",
      progress: "Progress",
      released: "Released",
      unreleased: "Unreleased",
      markReleased: "Mark as released",
      markUnreleased: "Mark as unreleased",
    },
    modal: {
      resetTitle: "Reset All Tasks",
      resetMessage: "Are you sure you want to reset all tasks? This will mark all tasks as incomplete.",
      confirm: "Confirm",
      cancel: "Cancel",
    },
  },
  "pt-BR": {
    header: {
      title: "Painel de Tarefas da Faculdade",
      subtitle: "Gerencie suas tarefas em todas as matérias",
      resetAllTasks: "Redefinir Todas as Tarefas",
    },
    course: {
      addCourse: "Adicionar Curso",
      placeholder: "Adicionar um novo curso (ex: 2026.1)",
      noCourses: "Nenhum curso ainda",
      noCoursesDesc: "Adicione um curso acima para começar a organizar suas matérias.",
      deleteCourse: "Excluir curso",
    },
    subject: {
      addSubject: "Adicionar Matéria",
      selectCourse: "Selecione um curso",
      placeholder: "Cálculo, História 101, Biologia",
      noSubjects: "Nenhuma matéria neste curso ainda.",
      deleteSubject: "Excluir matéria",
      video: "Vídeo",
      reading: "Leitura",
      quiz: "Quiz",
      progress: "Progresso",
      released: "Liberado",
      unreleased: "Não liberado",
      markReleased: "Marcar como liberado",
      markUnreleased: "Marcar como não liberado",
    },
    modal: {
      resetTitle: "Redefinir Todas as Tarefas",
      resetMessage: "Tem certeza que deseja redefinir todas as tarefas? Isso marcará todas as tarefas como não concluídas.",
      confirm: "Confirmar",
      cancel: "Cancelar",
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
export type NestedTranslationKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? NestedTranslationKeys<T[K]> : K;
    }[keyof T]
  : never;

export function t(lang: Language, key: string): string {
  const keys = key.split(".");
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
