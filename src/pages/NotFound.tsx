import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6 animate-scale-in">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="font-serif text-5xl font-bold text-foreground mb-4 animate-fade-in">
          404
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Oops! Page not found
        </p>
        
        <Button asChild className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
