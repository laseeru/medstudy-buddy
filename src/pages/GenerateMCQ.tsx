import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { TopicInput } from '@/components/TopicInput';
import { MCQCard } from '@/components/MCQCard';
import { useScores } from '@/hooks/useScores';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { generateMCQ, MCQData } from '@/lib/api';

const GenerateMCQ = () => {
  const { t, language } = useLanguage();
  const { saveQuestion } = useScores();
  const [isLoading, setIsLoading] = useState(false);
  const [currentMCQ, setCurrentMCQ] = useState<MCQData | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerateMCQ = async (topic: string, difficulty?: string) => {
    setIsLoading(true);
    setCurrentTopic(topic);
    setCurrentDifficulty((difficulty as 'easy' | 'medium' | 'hard') || 'medium');
    setIsSaved(false);
    setCurrentMCQ(null);

    try {
      const mcq = await generateMCQ(
        topic,
        (difficulty as 'easy' | 'medium' | 'hard') || 'medium',
        language
      );
      setCurrentMCQ(mcq);
    } catch (error) {
      console.error('Error generating MCQ:', error);
      toast.error(
        language === 'es' 
          ? 'Error al generar la pregunta. Intenta de nuevo.'
          : 'Error generating question. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
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
      handleGenerateMCQ(currentTopic, currentDifficulty);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero transition-colors duration-300">
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

        <div className="bg-card rounded-xl border border-border shadow-card p-6 mb-8 animate-slide-up transition-colors duration-300">
          <TopicInput
            onSubmit={handleGenerateMCQ}
            isLoading={isLoading}
            showDifficulty={true}
            buttonText={t('mcq.generate')}
            loadingText={t('mcq.generating')}
          />
        </div>

        {isLoading && (
          <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6 animate-pulse">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {!isLoading && currentMCQ && (
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
