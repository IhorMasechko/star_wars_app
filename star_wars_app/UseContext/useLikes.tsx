// LikesProvider.tsx
import React, {createContext, useState, ReactNode, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SWAPICharacter} from '../services/services';

type LikesProviderProps = {
  children: ReactNode;
};

export const LikesContext = createContext<LikesContextType | undefined>(
  undefined,
);

export type LikesContextType = {
  globalLikes: {male: number; female: number; other: number};
  characters: SWAPICharacter[];
  updateLikes: (character: SWAPICharacter) => void;
  resetStatistics: () => void;
  resetCountLikes: () => void;
  setCharacters: (characters: SWAPICharacter[]) => void; // Add this function
};

export const LikesProvider: React.FC<LikesProviderProps> = ({children}) => {
  const [globalLikes, setGlobalLikes] = useState({
    male: 0,
    female: 0,
    other: 0,
  });

  const [characters, setCharacters] = useState<SWAPICharacter[]>([]); // Initialize characters

  // Load characters from storage when the provider is created
  useEffect(() => {
    async function loadCharactersFromStorage() {
      try {
        const savedCharacters = await AsyncStorage.getItem('characters');
        if (savedCharacters) {
          const parsedCharacters = JSON.parse(savedCharacters);
          setCharacters(parsedCharacters);
        }
      } catch (error) {
        console.error('Error retrieving characters from storage:', error);
      }
    }

    loadCharactersFromStorage();
  }, []); // Empty dependency array to load characters once

  const updateLikes = (character: SWAPICharacter) => {
    if (character && character.gender) {
      setGlobalLikes(prevLikes => {
        const updatedLikes = {...prevLikes};
        const gender = character.gender.toLowerCase();
        const isLiked = character.liked;

        if (gender === 'male') {
          updatedLikes.male += isLiked ? 1 : -1;
        } else if (gender === 'female') {
          updatedLikes.female += isLiked ? 1 : -1;
        } else {
          updatedLikes.other += isLiked ? 1 : -1;
        }

        AsyncStorage.setItem('globalLikes', JSON.stringify(updatedLikes));

        return updatedLikes;
      });
    }
  };

  const resetStatistics = () => {
    setGlobalLikes({male: 0, female: 0, other: 0});
    AsyncStorage.setItem(
      'globalLikes',
      JSON.stringify({male: 0, female: 0, other: 0}),
    );
  };

  const resetCountLikes = async () => {
    const updatedCharacters = characters.map(character => ({
      ...character,
      liked: true,
    }));

    setCharacters(updatedCharacters);
    resetStatistics();

    await AsyncStorage.setItem('characters', JSON.stringify(updatedCharacters));
  };

  const contextValue: LikesContextType = {
    globalLikes,
    characters,
    updateLikes,
    resetStatistics,
    resetCountLikes,
    setCharacters,
  };

  return (
    <LikesContext.Provider value={contextValue}>
      {children}
    </LikesContext.Provider>
  );
};
