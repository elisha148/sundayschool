import { BibleVerse } from '../types';
import { generateId, getToday } from '../utils/helpers';

// Sample verses - can be expanded or fetched from API later
const SAMPLE_VERSES: Omit<BibleVerse, 'id' | 'date'>[] = [
  { reference: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
  { reference: 'Psalm 23:1', text: 'The Lord is my shepherd, I lack nothing.' },
  { reference: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' },
  { reference: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.' },
  { reference: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
  { reference: 'Isaiah 41:10', text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.' },
  { reference: 'Matthew 28:19-20', text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.' },
];

export const BibleVerseService = {
  getVerseOfTheDay(): BibleVerse {
    const today = getToday();
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const verseIndex = dayOfYear % SAMPLE_VERSES.length;
    const verse = SAMPLE_VERSES[verseIndex];
    
    return {
      id: generateId(),
      ...verse,
      date: today,
    };
  },

  getAllVerses(): Omit<BibleVerse, 'id' | 'date'>[] {
    return SAMPLE_VERSES;
  },
};
