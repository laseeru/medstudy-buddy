import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';

interface TopicInputProps {
  onSubmit: (topic: string, difficulty?: string) => void;
  isLoading?: boolean;
  showDifficulty?: boolean;
  placeholder?: string;
  buttonText?: string;
  loadingText?: string;
}

export function TopicInput({
  onSubmit,
  isLoading = false,
  showDifficulty = false,
  placeholder,
  buttonText,
  loadingText,
}: TopicInputProps) {
  const { t } = useLanguage();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim(), showDifficulty ? difficulty : undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-sm font-medium">
          {t('mcq.topicLabel')}
        </Label>
        <Input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={placeholder || t('mcq.topicPlaceholder')}
          className="h-12 text-base"
          disabled={isLoading}
        />
      </div>

      {showDifficulty && (
        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-sm font-medium">
            {t('mcq.difficulty')}
          </Label>
          <Select value={difficulty} onValueChange={setDifficulty} disabled={isLoading}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">{t('mcq.easy')}</SelectItem>
              <SelectItem value="medium">{t('mcq.medium')}</SelectItem>
              <SelectItem value="hard">{t('mcq.hard')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12"
        disabled={!topic.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {loadingText || t('mcq.generating')}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            {buttonText || t('mcq.generate')}
          </>
        )}
      </Button>
    </form>
  );
}
