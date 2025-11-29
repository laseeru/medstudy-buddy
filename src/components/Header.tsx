import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Home, BarChart3, Globe } from 'lucide-react';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif font-bold text-lg shadow-soft group-hover:shadow-elevated transition-shadow">
            M
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">
            MedEstudia
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {!isHome && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.home')}</span>
              </Link>
            </Button>
          )}
          
          <Button variant="ghost" size="sm" asChild>
            <Link to="/scores" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.scores')}</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex items-center gap-2 min-w-[70px]"
          >
            <Globe className="h-4 w-4" />
            <span className="font-medium">{language === 'es' ? 'ES' : 'EN'}</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
