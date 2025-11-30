import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { TopicInput } from '@/components/TopicInput';
import { ExplanationCard } from '@/components/ExplanationCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { explainTopic, ExplanationData } from '@/lib/api';

const ExplainTopic = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);

  const handleExplainTopic = async (topic: string) => {
    setIsLoading(true);
    setCurrentTopic(topic);
    setExplanation(null);

    try {
      const data = await explainTopic(topic, language);
      setExplanation(data);
    } catch (error) {
      console.error('Error explaining topic:', error);
      toast.error(
        language === 'es' 
          ? 'Error al explicar el tema. Intenta de nuevo.'
          : 'Error explaining topic. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainAnother = () => {
    setExplanation(null);
    setCurrentTopic('');
  };

  return (
    <div className="min-h-screen bg-gradient-hero transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            {t('explain.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('action.explainTopic.desc')}
          </p>
        </div>

        {!explanation && (
          <div className="bg-card rounded-xl border border-border shadow-card p-6 animate-slide-up transition-colors duration-300">
            <TopicInput
              onSubmit={handleExplainTopic}
              isLoading={isLoading}
              showDifficulty={false}
              placeholder={t('explain.placeholder')}
              buttonText={t('explain.button')}
              loadingText={t('explain.explaining')}
            />
          </div>
        )}

        {isLoading && (
          <div className="mt-6 bg-card rounded-xl border border-border shadow-card p-6 space-y-6 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        )}

        {explanation && (
          <div className="space-y-6">
            <ExplanationCard topic={currentTopic} explanation={explanation} />
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleExplainAnother}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'es' ? 'Explicar otro tema' : 'Explain another topic'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplainTopic;
