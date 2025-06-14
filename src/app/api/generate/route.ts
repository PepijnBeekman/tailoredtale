import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Listener {
  name: string;
  description: string;
}

interface SimpleCharacter {
  name: string;
  description: string;
}

interface PromptInput {
  language: 'nl' | 'en';
  listeners?: Listener[];             
  simpleCharacters?: SimpleCharacter[]; 
  storyLanguage?: string;             
  elements: string;
  synopsis: string;
  moral: string;
  authorStyle: string;
}


export async function POST(req: NextRequest) {
  try {
    const body: PromptInput = await req.json();
    const prompt = buildPrompt(body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Je bent een creatieve, grappige en ontroerende verhalenverteller voor kinderen.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 1200,
      }),
    });

    const json = await response.json();
    const story = json.choices?.[0]?.message?.content;

    return NextResponse.json({ story });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

function buildPrompt(data: PromptInput): string {
  const lang = data.storyLanguage?.trim() || (data.language === 'en' ? 'English' : 'Nederlands');
  const intro = `Schrijf een ${data.language === 'en' ? 'fun and original' : 'leuk en origineel'} voorleesverhaaltje in het ${lang}.`;

  const luisteraars = data.listeners?.length
    ? `Het is bedoeld voor: ${data.listeners.map(l => `${l.name} (${l.description})`).join(', ')}.`
    : '';

  const personages = data.simpleCharacters?.length
    ? `De hoofdpersonages zijn: ${data.simpleCharacters.map(p => `${p.name} (${p.description})`).join(', ')}.`
    : '';

  const stijl = data.authorStyle?.trim()
    ? `Schrijf het in de stijl van ${data.authorStyle.trim()}.`
    : '';

  return `
${intro}

${luisteraars}
${personages}

Verhaallijn: ${data.synopsis}
Details: ${data.elements}
Boodschap: ${data.moral}
${stijl}
`.trim();
}
