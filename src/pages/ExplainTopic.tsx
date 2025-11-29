import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { TopicInput } from '@/components/TopicInput';
import { ExplanationCard } from '@/components/ExplanationCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ExplanationData {
  definition: string;
  clinicalFeatures: string;
  diagnosis: string;
  treatment: string;
  lowResourceConsiderations: string;
}

const ExplainTopic = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);

  const explainTopic = async (topic: string) => {
    setIsLoading(true);
    setCurrentTopic(topic);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock explanation - in production this would come from the AI
    const mockExplanations: { [key: string]: ExplanationData } = {
      es: {
        definition: `${topic} es una condición médica caracterizada por cambios patológicos específicos. Esta definición abarca los aspectos fundamentales de la enfermedad y su impacto en el organismo.`,
        clinicalFeatures: `Los pacientes con ${topic} típicamente presentan:\n• Síntoma principal característico\n• Signos clínicos asociados\n• Manifestaciones sistémicas comunes\n• Complicaciones potenciales a largo plazo`,
        diagnosis: `El diagnóstico de ${topic} se basa en:\n• Historia clínica detallada\n• Examen físico completo\n• Estudios de laboratorio específicos\n• Imagenología cuando está indicada`,
        treatment: `El manejo de ${topic} incluye:\n• Tratamiento de primera línea\n• Opciones terapéuticas alternativas\n• Monitoreo y seguimiento\n• Educación al paciente`,
        lowResourceConsiderations: `En entornos de recursos limitados:\n• Priorizar diagnóstico clínico\n• Utilizar medicamentos esenciales disponibles\n• Implementar seguimiento comunitario\n• Considerar referencias oportunas cuando sea necesario`,
      },
      en: {
        definition: `${topic} is a medical condition characterized by specific pathological changes. This definition encompasses the fundamental aspects of the disease and its impact on the body.`,
        clinicalFeatures: `Patients with ${topic} typically present with:\n• Main characteristic symptom\n• Associated clinical signs\n• Common systemic manifestations\n• Potential long-term complications`,
        diagnosis: `Diagnosis of ${topic} is based on:\n• Detailed clinical history\n• Complete physical examination\n• Specific laboratory studies\n• Imaging when indicated`,
        treatment: `Management of ${topic} includes:\n• First-line treatment\n• Alternative therapeutic options\n• Monitoring and follow-up\n• Patient education`,
        lowResourceConsiderations: `In low-resource settings:\n• Prioritize clinical diagnosis\n• Use available essential medications\n• Implement community follow-up\n• Consider timely referrals when necessary`,
      },
    };

    setExplanation(mockExplanations[language]);
    setIsLoading(false);
  };

  const handleExplainAnother = () => {
    setExplanation(null);
    setCurrentTopic('');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
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
          <div className="bg-card rounded-xl border border-border shadow-card p-6 animate-slide-up">
            <TopicInput
              onSubmit={explainTopic}
              isLoading={isLoading}
              showDifficulty={false}
              placeholder={t('explain.placeholder')}
              buttonText={t('explain.button')}
              loadingText={t('explain.explaining')}
            />
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
