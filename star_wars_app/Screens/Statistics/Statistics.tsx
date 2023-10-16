import React, {useCallback, useContext} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {LikesContext} from '../../UseContext/useLikes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Statistics: React.FC = () => {
  const likesContext = useContext(LikesContext)!;
  const globalLikes = likesContext.globalLikes;
  const characters = likesContext.characters;
  const resetStatistics = likesContext.resetStatistics;

  const handleResetLikes = useCallback(() => {
    const updatedCharacters = characters.map(character => ({
      ...character,
      liked: false,
    }));

    AsyncStorage.removeItem('likes');
    AsyncStorage.setItem('characters', JSON.stringify(updatedCharacters));
    likesContext.setCharacters(updatedCharacters);
    if (resetStatistics) {
      resetStatistics();
    }
    likesContext.clearLikes();
  }, [characters, resetStatistics, likesContext]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/StarWars.png')}
        style={styles.backgroundImage}>
        <View style={styles.containerText}>
          <Text style={styles.text}>Male: {globalLikes.male} </Text>
          <Text style={styles.text}>Female: {globalLikes.female} </Text>
          <Text style={styles.text}>Other: {globalLikes.other}</Text>
        </View>
        <TouchableOpacity onPress={handleResetLikes}>
          <Text style={styles.infoText}>Reset likes</Text>
        </TouchableOpacity>
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
    paddingTop: 30,
  },
  containerText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 30,
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
  infoText: {
    fontStyle: 'normal',
    fontSize: 20,
    lineHeight: 35,
    letterSpacing: 0.16,
    color: '#F44336',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Statistics;
