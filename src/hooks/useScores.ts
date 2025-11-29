import { useState, useEffect } from 'react';

export interface QuizResult {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
  language: 'es' | 'en';
}

export interface SavedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: string;
  date: string;
  language: 'es' | 'en';
}

interface ScoresData {
  quizResults: QuizResult[];
  savedQuestions: SavedQuestion[];
}

const STORAGE_KEY = 'medEstudia_scores';

export function useScores() {
  const [data, setData] = useState<ScoresData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { quizResults: [], savedQuestions: [] };
      }
    }
    return { quizResults: [], savedQuestions: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addQuizResult = (result: Omit<QuizResult, 'id' | 'date'>) => {
    const newResult: QuizResult = {
      ...result,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      quizResults: [newResult, ...prev.quizResults].slice(0, 50), // Keep last 50
    }));
  };

  const saveQuestion = (question: Omit<SavedQuestion, 'id' | 'date'>) => {
    const newQuestion: SavedQuestion = {
      ...question,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      savedQuestions: [newQuestion, ...prev.savedQuestions].slice(0, 100), // Keep last 100
    }));
  };

  const deleteQuestion = (id: string) => {
    setData(prev => ({
      ...prev,
      savedQuestions: prev.savedQuestions.filter(q => q.id !== id),
    }));
  };

  const getStats = () => {
    const { quizResults } = data;
    if (quizResults.length === 0) {
      return {
        totalQuizzes: 0,
        totalQuestions: 0,
        averageScore: 0,
        recentQuizzes: [],
      };
    }

    const totalQuizzes = quizResults.length;
    const totalQuestions = quizResults.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = quizResults.reduce((sum, r) => sum + r.score, 0);
    const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return {
      totalQuizzes,
      totalQuestions,
      averageScore,
      recentQuizzes: quizResults.slice(0, 5),
    };
  };

  return {
    quizResults: data.quizResults,
    savedQuestions: data.savedQuestions,
    addQuizResult,
    saveQuestion,
    deleteQuestion,
    getStats,
  };
}
