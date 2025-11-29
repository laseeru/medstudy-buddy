import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Eye, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MCQCardProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  onSave?: () => void;
  isSaved?: boolean;
  interactive?: boolean;
  onAnswerSelect?: (answer: string, isCorrect: boolean) => void;
  selectedAnswer?: string | null;
  showResult?: boolean;
}

export function MCQCard({
  question,
  options,
  correctAnswer,
  explanation,
  onSave,
  isSaved = false,
  interactive = true,
  onAnswerSelect,
  selectedAnswer: externalSelectedAnswer,
  showResult: externalShowResult,
}: MCQCardProps) {
  const { t } = useLanguage();
  const [internalSelectedAnswer, setInternalSelectedAnswer] = useState<string | null>(null);
  const [internalShowResult, setInternalShowResult] = useState(false);

  const selectedAnswer = externalSelectedAnswer !== undefined ? externalSelectedAnswer : internalSelectedAnswer;
  const showResult = externalShowResult !== undefined ? externalShowResult : internalShowResult;

  const handleOptionClick = (option: string) => {
    if (showResult || !interactive) return;
    
    const letter = option.charAt(0);
    if (onAnswerSelect) {
      onAnswerSelect(letter, letter === correctAnswer);
    } else {
      setInternalSelectedAnswer(letter);
    }
  };

  const handleShowAnswer = () => {
    setInternalShowResult(true);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="bg-gradient-card rounded-xl border border-border shadow-card p-6 animate-scale-in">
      <p className="text-lg font-medium text-foreground mb-6 leading-relaxed">
        {question}
      </p>

      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const letter = option.charAt(0);
          const isSelected = selectedAnswer === letter;
          const isCorrectOption = letter === correctAnswer;
          
          let optionStyle = 'border-border hover:border-primary/50 hover:bg-muted/50';
          if (showResult) {
            if (isCorrectOption) {
              optionStyle = 'border-success bg-success/10 text-success';
            } else if (isSelected && !isCorrectOption) {
              optionStyle = 'border-destructive bg-destructive/10 text-destructive';
            } else {
              optionStyle = 'border-border opacity-60';
            }
          } else if (isSelected) {
            optionStyle = 'border-primary bg-primary/10';
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={showResult || !interactive}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
                optionStyle,
                interactive && !showResult && 'cursor-pointer'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
                  {letter}
                </span>
                <span className="flex-1 pt-0.5">{option.substring(3)}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!showResult && selectedAnswer && !onAnswerSelect && (
        <Button onClick={handleShowAnswer} className="w-full mb-4" variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          {t('mcq.showAnswer')}
        </Button>
      )}

      {showResult && (
        <div className="space-y-4 animate-slide-up">
          <div className={cn(
            'p-4 rounded-lg',
            isCorrect ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'
          )}>
            <p className="font-medium mb-1">
              {t('mcq.correctAnswer')}: <span className="text-primary">{correctAnswer}</span>
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">{t('mcq.explanation')}</p>
            <p className="text-foreground leading-relaxed">{explanation}</p>
          </div>
        </div>
      )}

      {showResult && onSave && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            onClick={onSave}
            disabled={isSaved}
            variant={isSaved ? 'outline' : 'default'}
            size="sm"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                {t('mcq.saved')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t('mcq.save')}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
