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

const placeholderConfig = {
  nl: {
    audience: {
      label: 'Voor wie is dit verhaaltje bedoeld?',
      helper: 'Vertel hier iets over degene voor wie het verhaaltje bedoeld is.',
      placeholder: 'Bijv: een jongen van 7 die van draken houdt',
    },
    synopsis: {
      label: 'Hier moet het over gaan:',
      helper: 'Geef in 1-2 zinnen aan wat er in grote lijnen moet gebeuren.',
      placeholder: 'Bijv: een prinses die leert om zelf haar problemen op te lossen',
    },
    moral: {
      label: 'De boodschap moet zijn dat:',
      helper: 'Welke les of inzicht moet de lezer meekrijgen?',
      placeholder: 'Bijv: samenwerken loont altijd',
    },
    elements: {
      label: 'Dit moet in verhaaltje voorkomen:',
      helper: 'Noem losse elementen, dingen, wezens of gebeurtenissen.',
      placeholder: 'Bijv: een eenhoorn, een regenboog, oma was jarig die dag',
    },
    character: {
      label: 'Personage',
      helper: 'Beschrijf een personage in het verhaal',
      name: 'Naam (bijv: Hugo)',
      age: 'Leeftijd (bijv: 5)',
      gender: 'Geslacht (bijv: jongen)',
      description: 'Korte beschrijving (bijv: nieuwsgierig en slim)',
      quirks: 'Opmerkelijkheden (bijv: wiebelt met z’n tenen als hij nadenkt)',
    },
  },
  en: {
    audience: {
      label: 'Who is this story intended for?',
      helper: 'Tell us something about the listener or reader of this tale.',
      placeholder: 'E.g.: a 7-year-old boy who loves dragons',
    },
    synopsis: {
      label: 'The story should be about:',
      helper: 'Describe in 1–2 sentences what should broadly happen.',
      placeholder: 'E.g.: a princess who learns to solve problems herself',
    },
    moral: {
      label: 'The message should be:',
      helper: 'What lesson or insight should the listener take away?',
      placeholder: 'E.g.: teamwork always pays off',
    },
    elements: {
      label: 'These elements must be included in the tale:',
      helper: 'List things, creatures, or events to include.',
      placeholder: 'E.g.: a unicorn, a rainbow, and a cookie storm',
    },
    character: {
      label: 'Character',
      helper: 'Describe a character in the tale',
      name: 'Name (e.g.: Hugo)',
      age: 'Age (e.g.: 5)',
      gender: 'Gender (e.g.: boy)',
      description: 'Short description (e.g.: curious and clever)',
      quirks: 'Quirks (e.g.: wiggles his toes when thinking)',
    },
  },
};

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

  const t = placeholderConfig[language];

  const generateLabel = () => {
    const mainCharacter = characters.find((c) => c.name)?.name;
    if (mainCharacter) return `Genereer verhaaltje over ${mainCharacter}`;
    if (audience) return `Genereer verhaaltje voor ${audience}`;
    if (synopsis) return `Genereer verhaaltje over ${synopsis}`;
    return 'Genereer willekeurig verhaaltje';
  };

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
      <div className="relative max-w-3xl mx-auto px-6 pt-8 pb-24 backdrop-blur-sm bg-white/50 rounded-xl mt-8 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <img src="/logo.png" alt="Logo" className="h-32 w-32 object-contain" />
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'nl'
                ? 'Genereer je eigen op maat gemaakte verhaaltjes met AI'
                : 'Generate your tailormade tales with AI'}
            </h1>

            <p className="text-sm italic text-gray-700">
              Deze verhaaltjes zijn helemaal naar wens aan te passen. Laat alles leeg voor een verrassend willekeurig verhaaltje, of pas aan wat jij belangrijk vindt.
            </p>
          </div>
        </div>
      
      <div className="flex gap-2 mb-6">
        <button onClick={() => setLanguage('nl')} className="px-4 py-1 bg-white text-black rounded">Nederlands</button>
        <button onClick={() => setLanguage('en')} className="px-4 py-1 bg-white text-black rounded">English</button>
      </div>


        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-green-600 rounded text-xl font-bold disabled:opacity-50 mb-6"
          disabled={loading}
        >
          {generateLabel()}
        </button>

        {/* Characters */}
        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{t.character.label}</summary>
          <p className="mt-2 text-sm text-gray-300">{t.character.helper}</p>
          {characters.map((char, idx) => (
            <div key={idx} className="mb-4 border-b border-gray-600 pb-2 mt-2">
              {(['name', 'age', 'gender', 'description', 'quirks'] as (keyof Character)[]).map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={t.character[field]}
                  value={char[field]}
                  onChange={(e) => handleCharacterChange(idx, field, e.target.value)}
                  className="block w-full mb-2 p-2 rounded text-black"
                />
              ))}
            </div>
          ))}
          <button onClick={handleAddCharacter} className="px-4 py-2 bg-blue-600 rounded">
            + {t.character.label}
          </button>
        </details>

        {/* Audience */}
        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{t.audience.label}</summary>
          <p className="mt-2 text-sm text-gray-300">{t.audience.helper}</p>
          <textarea
            placeholder={t.audience.placeholder}
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="block w-full mt-2 p-2 rounded text-black"
          />
        </details>

        {/* Synopsis */}
        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{t.synopsis.label}</summary>
          <p className="mt-2 text-sm text-gray-300">{t.synopsis.helper}</p>
          <textarea
            placeholder={t.synopsis.placeholder}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="block w-full mt-2 p-2 rounded text-black"
          />
        </details>

        {/* Elements */}
        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{t.elements.label}</summary>
          <p className="mt-2 text-sm text-gray-300">{t.elements.helper}</p>
          <textarea
            placeholder={t.elements.placeholder}
            value={elements}
            onChange={(e) => setElements(e.target.value)}
            className="block w-full mt-2 p-2 rounded text-black"
          />
        </details>

        {/* Moral */}
        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">{t.moral.label}</summary>
          <p className="mt-2 text-sm text-gray-300">{t.moral.helper}</p>
          <textarea
            placeholder={t.moral.placeholder}
            value={moral}
            onChange={(e) => setMoral(e.target.value)}
            className="block w-full mt-2 p-2 rounded text-black"
          />
        </details>

        {/* Style */}
        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">Stijl</summary>
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
              placeholder="In de stijl van (bijv: Annie M.G. Schmidt)"
              value={authorStyle}
              onChange={(e) => setAuthorStyle(e.target.value)}
              className="block w-full mt-4 p-2 rounded text-black"
            />
          </div>
        </details>

        {loading && <p className="mt-4 italic">Even geduld... het verhaaltje wordt geschreven...</p>}
        {error && <p className="mt-4 text-red-300">{error}</p>}
        {story && (
          <div className="mt-6 relative w-full max-w-4xl mx-auto">
            <img src="/book.png" alt="Boek" className="w-full h-auto" />
            <div
              className="absolute top-[13%] left-[10%] w-[40%] h-[74%] overflow-y-auto p-4 text-black whitespace-pre-wrap text-lg story-font"
              style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '0.5rem' }}
            >
              {story}
            </div>
          </div>
        )}
      </div> {/* sluit het interfaceblok af */}
    </main>
  );
}

