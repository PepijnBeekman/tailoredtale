'use client';

import React, { useState } from 'react';

interface Listener {
  name: string;
  description: string;
}

interface SimpleCharacter {
  name: string;
  description: string;
}

export default function Home() {
  const [language, setLanguage] = useState<'nl' | 'en'>('nl');
  const [listeners, setListeners] = useState<Listener[]>([{ name: '', description: '' }]);
  const [simpleCharacters, setSimpleCharacters] = useState<SimpleCharacter[]>([{ name: '', description: '' },]);
  const [storyLanguage, setStoryLanguage] = useState('');
  const [elements, setElements] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [moral, setMoral] = useState('');
  const [authorStyle, setAuthorStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const handleAddSimpleCharacter = () => {
    setSimpleCharacters([...simpleCharacters, { name: '', description: '' }]);
  };

  const handleSimpleCharacterChange = (
    index: number,
    field: keyof SimpleCharacter,
    value: string
  ) => {
    const updated = [...simpleCharacters];
    updated[index][field] = value;
    setSimpleCharacters(updated);
  };

  const handleAddListener = () => {
  setListeners([...listeners, { name: '', description: '' }]);
  };

  const handleListenerChange = (index: number, field: keyof Listener, value: string) => {
  const updated = [...listeners];
  updated[index][field] = value;
  setListeners(updated);
  };

  const handleSubmit = async () => {
  setLoading(true);
  setStory(null);
  setError(null);
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        listeners,
        simpleCharacters,
        storyLanguage,
        elements,
        synopsis,
        moral,
        authorStyle,
      }),
    });

    const data = await response.json();
    if (data.story) {
      setStory(data.story);
    } else {
      setError('Er ging iets mis. Probeer het opnieuw.');
    }
  } catch (err) {
    console.error(err);
    setError('Er ging iets mis. Probeer het opnieuw.');
  } finally {
    setLoading(false);
  }
};


  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-top text-black"
      style={{ backgroundImage: `url(${typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? '/backgroundls.png' : '/background.png'})` }}
    >
      <div className="flex flex-col lg:flex-row gap-6 px-4 pt-8 pb-24 w-full max-w-none backdrop-blur-sm bg-white/50 rounded-xl mt-8 shadow-xl">
        <section className="w-full lg:w-1/4 flex flex-col items-center text-center">
        <img src="/logo.png" alt="Logo" className="h-32 w-32 object-contain mb-4" />
        <h1 className="text-xl font-bold">
          {language === 'nl'
            ? 'Maak een verhaaltje op maat'
            : 'Generate a custom tale'}
        </h1>
        <p className="text-sm italic text-gray-700 mt-2">
          Laat alles leeg voor een verrassend verhaaltje of vul in wat jij belangrijk vindt.
        </p>

        <div className="flex gap-2 mt-4">
          <button onClick={() => setLanguage('nl')} className="px-4 py-1 bg-white text-black rounded border">NL</button>
          <button onClick={() => setLanguage('en')} className="px-4 py-1 bg-white text-black rounded border">EN</button>
        </div>
      </section>

      <section className="w-full lg:w-1/4 bg-white/30 rounded p-4">
        <h2 className="font-semibold text-lg mb-2">Luisteraar(s)</h2>
        {listeners.map((listener, idx) => (
          <div key={idx} className="mb-4 border-b border-gray-300 pb-2">
            <input
              type="text"
              placeholder="Naam (bijv. James)"
              value={listener.name}
              onChange={(e) => handleListenerChange(idx, 'name', e.target.value)}
              className="block w-full mb-2 p-2 rounded text-black"
            />
            <textarea
              placeholder="Bijv. een jongen van 7 die van Dragon Ball Z en voetbal houdt"
              value={listener.description}
              onChange={(e) => handleListenerChange(idx, 'description', e.target.value)}
              className="block w-full p-2 rounded text-black placeholder:text-sm placeholder:italic"
            />
          </div>
        ))}
        <button onClick={handleAddListener} className="w-full py-2 mt-2 bg-blue-600 text-white rounded">
          + Voeg luisteraar toe...
        </button>
      </section>

      <section className="w-full lg:w-1/4 bg-white/30 rounded p-4">
        <h2 className="font-semibold text-lg mb-2">Personage(s)</h2>
        {simpleCharacters.map((character, idx) => (
          <div key={idx} className="mb-4 border-b border-gray-300 pb-2">
            <input
              type="text"
              placeholder="Naam (bijv. Jax)"
              value={character.name}
              onChange={(e) => handleSimpleCharacterChange(idx, 'name', e.target.value)}
              className="block w-full mb-2 p-2 rounded text-black"
            />
            <textarea
              placeholder="Bijv. wereldkampioen schaakboksen met een litteken op zijn voorhoofd"
              value={character.description}
              onChange={(e) => handleSimpleCharacterChange(idx, 'description', e.target.value)}
              className="block w-full p-2 rounded text-black placeholder:text-sm placeholder:italic"
            />
          </div>
        ))}
        <button
          onClick={handleAddSimpleCharacter}
          className="w-full py-2 mt-2 bg-blue-600 text-white rounded"
        >
          + Voeg personage toe...
        </button>
      </section>

      <section className="w-full lg:w-1/4 bg-white/30 rounded p-4">
        <h2 className="font-semibold text-lg mb-2">Verhaalstructuur</h2>

        <label className="block font-medium mt-2 mb-1">Verhaallijn</label>
        <textarea
          placeholder="Bijv. Jax gaat voor het eerst naar school en ontdekt een tijdmachine..."
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          className="block w-full p-2 rounded text-black placeholder:text-sm placeholder:italic"
        />

        <label className="block font-medium mb-1">Details</label>
        <textarea
          placeholder="Bijv. het was een tropisch warme dag, oma was jarig, papa had net een nieuwe auto gekocht"
          value={elements}
          onChange={(e) => setElements(e.target.value)}
          className="block w-full p-2 rounded text-black placeholder:text-sm placeholder:italic"
        />

        <label className="block font-medium mb-1">Boodschap</label>
        <textarea
          placeholder="Bijv. het leven kan magisch zijn als je de moed hebt om mensen in je hart toe te laten"
          value={moral}
          onChange={(e) => setMoral(e.target.value)}
          className="block w-full p-2 rounded text-black placeholder:text-sm placeholder:italic"
        />

        <input
          type="text"
          placeholder="Stijlreferentie (bijv. Annie M.G. Schmidt)"
          value={authorStyle}
          onChange={(e) => setAuthorStyle(e.target.value)}
          className="block w-full p-2 rounded text-black mb-3"
        />

        <input
          type="text"
          placeholder="Verhaaltje in deze taal (bijv. Twents, Klingon...)"
          value={storyLanguage}
          onChange={(e) => setStoryLanguage(e.target.value)}
          className="block w-full p-2 rounded text-black"
        />
      </section>


        


        {loading && <p className="mt-4 italic">Even geduld... het verhaaltje wordt geschreven...</p>}
        {error && <p className="mt-4 text-red-300">{error}</p>}
        
        
      </div> {/* sluit het interfaceblok af */}
      
      <button
          onClick={handleSubmit}
          className="mx-auto mt-8 px-6 py-2 bg-green-600 rounded text-lg font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Even geduld...' : 'Genereer verhaaltje'}
        </button>

      {story && (
          <div className="relative w-full max-w-md md:max-w-2xl mx-auto aspect-[420/1024]">
            <img src="/scroll.png" alt="Scroll" className="w-full h-full object-contain" />
            <div
              className="absolute top-[7.8%] left-[6.9%] w-[86.2%] h-[84.4%] overflow-y-auto p-4 text-black whitespace-pre-wrap text-lg font-[var(--font-story)] story-font"
              style={{ background: 'transparent' }}
            >
              {story}
            </div>
          </div>
        )}
    </main>
  );
}

