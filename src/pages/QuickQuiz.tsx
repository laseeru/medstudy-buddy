import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { TopicInput } from '@/components/TopicInput';
import { MCQCard } from '@/components/MCQCard';
import { useScores } from '@/hooks/useScores';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Home, RefreshCw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

type QuizState = 'setup' | 'playing' | 'results';

const QuickQuiz = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { addQuizResult } = useScores();
  
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ selected: string; isCorrect: boolean }[]>([]);
  const [showCurrentAnswer, setShowCurrentAnswer] = useState(false);

  const generateQuiz = async (topic: string) => {
    setIsLoading(true);
    setCurrentTopic(topic);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock questions - in production these would come from the AI
    const mockQuestions: QuizQuestion[] = Array.from({ length: 5 }, (_, i) => ({
      question: language === 'es' 
        ? `Pregunta ${i + 1} sobre ${topic}: ¿Cuál es la respuesta correcta?`
        : `Question ${i + 1} about ${topic}: What is the correct answer?`,
      options: language === 'es'
        ? [
            'A) Primera opción de respuesta',
            'B) Segunda opción de respuesta',
            'C) Tercera opción de respuesta',
            'D) Cuarta opción de respuesta',
          ]
        : [
            'A) First answer option',
            'B) Second answer option',
            'C) Third answer option',
            'D) Fourth answer option',
          ],
      correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      explanation: language === 'es'
        ? `Esta es la explicación de por qué la respuesta correcta es la indicada para la pregunta ${i + 1}.`
        : `This is the explanation of why the correct answer is indicated for question ${i + 1}.`,
    }));

    setQuestions(mockQuestions);
    setQuizState('playing');
    setIsLoading(false);
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    setAnswers([...answers, { selected: answer, isCorrect }]);
    setShowCurrentAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowCurrentAnswer(false);
    } else {
      // Quiz finished
      const score = answers.filter(a => a.isCorrect).length;
      addQuizResult({
        topic: currentTopic,
        score,
        totalQuestions: questions.length,
        language,
      });
      setQuizState('results');
    }
  };

  const restartQuiz = () => {
    setQuizState('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setShowCurrentAnswer(false);
  };

  const score = answers.filter(a => a.isCorrect).length;
  const progress = ((currentIndex + (showCurrentAnswer ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {quizState === 'setup' && (
          <>
            <div className="mb-8 animate-fade-in">
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                {t('quiz.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('action.quickQuiz.desc')}
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-card p-6 animate-slide-up">
              <TopicInput
                onSubmit={generateQuiz}
                isLoading={isLoading}
                showDifficulty={false}
                buttonText={t('quiz.start')}
                loadingText={t('common.loading')}
              />
            </div>
          </>
        )}

        {quizState === 'playing' && questions.length > 0 && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {t('quiz.question')} {currentIndex + 1} {t('quiz.of')} {questions.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {currentTopic}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <MCQCard
              question={questions[currentIndex].question}
              options={questions[currentIndex].options}
              correctAnswer={questions[currentIndex].correctAnswer}
              explanation={questions[currentIndex].explanation}
              interactive={!showCurrentAnswer}
              onAnswerSelect={handleAnswer}
              selectedAnswer={answers[currentIndex]?.selected || null}
              showResult={showCurrentAnswer}
            />

            {showCurrentAnswer && (
              <Button
                className="w-full mt-4"
                onClick={handleNext}
              >
                {currentIndex < questions.length - 1 ? t('quiz.next') : t('quiz.finish')}
              </Button>
            )}
          </div>
        )}

        {quizState === 'results' && (
          <div className="animate-fade-in">
            <div className="bg-card rounded-xl border border-border shadow-card p-8 text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {t('quiz.results')}
              </h2>
              
              <p className="text-muted-foreground mb-6">{currentTopic}</p>

              <div className="text-5xl font-serif font-bold text-primary mb-2">
                {score}/{questions.length}
              </div>
              
              <p className="text-muted-foreground">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-card p-4 mb-6">
              <h3 className="font-medium text-foreground mb-4">{t('quiz.results')}</h3>
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg',
                      answers[i]?.isCorrect ? 'bg-success/10' : 'bg-destructive/10'
                    )}
                  >
                    {answers[i]?.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {q.question}
                      </p>
                      {!answers[i]?.isCorrect && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('mcq.correctAnswer')}: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={restartQuiz}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('quiz.tryAgain')}
              </Button>
              <Button className="flex-1" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                {t('quiz.backHome')}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuickQuiz;
