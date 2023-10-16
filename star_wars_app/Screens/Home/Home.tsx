import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {queryNames, SWAPICharacter} from '../../services/services';
import {LikesContext} from '../../UseContext/useLikes';
import Icon from 'react-native-vector-icons/AntDesign';

export interface ComponentProps {
  route: any;
  navigation: any;
}

const Home: React.FC<ComponentProps> = ({navigation}) => {
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const likesContext = useContext(LikesContext)!;
  const characters = likesContext.characters;
  const cache = likesContext.cache;
  const setCache = likesContext.setCache;
  const cacheLikes = likesContext.cacheLikes;
  const setCacheLikes = likesContext.setCacheLikes;

  const itemsPerPage = 10;
  const totalItems = 82;

  const calculateRange = () => {
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, totalItems);
    return `${start}–${end} of ${totalItems}`;
  };

  const fetchData = useCallback(
    async (pageNumber: number) => {
      setIsLoading(true);
      const totalNumberOfPages = 9;
      try {
        if (cache[pageNumber] && cacheLikes[pageNumber]) {
          likesContext.setCharacters(cacheLikes[pageNumber]);
        } else {
          const savedLikes = await AsyncStorage.getItem('likes');
          const prevLikes = savedLikes ? JSON.parse(savedLikes) : {};
          const allCharactersWithLiked: SWAPICharacter[] = [];
          const fetchPage = async (pageToFetch: number) => {
            if (pageToFetch > totalNumberOfPages) {
              likesContext.setCharacters(allCharactersWithLiked);
              return;
            }
            const results = await queryNames(pageToFetch);
            const charactersWithLiked = results.map(character => ({
              ...character,
              liked: character.url in prevLikes,
            }));
            allCharactersWithLiked.push(...charactersWithLiked);
            setCache(prevCache => ({...prevCache, [pageToFetch]: results}));
            setCacheLikes(prevCacheLikes => ({
              ...prevCacheLikes,
              [pageToFetch]: charactersWithLiked,
            }));
            await fetchPage(pageToFetch + 1);
          };
          await fetchPage(1);
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorState(error.message);
        } else {
          setErrorState('An error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cache, cacheLikes, likesContext, setCache, setCacheLikes],
  );

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  const countLikes = async (character: SWAPICharacter) => {
    try {
      character.liked = !character.liked;
      const savedLikes = await AsyncStorage.getItem('likes');
      const prevLikes = savedLikes ? JSON.parse(savedLikes) : {};
      if (character.liked) {
        prevLikes[character.url] = true;
      } else {
        delete prevLikes[character.url];
      }
      await AsyncStorage.setItem('likes', JSON.stringify(prevLikes));
      likesContext.updateLikes(character);
      const updatedCharacters = characters.map(char =>
        char.url === character.url ? character : char,
      );
      likesContext.setCharacters(updatedCharacters);
    } catch (error) {
      console.error('Error handling likes:', error);
    }
  };

  useEffect(() => {
    const getLikesFromStorage = async () => {
      try {
        const savedLikes = await AsyncStorage.getItem('likes');
        const parsedLikes = savedLikes ? JSON.parse(savedLikes) : {};
        likesContext.updateLikes(parsedLikes);
      } catch (error) {
        console.error('Error retrieving likes from storage:', error);
      }
    };
    getLikesFromStorage();
  }, [likesContext]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/StarWars.png')}
        style={styles.backgroundImage}>
        {errorState && null}
        {isLoading && <Text style={styles.infoText}>Loading...</Text>}
        {!isLoading && (
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Statistics', {characters})}>
              <Text style={styles.infoText}>Statistics</Text>
            </TouchableOpacity>
            <FlatList
              data={characters}
              keyExtractor={item => item.url}
              renderItem={({item}) => {
                const isLiked = item.liked;
                return (
                  <View style={styles.characters}>
                    <TouchableOpacity onPress={() => countLikes(item)}>
                      <View style={styles.likes}>
                        <Text style={styles.infoText}>Like</Text>
                        {isLiked ? (
                          <Icon name="like2" size={30} color="tomato" />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.text}>{item.name}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('CharacterDetails', {
                          character: item,
                        })
                      }>
                      <Text style={styles.infoText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
            <View style={styles.pagination}>
              {!isLoading && page > 1 && (
                <TouchableOpacity onPress={() => setPage(page - 1)}>
                  <Text style={styles.infoText}>Prev</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.infoText}>{calculateRange()}</Text>
              {!isLoading && page * 10 < 82 && (
                <TouchableOpacity onPress={() => setPage(page + 1)}>
                  <Text style={styles.infoText}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  text: {
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 35,
    letterSpacing: 0.16,
    color: '#FFC107',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pagination: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: 'black',
  },
  infoText: {
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 35,
    letterSpacing: 0.16,
    color: '#F44336',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  characters: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  likes: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default Home;
