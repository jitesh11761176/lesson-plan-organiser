
import { GoogleGenAI, Type } from '@google/genai';
import { LessonPlanData, FileAttachment } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set. Please provide a valid API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    concepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Key concepts to be covered in this lesson plan period.'
    },
    learning_outcomes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Specific, measurable learning outcomes students should achieve.'
    },
    pedagogical_strategies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Teaching methods and strategies to be used (e.g., lecture, group discussion, project-based learning).'
    },
    assessment_format: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Methods for assessing student learning (e.g., MCQs, short answers, practical exam).'
    },
    resources: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Required resources like textbooks, websites, software, or lab equipment.'
    },
    real_life_applications: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Examples of how the concepts apply to real-world scenarios.'
    },
    values_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Values and skills to be inculcated, like critical thinking, collaboration, or ethical considerations.'
    },
    reflections_and_remedial_plan: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Reflections on the previous teaching cycle and a concrete remedial plan for students who need extra support.'
    }
  },
  required: ['concepts', 'learning_outcomes', 'pedagogical_strategies', 'assessment_format', 'resources', 'real_life_applications', 'values_skills', 'reflections_and_remedial_plan']
};


export const generateLessonPlan = async (
  classNumber: string,
  subject: string,
  dateRange: string,
  file: FileAttachment,
  isBilingual: boolean,
  previousReflections: string[] | null
): Promise<LessonPlanData> => {
  let systemInstruction = "You are an expert KVS teacher who prepares fortnightly lesson plans in the NCERT format. Based on the provided split-up syllabus, generate lesson plans using the official KVS Lesson Organizer structure. Ensure your output is a valid JSON that adheres to the provided schema.";

  if (isBilingual) {
    systemInstruction += " Generate a bilingual (English + Hindi) lesson plan. For each point, provide the English version first, followed by the Hindi version in parentheses.";
  }
  
  let prompt = `
    Generate a lesson plan with the following details:
    - Class: ${classNumber}
    - Subject: ${subject}
    - Date Range: ${dateRange}

    The split-up syllabus is provided in the attached file. Analyze it and create the lesson plan.
  `;

  if (previousReflections && previousReflections.length > 0) {
    prompt += `\n\nIMPORTANT: Use the following reflections from the previous lesson cycle to inform the 'reflections_and_remedial_plan' section for this new plan: "${previousReflections.join(' ')}". Create a new, forward-looking remedial plan based on these past observations.`
  }


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: file.mimeType,
              data: file.data,
            },
          },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: lessonPlanSchema,
        temperature: 0.5,
      },
    });
    
    const responseText = response.text.trim();
    
    // In case the API wraps the JSON in markdown backticks
    const cleanedJsonText = responseText.replace(/^```json\s*|```\s*$/g, '');

    const parsedPlan: LessonPlanData = JSON.parse(cleanedJsonText);
    return parsedPlan;

  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw new Error('Failed to generate lesson plan. The AI model might be overloaded or the syllabus file could not be processed. Please try again.');
  }
};
