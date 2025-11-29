import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MCQRequest {
  type: 'mcq';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'es' | 'en';
}

interface QuizRequest {
  type: 'quiz';
  topic: string;
  language: 'es' | 'en';
  count?: number;
}

interface ExplainRequest {
  type: 'explain';
  topic: string;
  language: 'es' | 'en';
}

type RequestBody = MCQRequest | QuizRequest | ExplainRequest;

const getMCQPrompt = (topic: string, difficulty: string, language: string) => {
  if (language === 'es') {
    return `Genera exactamente 1 pregunta de opción múltiple de nivel médico sobre: ${topic}.
Dificultad: ${difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}

IMPORTANTE: Responde SOLO con un objeto JSON válido, sin texto adicional ni markdown.

El formato JSON debe ser exactamente:
{
  "question": "La pregunta aquí",
  "options": ["A) Primera opción", "B) Segunda opción", "C) Tercera opción", "D) Cuarta opción"],
  "correctAnswer": "A",
  "explanation": "Explicación breve de por qué esta es la respuesta correcta"
}

Asegúrate de que:
- La pregunta sea clínicamente relevante y precisa
- Las opciones estén bien diferenciadas
- Solo una opción sea claramente correcta
- La explicación sea concisa pero informativa
- Todo esté en español`;
  } else {
    return `Generate exactly 1 medical-level multiple choice question about: ${topic}.
Difficulty: ${difficulty}

IMPORTANT: Respond ONLY with a valid JSON object, no additional text or markdown.

The JSON format must be exactly:
{
  "question": "The question here",
  "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
  "correctAnswer": "A",
  "explanation": "Brief explanation of why this is the correct answer"
}

Ensure that:
- The question is clinically relevant and accurate
- Options are well differentiated
- Only one option is clearly correct
- The explanation is concise but informative`;
  }
};

const getQuizPrompt = (topic: string, count: number, language: string) => {
  if (language === 'es') {
    return `Genera exactamente ${count} preguntas de opción múltiple de nivel médico sobre: ${topic}.
Varía la dificultad entre las preguntas.

IMPORTANTE: Responde SOLO con un array JSON válido, sin texto adicional ni markdown.

El formato JSON debe ser exactamente:
[
  {
    "question": "Pregunta 1",
    "options": ["A) Opción", "B) Opción", "C) Opción", "D) Opción"],
    "correctAnswer": "A",
    "explanation": "Explicación"
  },
  ...
]

Asegúrate de que:
- Las preguntas sean variadas y cubran diferentes aspectos del tema
- Cada pregunta tenga exactamente 4 opciones (A, B, C, D)
- Las explicaciones sean concisas pero informativas
- Todo esté en español`;
  } else {
    return `Generate exactly ${count} medical-level multiple choice questions about: ${topic}.
Vary the difficulty across questions.

IMPORTANT: Respond ONLY with a valid JSON array, no additional text or markdown.

The JSON format must be exactly:
[
  {
    "question": "Question 1",
    "options": ["A) Option", "B) Option", "C) Option", "D) Option"],
    "correctAnswer": "A",
    "explanation": "Explanation"
  },
  ...
]

Ensure that:
- Questions are varied and cover different aspects of the topic
- Each question has exactly 4 options (A, B, C, D)
- Explanations are concise but informative`;
  }
};

const getExplainPrompt = (topic: string, language: string) => {
  if (language === 'es') {
    return `Explica el siguiente tema médico de manera clara y estructurada: ${topic}

IMPORTANTE: Responde SOLO con un objeto JSON válido, sin texto adicional ni markdown.

El formato JSON debe ser exactamente:
{
  "definition": "Definición clara del tema",
  "clinicalFeatures": "Características clínicas principales, síntomas y signos",
  "diagnosis": "Métodos de diagnóstico y criterios",
  "treatment": "Opciones de tratamiento principales",
  "lowResourceConsiderations": "Consideraciones para entornos de recursos limitados, adaptaciones prácticas para contextos como Cuba"
}

Asegúrate de que:
- El contenido sea médicamente preciso
- Use lenguaje claro pero profesional
- Incluya información práctica y relevante
- Las consideraciones de recursos limitados sean realistas y útiles
- Todo esté en español`;
  } else {
    return `Explain the following medical topic in a clear and structured way: ${topic}

IMPORTANT: Respond ONLY with a valid JSON object, no additional text or markdown.

The JSON format must be exactly:
{
  "definition": "Clear definition of the topic",
  "clinicalFeatures": "Main clinical features, symptoms and signs",
  "diagnosis": "Diagnostic methods and criteria",
  "treatment": "Main treatment options",
  "lowResourceConsiderations": "Considerations for low-resource settings, practical adaptations for contexts like Cuba"
}

Ensure that:
- Content is medically accurate
- Uses clear but professional language
- Includes practical and relevant information
- Low-resource considerations are realistic and useful`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const body: RequestBody = await req.json();
    console.log('Received request:', JSON.stringify(body));

    let prompt: string;
    let systemPrompt: string;

    if (body.language === 'es') {
      systemPrompt = `Eres un experto profesor de medicina especializado en educación médica para estudiantes cubanos. 
Tu rol es generar contenido educativo de alta calidad, preciso y relevante.
Siempre responde en formato JSON válido sin texto adicional.
Adapta el contenido al contexto médico cubano cuando sea relevante.`;
    } else {
      systemPrompt = `You are an expert medical professor specialized in medical education for Cuban students.
Your role is to generate high-quality, accurate, and relevant educational content.
Always respond in valid JSON format without additional text.
Adapt content to the Cuban medical context when relevant.`;
    }

    switch (body.type) {
      case 'mcq':
        prompt = getMCQPrompt(body.topic, body.difficulty, body.language);
        break;
      case 'quiz':
        prompt = getQuizPrompt(body.topic, body.count || 5, body.language);
        break;
      case 'explain':
        prompt = getExplainPrompt(body.topic, body.language);
        break;
      default:
        throw new Error('Invalid request type');
    }

    console.log('Calling Lovable AI Gateway...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Clean the response - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.slice(7);
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    // Parse and validate JSON
    const parsedContent = JSON.parse(cleanContent);
    console.log('Parsed content successfully');

    return new Response(JSON.stringify({ data: parsedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in medical-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
