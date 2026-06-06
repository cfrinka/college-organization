export type TaskType = "video" | "reading" | "quiz";

export interface Task {
  type: TaskType;
  completed: boolean;
}

export interface Course {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  courseId: string;
  tasks: Task[];
  released: boolean;
}
