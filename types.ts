
export interface LessonPlanData {
  concepts: string[];
  learning_outcomes: string[];
  pedagogical_strategies: string[];
  assessment_format: string[];
  resources: string[];
  real_life_applications: string[];
  values_skills: string[];
  reflections_and_remedial_plan: string[];
}

export interface LessonPlan extends LessonPlanData {
  id: string;
  timestamp: number;
  meta: {
    classNumber: string;
    subject: string;
    dateRange: string;
  }
}

export interface FileAttachment {
  name: string;
  mimeType: string;
  data: string; // base64 encoded string
}

export interface SignatureImages {
  teacher: string | null;
  principal: string | null;
}
