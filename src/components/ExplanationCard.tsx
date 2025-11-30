import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Stethoscope, Search, Pill, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ExplanationSection {
  definition?: string;
  clinicalFeatures?: string;
  diagnosis?: string;
  treatment?: string;
  lowResourceConsiderations?: string;
}

interface ExplanationCardProps {
  topic: string;
  explanation: ExplanationSection;
}

export function ExplanationCard({ topic, explanation }: ExplanationCardProps) {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const sections = [
    {
      key: 'definition',
      icon: BookOpen,
      title: t('explain.definition'),
      content: explanation.definition,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      key: 'clinicalFeatures',
      icon: Stethoscope,
      title: t('explain.features'),
      content: explanation.clinicalFeatures,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      key: 'diagnosis',
      icon: Search,
      title: t('explain.diagnosis'),
      content: explanation.diagnosis,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/30',
    },
    {
      key: 'treatment',
      icon: Pill,
      title: t('explain.treatment'),
      content: explanation.treatment,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      key: 'lowResourceConsiderations',
      icon: AlertTriangle,
      title: t('explain.lowResource'),
      content: explanation.lowResourceConsiderations,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    toast.success(t('feedback.thanks') || "Thanks for your feedback!");
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground capitalize">
          {topic}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFeedback('up')}
            className={cn("h-8 px-2", feedback === 'up' && "text-primary bg-primary/10")}
            disabled={!!feedback}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFeedback('down')}
            className={cn("h-8 px-2", feedback === 'down' && "text-destructive bg-destructive/10")}
            disabled={!!feedback}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map(({ key, icon: Icon, title, content, color, bgColor }) => {
          if (!content) return null;
          
          return (
            <div
              key={key}
              className="bg-card rounded-xl border border-border shadow-card overflow-hidden transition-colors duration-300"
            >
              <div className={`flex items-center gap-3 px-4 py-3 ${bgColor}`}>
                <Icon className={`h-5 w-5 ${color}`} />
                <h3 className={`font-medium ${color}`}>{title}</h3>
              </div>
              <div className="p-4">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
