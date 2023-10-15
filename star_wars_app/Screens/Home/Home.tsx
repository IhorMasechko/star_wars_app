import React, {useEffect, useState, useContext} from 'react';
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
  const [cache, setCache] = useState<{[key: number]: SWAPICharacter[]}>({});
  const [page, setPage] = useState(1);

  const likesContext = useContext(LikesContext)!;
  const characters = likesContext.characters;

  const itemsPerPage = 10;
  const totalItems = 82;

  const calculateRange = () => {
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, totalItems);
    return `${start}–${end} of ${totalItems}`;
  };

  useEffect(() => {
    const getNames = async (pageNumber: number) => {
      setIsLoading(true);
      try {
        if (cache[pageNumber]) {
          likesContext.setCharacters(cache[pageNumber]);
        } else {
          const results = await queryNames(pageNumber);
          const savedLikes = await AsyncStorage.getItem('likes');
          const prevLikes = savedLikes ? JSON.parse(savedLikes) : {};
          const charactersWithLiked = results.map(character => ({
            ...character,
            liked: character.url in prevLikes,
          }));
          setCache({...cache, [pageNumber]: charactersWithLiked});
          likesContext.setCharacters(charactersWithLiked);
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
    };
    getNames(page);
  }, [cache, page, likesContext]);

  const countLikes = async (character: SWAPICharacter) => {
    try {
      // Toggle the liked status
      character.liked = !character.liked;

      // Get the previously saved likes from AsyncStorage
      const savedLikes = await AsyncStorage.getItem('likes');
      const prevLikes = savedLikes ? JSON.parse(savedLikes) : {};

      // Update the likes based on the character's URL
      if (character.liked) {
        prevLikes[character.url] = true;
      } else {
        delete prevLikes[character.url];
      }

      // Save the updated likes back to AsyncStorage
      await AsyncStorage.setItem('likes', JSON.stringify(prevLikes));

      // Update the context
      likesContext.updateLikes(character);

      // Update the characters state
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
        const parsedLikes = savedLikes ? JSON.parse(savedLikes) : {}; // Initialize with an empty object if data is not found

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
        {errorState && (
          <Text style={styles.infoText}>Something went wrong</Text>
        )}
        {isLoading && <Text style={styles.infoText}>Loading...</Text>}
        <FlatList
          data={characters}
          keyExtractor={item => item.url}
          renderItem={({item}) => {
            return (
              <View style={styles.characters}>
                <TouchableOpacity onPress={() => countLikes(item)}>
                  <View style={styles.likes}>
                    <Text style={styles.text}>Like</Text>
                    {item.liked ? (
                      <Icon name="like2" size={30} color="tomato" />
                    ) : null}
                  </View>
                </TouchableOpacity>
                <Text style={styles.text}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CharacterDetails', {character: item})
                  }>
                  <Text style={styles.text}>Details</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Statistics', {characters})}>
          <Text style={styles.infoText}>Statistics</Text>
        </TouchableOpacity>
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
    color: '#FFFFFF',
    textAlign: 'center',
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
    color: 'tomato',
    textAlign: 'center',
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
