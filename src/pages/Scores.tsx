import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { useScores } from '@/hooks/useScores';
import { Button } from '@/components/ui/button';
import { ClipboardList, HelpCircle, Percent, Trash2, BookMarked } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Scores = () => {
  const { t, language } = useLanguage();
  const { getStats, savedQuestions, deleteQuestion, quizResults } = useScores();
  const stats = getStats();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            {t('scores.title')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'es' 
              ? 'Tu progreso de estudio guardado localmente'
              : 'Your study progress saved locally'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up">
          <StatsCard
            icon={ClipboardList}
            label={t('scores.totalQuizzes')}
            value={stats.totalQuizzes}
            variant="primary"
          />
          <StatsCard
            icon={HelpCircle}
            label={t('scores.totalQuestions')}
            value={stats.totalQuestions}
            variant="secondary"
          />
          <StatsCard
            icon={Percent}
            label={t('scores.averageScore')}
            value={`${stats.averageScore}%`}
            variant="accent"
          />
        </div>

        {/* Recent Quizzes */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
            {t('scores.recentQuizzes')}
          </h2>
          
          {stats.recentQuizzes.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground">{t('scores.noData')}</p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="divide-y divide-border">
                {stats.recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{quiz.topic}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(quiz.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-lg font-semibold',
                        quiz.score / quiz.totalQuestions >= 0.6 ? 'text-success' : 'text-destructive'
                      )}>
                        {quiz.score}/{quiz.totalQuestions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Simple Bar Chart */}
        {stats.recentQuizzes.length > 0 && (
          <section className="mb-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              {language === 'es' ? 'Últimos 5 Cuestionarios' : 'Last 5 Quizzes'}
            </h2>
            <div className="bg-card rounded-xl border border-border shadow-card p-6">
              <div className="flex items-end justify-between gap-2 h-32">
                {stats.recentQuizzes.slice(0, 5).reverse().map((quiz, i) => {
                  const percentage = (quiz.score / quiz.totalQuestions) * 100;
                  return (
                    <div key={quiz.id} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={cn(
                          'w-full rounded-t-md transition-all',
                          percentage >= 60 ? 'bg-success' : 'bg-secondary'
                        )}
                        style={{ height: `${Math.max(percentage, 10)}%` }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {quiz.score}/{quiz.totalQuestions}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Saved Questions */}
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookMarked className="h-5 w-5" />
            {t('scores.savedQuestions')}
          </h2>
          
          {savedQuestions.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground">
                {language === 'es' 
                  ? 'No hay preguntas guardadas aún'
                  : 'No saved questions yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedQuestions.slice(0, 10).map((q) => (
                <div key={q.id} className="bg-card rounded-xl border border-border shadow-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          {q.topic}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground capitalize">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-foreground text-sm line-clamp-2">{q.question}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(q.date)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteQuestion(q.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Scores;
