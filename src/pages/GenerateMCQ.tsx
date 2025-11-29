import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { TopicInput } from '@/components/TopicInput';
import { MCQCard } from '@/components/MCQCard';
import { useScores } from '@/hooks/useScores';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedMCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const GenerateMCQ = () => {
  const { t, language } = useLanguage();
  const { saveQuestion, savedQuestions } = useScores();
  const [isLoading, setIsLoading] = useState(false);
  const [currentMCQ, setCurrentMCQ] = useState<GeneratedMCQ | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');
  const [isSaved, setIsSaved] = useState(false);

  const generateMCQ = async (topic: string, difficulty?: string) => {
    setIsLoading(true);
    setCurrentTopic(topic);
    setCurrentDifficulty(difficulty || 'medium');
    setIsSaved(false);

    // Simulate AI generation (will be replaced with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response - in production this would come from the AI
    const mockMCQs: { [key: string]: GeneratedMCQ } = {
      es: {
        question: `Sobre ${topic}: ¿Cuál de las siguientes afirmaciones es correcta?`,
        options: [
          'A) Primera opción de respuesta relacionada con el tema',
          'B) Segunda opción que podría parecer correcta pero no lo es',
          'C) Tercera opción que representa un concepto erróneo común',
          'D) Cuarta opción que es la respuesta correcta',
        ],
        correctAnswer: 'D',
        explanation: `La opción D es correcta porque representa el concepto fundamental de ${topic}. Las otras opciones contienen errores conceptuales comunes que los estudiantes suelen cometer.`,
      },
      en: {
        question: `Regarding ${topic}: Which of the following statements is correct?`,
        options: [
          'A) First answer option related to the topic',
          'B) Second option that might seem correct but is not',
          'C) Third option representing a common misconception',
          'D) Fourth option which is the correct answer',
        ],
        correctAnswer: 'D',
        explanation: `Option D is correct because it represents the fundamental concept of ${topic}. The other options contain common conceptual errors that students often make.`,
      },
    };

    setCurrentMCQ(mockMCQs[language]);
    setIsLoading(false);
  };

  const handleSave = () => {
    if (currentMCQ && currentTopic) {
      saveQuestion({
        question: currentMCQ.question,
        options: currentMCQ.options,
        correctAnswer: currentMCQ.correctAnswer,
        explanation: currentMCQ.explanation,
        topic: currentTopic,
        difficulty: currentDifficulty,
        language,
      });
      setIsSaved(true);
      toast.success(t('mcq.saved'));
    }
  };

  const handleGenerateAnother = () => {
    if (currentTopic) {
      generateMCQ(currentTopic, currentDifficulty);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            {t('mcq.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('action.generateMcq.desc')}
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card p-6 mb-8 animate-slide-up">
          <TopicInput
            onSubmit={generateMCQ}
            isLoading={isLoading}
            showDifficulty={true}
            buttonText={t('mcq.generate')}
            loadingText={t('mcq.generating')}
          />
        </div>

        {currentMCQ && (
          <div className="space-y-4">
            <MCQCard
              question={currentMCQ.question}
              options={currentMCQ.options}
              correctAnswer={currentMCQ.correctAnswer}
              explanation={currentMCQ.explanation}
              onSave={handleSave}
              isSaved={isSaved}
            />
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGenerateAnother}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('mcq.another')}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default GenerateMCQ;
