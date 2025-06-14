// dit is de volledige page.tsx met de vernieuwde layout (vier blokken, responsive, verbeterde structuur, scroll overlay)

'use client';

import React, { useState } from 'react';

interface Listener {
  name: string;
  description: string;
}

interface Character {
  name: string;
  description: string;
}

interface StyleSettings {
  spannend: number;
  grappig: number;
  absurd: number;
  leerzaam: number;
  avontuurlijk: number;
  inspirerend: number;
}

export default function Home() {
  const [language, setLanguage] = useState<'nl' | 'en'>('nl');
  const [listeners, setListeners] = useState<Listener[]>([{ name: '', description: '' }]);
  const [characters, setCharacters] = useState<Character[]>([{ name: '', description: '' }]);
  const [synopsis, setSynopsis] = useState('');
  const [elements, setElements] = useState('');
  const [moral, setMoral] = useState('');
  const [authorStyle, setAuthorStyle] = useState('');
  const [style, setStyle] = useState<StyleSettings>({
    spannend: 3,
    grappig: 3,
    absurd: 3,
    leerzaam: 3,
    avontuurlijk: 3,
    inspirerend: 3,
  });
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setStory(null);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        listeners,
        characters,
        synopsis,
        elements,
        moral,
        authorStyle,
        style,
      }),
    });
    const data = await response.json();
    setStory(data.story || null);
    setLoading(false);
  };

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-top text-black"
      style={{ backgroundImage: `url(${typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? '/backgroundls.png' : '/background.png'})` }}
    >
      <div className="max-w-screen-xl mx-auto p-6">
        {/* Blok 0 */}
        <div className="flex items-center gap-4 mb-6">
          <img src="/logo.png" alt="Logo" className="h-32 w-32 object-contain" />
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'nl' ? 'Genereer je eigen op maat gemaakte verhaaltjes met AI' : 'Generate your tailormade tales with AI'}
            </h1>
            <p className="text-sm italic text-gray-700">
              Laat alles leeg voor een verrassend willekeurig verhaaltje, of pas aan wat jij belangrijk vindt.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setLanguage('nl')} className="px-4 py-1 bg-white text-black rounded">Nederlands</button>
          <button onClick={() => setLanguage('en')} className="px-4 py-1 bg-white text-black rounded">English</button>
        </div>

        {/* Vier blokken */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Blok 1: Luisteraars */}
          <div className="md:w-1/4 p-4 bg-white/80 rounded shadow">
            <h2 className="font-bold mb-2">Voor wie is het verhaaltje bedoeld?</h2>
            {listeners.map((l, i) => (
              <div key={i} className="mb-4">
                <input
                  type="text"
                  value={l.name}
                  onChange={(e) => {
                    const list = [...listeners];
                    list[i].name = e.target.value;
                    setListeners(list);
                  }}
                  placeholder="Naam (bijv. James)"
                  className="w-full mb-2 p-2 rounded border text-black"
                />
                <textarea
                  value={l.description}
                  onChange={(e) => {
                    const list = [...listeners];
                    list[i].description = e.target.value;
                    setListeners(list);
                  }}
                  placeholder="Beschrijving (bijv: jongen van 7...)
"
                  className="w-full p-2 rounded border text-black"
                />
              </div>
            ))}
            <button onClick={() => setListeners([...listeners, { name: '', description: '' }])} className="text-sm underline">+ Voeg nog een luisteraar toe...</button>
          </div>

          {/* Blok 2: Personages */}
          <div className="md:w-1/4 p-4 bg-white/80 rounded shadow">
            <h2 className="font-bold mb-2">Over wie moet het verhaaltje gaan?</h2>
            {characters.map((c, i) => (
              <div key={i} className="mb-4">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => {
                    const list = [...characters];
                    list[i].name = e.target.value;
                    setCharacters(list);
                  }}
                  placeholder="Naam (bijv. Jax)"
                  className="w-full mb-2 p-2 rounded border text-black"
                />
                <textarea
                  value={c.description}
                  onChange={(e) => {
                    const list = [...characters];
                    list[i].description = e.target.value;
                    setCharacters(list);
                  }}
                  placeholder="Beschrijving (bijv. kampioen schaakboksen...)"
                  className="w-full p-2 rounded border text-black"
                />
              </div>
            ))}
            <button onClick={() => setCharacters([...characters, { name: '', description: '' }])} className="text-sm underline">+ Voeg nog een personage toe...</button>
          </div>

          {/* Blok 3: Inhoud */}
          <div className="md:w-1/2 p-4 bg-white/80 rounded shadow flex flex-col gap-2">
            <h2 className="font-bold">Waar moet het verhaaltje over gaan?</h2>
            <textarea placeholder="Verhaallijn..." value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className="w-full p-2 rounded border text-black" />
            <textarea placeholder="Details..." value={elements} onChange={(e) => setElements(e.target.value)} className="w-full p-2 rounded border text-black" />
            <textarea placeholder="Boodschap..." value={moral} onChange={(e) => setMoral(e.target.value)} className="w-full p-2 rounded border text-black" />
            <input placeholder="Stijl (bijv. grappig, absurd...)" value={authorStyle} onChange={(e) => setAuthorStyle(e.target.value)} className="w-full p-2 rounded border text-black" />
          </div>
        </div>

        <div className="w-full mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded shadow"
          >
            {loading ? 'Even geduld...' : 'Genereer verhaaltje'}
          </button>
        </div>

        {/* Scrollverhaal */}
        {story && (
          <div className="mt-8 relative w-full max-w-md md:max-w-2xl mx-auto aspect-[420/1024]">
            <img src="/scroll.png" alt="Scroll" className="w-full h-full object-contain" />
            <div
              className="absolute top-[7.8%] left-[6.9%] w-[86.2%] h-[84.4%] overflow-y-auto p-4 text-black whitespace-pre-wrap text-lg font-[var(--font-story)] story-font"
              style={{ background: 'transparent' }}
            >
              {story}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
