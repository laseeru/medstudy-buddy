import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.scores': { es: 'Mis Puntuaciones', en: 'My Scores' },
  
  // Home page
  'home.title': { es: 'MedEstudia', en: 'MedEstudia' },
  'home.subtitle': { es: 'Tu asistente de estudio médico con IA', en: 'Your AI Medical Study Assistant' },
  'home.description': { es: 'Prepárate para tus exámenes con preguntas generadas por IA, cuestionarios rápidos y explicaciones claras.', en: 'Prepare for your exams with AI-generated questions, quick quizzes, and clear explanations.' },
  
  // Main actions
  'action.generateMcq': { es: 'Generar Preguntas', en: 'Generate MCQs' },
  'action.generateMcq.desc': { es: 'Crea preguntas de opción múltiple sobre cualquier tema médico', en: 'Create multiple choice questions on any medical topic' },
  'action.quickQuiz': { es: 'Cuestionario Rápido', en: 'Quick Quiz' },
  'action.quickQuiz.desc': { es: '5 preguntas para evaluar tu conocimiento', en: '5 questions to test your knowledge' },
  'action.explainTopic': { es: 'Explicar Tema', en: 'Explain Topic' },
  'action.explainTopic.desc': { es: 'Obtén explicaciones claras de conceptos médicos', en: 'Get clear explanations of medical concepts' },
  'action.viewScores': { es: 'Ver Puntuaciones', en: 'View Scores' },
  
  // Generate MCQ page
  'mcq.title': { es: 'Generar Preguntas', en: 'Generate Questions' },
  'mcq.topicPlaceholder': { es: 'Ej: insuficiencia cardíaca, anatomía del hígado...', en: 'E.g.: heart failure, liver anatomy...' },
  'mcq.topicLabel': { es: 'Tema médico', en: 'Medical topic' },
  'mcq.difficulty': { es: 'Dificultad', en: 'Difficulty' },
  'mcq.easy': { es: 'Fácil', en: 'Easy' },
  'mcq.medium': { es: 'Medio', en: 'Medium' },
  'mcq.hard': { es: 'Difícil', en: 'Hard' },
  'mcq.generate': { es: 'Generar Pregunta', en: 'Generate Question' },
  'mcq.generating': { es: 'Generando...', en: 'Generating...' },
  'mcq.another': { es: 'Generar Otra', en: 'Generate Another' },
  'mcq.save': { es: 'Guardar Pregunta', en: 'Save Question' },
  'mcq.saved': { es: '¡Guardada!', en: 'Saved!' },
  'mcq.correctAnswer': { es: 'Respuesta correcta', en: 'Correct answer' },
  'mcq.explanation': { es: 'Explicación', en: 'Explanation' },
  'mcq.showAnswer': { es: 'Mostrar Respuesta', en: 'Show Answer' },
  
  // Quick Quiz page
  'quiz.title': { es: 'Cuestionario Rápido', en: 'Quick Quiz' },
  'quiz.start': { es: 'Iniciar Cuestionario', en: 'Start Quiz' },
  'quiz.question': { es: 'Pregunta', en: 'Question' },
  'quiz.of': { es: 'de', en: 'of' },
  'quiz.next': { es: 'Siguiente', en: 'Next' },
  'quiz.finish': { es: 'Terminar', en: 'Finish' },
  'quiz.results': { es: 'Resultados', en: 'Results' },
  'quiz.score': { es: 'Puntuación', en: 'Score' },
  'quiz.correct': { es: 'Correctas', en: 'Correct' },
  'quiz.incorrect': { es: 'Incorrectas', en: 'Incorrect' },
  'quiz.tryAgain': { es: 'Intentar de Nuevo', en: 'Try Again' },
  'quiz.backHome': { es: 'Volver al Inicio', en: 'Back to Home' },
  
  // Explain Topic page
  'explain.title': { es: 'Explicar Tema', en: 'Explain Topic' },
  'explain.placeholder': { es: 'Ej: síndrome nefrótico, diabetes mellitus...', en: 'E.g.: nephrotic syndrome, diabetes mellitus...' },
  'explain.button': { es: 'Explicar', en: 'Explain' },
  'explain.explaining': { es: 'Explicando...', en: 'Explaining...' },
  'explain.definition': { es: 'Definición', en: 'Definition' },
  'explain.features': { es: 'Características Clínicas', en: 'Clinical Features' },
  'explain.diagnosis': { es: 'Diagnóstico', en: 'Diagnosis' },
  'explain.treatment': { es: 'Tratamiento', en: 'Treatment' },
  'explain.lowResource': { es: 'Consideraciones de Recursos Limitados', en: 'Low-Resource Considerations' },
  
  // Scores page
  'scores.title': { es: 'Mis Puntuaciones', en: 'My Scores' },
  'scores.totalQuizzes': { es: 'Cuestionarios Totales', en: 'Total Quizzes' },
  'scores.totalQuestions': { es: 'Preguntas Totales', en: 'Total Questions' },
  'scores.averageScore': { es: 'Puntuación Promedio', en: 'Average Score' },
  'scores.recentQuizzes': { es: 'Cuestionarios Recientes', en: 'Recent Quizzes' },
  'scores.noData': { es: 'No hay datos aún. ¡Completa un cuestionario para comenzar!', en: 'No data yet. Complete a quiz to get started!' },
  'scores.savedQuestions': { es: 'Preguntas Guardadas', en: 'Saved Questions' },
  
  // Common
  'common.loading': { es: 'Cargando...', en: 'Loading...' },
  'common.error': { es: 'Ocurrió un error', en: 'An error occurred' },
  'common.back': { es: 'Volver', en: 'Back' },
  'common.topic': { es: 'Tema', en: 'Topic' },
  'common.date': { es: 'Fecha', en: 'Date' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('medEstudia_language');
    return (saved as Language) || 'es';
  });

  useEffect(() => {
    localStorage.setItem('medEstudia_language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
