import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { FileQuestion, Timer, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: FileQuestion,
      title: t('action.generateMcq'),
      description: t('action.generateMcq.desc'),
      href: '/generate-mcq',
      color: 'primary',
    },
    {
      icon: Timer,
      title: t('action.quickQuiz'),
      description: t('action.quickQuiz.desc'),
      href: '/quick-quiz',
      color: 'secondary',
    },
    {
      icon: BookOpen,
      title: t('action.explainTopic'),
      description: t('action.explainTopic.desc'),
      href: '/explain-topic',
      color: 'accent',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Study Assistant</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('home.title')}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed mb-4">
            {t('home.subtitle')}
          </p>
          
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            {t('home.description')}
          </p>
        </section>

        {/* Feature Cards */}
        <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              primary: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
              secondary: 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground',
              accent: 'bg-accent/30 text-accent-foreground group-hover:bg-accent',
            };
            
            return (
              <Link
                key={feature.href}
                to={feature.href}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-card rounded-xl border border-border p-6 h-full shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-slide-up">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    <span>Get Started</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        {/* View Scores CTA */}
        <section className="text-center mt-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button variant="hero-secondary" asChild>
            <Link to="/scores">
              {t('action.viewScores')}
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Index;
