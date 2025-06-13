import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // snellere cold starts op Vercel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = buildPrompt(body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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

function buildPrompt({
  language,
  characters,
  audience,
  elements,
  synopsis,
  moral,
  style,
  authorStyle,
}: any): string {
  const charDescriptions = characters.map((c: any, i: number) =>
    `Personage ${i + 1}: ${c.name}, ${c.age} jaar, ${c.gender}, ${c.description}, opvallend: ${c.quirks}.`).join('\n');

  const sliders = Object.entries(style)
    .map(([k, v]) => `${k}: ${v}/5`)
    .join(', ');

  const langIntro = language === 'nl' ? 'Schrijf een leuk, origineel Nederlandstalig voorleesverhaaltje.' : 'Write a fun and original bedtime story in English.';

  return `
${langIntro}
Publiek: ${audience}
${charDescriptions}

Synopsis: ${synopsis}
Elementen die erin moeten: ${elements}
Boodschap: ${moral}
Stijl: ${sliders}
In de stijl van: ${authorStyle || '(geen voorkeur)'}
`;
}
