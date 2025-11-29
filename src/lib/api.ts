import { supabase } from '@/integrations/supabase/client';

export interface MCQData {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExplanationData {
  definition: string;
  clinicalFeatures: string;
  diagnosis: string;
  treatment: string;
  lowResourceConsiderations: string;
}

export async function generateMCQ(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  language: 'es' | 'en'
): Promise<MCQData> {
  const { data, error } = await supabase.functions.invoke('medical-ai', {
    body: {
      type: 'mcq',
      topic,
      difficulty,
      language,
    },
  });

  if (error) {
    console.error('Error generating MCQ:', error);
    throw new Error(error.message || 'Failed to generate question');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.data as MCQData;
}

export async function generateQuiz(
  topic: string,
  language: 'es' | 'en',
  count: number = 5
): Promise<MCQData[]> {
  const { data, error } = await supabase.functions.invoke('medical-ai', {
    body: {
      type: 'quiz',
      topic,
      language,
      count,
    },
  });

  if (error) {
    console.error('Error generating quiz:', error);
    throw new Error(error.message || 'Failed to generate quiz');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.data as MCQData[];
}

export async function explainTopic(
  topic: string,
  language: 'es' | 'en'
): Promise<ExplanationData> {
  const { data, error } = await supabase.functions.invoke('medical-ai', {
    body: {
      type: 'explain',
      topic,
      language,
    },
  });

  if (error) {
    console.error('Error explaining topic:', error);
    throw new Error(error.message || 'Failed to explain topic');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.data as ExplanationData;
}
