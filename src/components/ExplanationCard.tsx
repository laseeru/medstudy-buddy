import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Stethoscope, Search, Pill, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="animate-slide-up">
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-6 capitalize">
        {topic}
      </h2>

      <div className="space-y-4">
        {sections.map(({ key, icon: Icon, title, content, color, bgColor }) => {
          if (!content) return null;
          
          return (
            <div
              key={key}
              className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
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
