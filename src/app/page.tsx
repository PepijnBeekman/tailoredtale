'use client';

import React, { useState } from 'react';

interface Character {
  name: string;
  age: string;
  gender: string;
  description: string;
  quirks: string;
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
  const [characters, setCharacters] = useState<Character[]>([{ name: '', age: '', gender: '', description: '', quirks: '' }]);
  const [audience, setAudience] = useState('');
  const [elements, setElements] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [moral, setMoral] = useState('');
  const [style, setStyle] = useState<StyleSettings>({
    spannend: 3,
    grappig: 3,
    absurd: 3,
    leerzaam: 3,
    avontuurlijk: 3,
    inspirerend: 3,
  });
  const [authorStyle, setAuthorStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const labels = {
    nl: {
      title: 'Bedtijdverhaaltjes',
      intro: 'Deze verhaaltjes zijn helemaal naar wens aan te passen. Laat alles leeg voor een verrassend willekeurig verhaaltje, of pas aan wat jij belangrijk vindt.',
      addCharacter: 'Voeg personage toe',
      name: 'Naam',
      age: 'Leeftijd',
      gender: 'Geslacht',
      description: 'Omschrijving',
      quirks: 'Opmerkelijkheden',
      audience: 'Voor wie is dit verhaaltje bedoeld?',
      elements: 'Dit moet er in voorkomen:',
      synopsis: 'Hier moet het over gaan:',
      moral: 'De boodschap moet zijn dat:',
      style: 'Stijl',
      inStyleOf: 'In de stijl van:',
      generate: 'Genereer verhaaltje',
      loading: 'Even geduld... het verhaaltje wordt geschreven...',
      error: 'Er ging iets mis. Probeer het opnieuw.',
    },
    en: {
      title: 'Bedtime Stories',
      intro: 'These stories are fully customizable. Leave everything blank for a surprising random story, or tweak the parts that matter to you.',
      addCharacter: 'Add character',
      name: 'Name',
      age: 'Age',
      gender: 'Gender',
      description: 'Description',
      quirks: 'Quirks',
      audience: 'Who is this story intended for?',
      elements: 'These elements must be included:',
      synopsis: 'The story should be about:',
      moral: 'The message should be:',
      style: 'Style',
      inStyleOf: 'In the style of:',
      generate: 'Generate story',
      loading: 'Please wait... your story is being written...',
      error: 'Something went wrong. Please try again.',
    },
  };

  const l = labels[language];

  const handleAddCharacter = () => {
    setCharacters([...characters, { name: '', age: '', gender: '', description: '', quirks: '' }]);
  };

  const handleCharacterChange = (index: number, field: keyof Character, value: string) => {
    const updated = [...characters];
    updated[index][field] = value;
    setCharacters(updated);
  };

  const handleSliderChange = (field: keyof StyleSettings, value: number) => {
    setStyle({ ...style, [field]: value });
  };

  const generateLabel = () => {
    const mainCharacter = characters.find((c) => c.name)?.name;
    if (mainCharacter) return `${l.generate} over ${mainCharacter}`;
    if (audience) return `${l.generate} voor ${audience}`;
    if (synopsis) return `${l.generate} over ${synopsis}`;
    return `${l.generate} (willekeurig)`;
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
          characters,
          audience,
          elements,
          synopsis,
          moral,
          style,
          authorStyle,
        }),
      });

      const data = await response.json();
      if (data.story) {
        setStory(data.story);
      } else {
        setError(l.error);
      }
    } catch (err) {
      console.error(err);
      setError(l.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-2">{l.title}</h1>
        <p className="mb-6 italic">{l.intro}</p>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setLanguage('nl')} className="px-4 py-1 bg-white text-black rounded">
            Nederlands
          </button>
          <button onClick={() => setLanguage('en')} className="px-4 py-1 bg-white text-black rounded">
            English
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-green-600 rounded text-xl font-bold disabled:opacity-50 mb-6"
          disabled={loading}
        >
          {generateLabel()}
        </button>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{l.addCharacter}</summary>
          {characters.map((char, idx) => (
            <div key={idx} className="mb-4 border-b border-gray-600 pb-2 mt-2">
              <h2 className="font-semibold mb-2">{l.addCharacter} {idx + 1}</h2>
              {(['name', 'age', 'gender', 'description', 'quirks'] as (keyof Character)[]).map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={l[field]}
                  value={char[field]}
                  onChange={(e) => handleCharacterChange(idx, field, e.target.value)}
                  className="block w-full mb-2 p-2 rounded text-black"
                />
              ))}
            </div>
          ))}
          <button onClick={handleAddCharacter} className="px-4 py-2 bg-blue-600 rounded">
            + {l.addCharacter}
          </button>
        </details>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{l.audience}</summary>
          <textarea
            placeholder={l.audience}
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="block w-full mt-2 p-2 rounded text-black"
          />
        </details>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{l.synopsis}</summary>
          <textarea
            placeholder={l.synopsis}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="block w-full mt-2 p-2 rounded text-black"
          />
        </details>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{l.elements}</summary>
          <textarea
            placeholder={l.elements}
            value={elements}
            onChange={(e) => setElements(e.target.value)}
            className="block w-full mt-2 p-2 rounded text-black"
          />
        </details>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{l.moral}</summary>
          <textarea
            placeholder={l.moral}
            value={moral}
            onChange={(e) => setMoral(e.target.value)}
            className="block w-full mt-2 p-2 rounded text-black"
          />
        </details>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{l.style}</summary>
          <div className="mt-2">
            {Object.entries(style).map(([key, value]) => (
              <div key={key} className="mb-2">
                <label className="block capitalize">{key}</label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={value}
                  onChange={(e) => handleSliderChange(key as keyof StyleSettings, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
            <input
              type="text"
              placeholder={l.inStyleOf}
              value={authorStyle}
              onChange={(e) => setAuthorStyle(e.target.value)}
              className="block w-full mt-4 p-2 rounded text-black"
            />
          </div>
        </details>

        {loading && <p className="mt-4 italic">{l.loading}</p>}
        {error && <p className="mt-4 text-red-300">{error}</p>}
        {story && (
          <div className="mt-6 p-4 bg-white text-black rounded shadow max-h-[500px] overflow-auto whitespace-pre-wrap">
            {story}
          </div>
        )}
      </div>
    </main>
  );
}
