import React, {useState, useEffect} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';

interface ComponentProps {
  route: any;
}

const CharacterDetails: React.FC<ComponentProps> = ({route}) => {
  const {character} = route.params;
  const [homeworld, setHomeworld] = useState('');
  const [species, setSpecies] = useState('');

  useEffect(() => {
    if (character.homeworld) {
      axios
        .get(character.homeworld)
        .then(response => {
          setHomeworld(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching homeworld:', error);
        });
    }
  }, [character.homeworld]);

  useEffect(() => {
    if (character.species && character.species.length > 0) {
      axios
        .get(character.species[0])
        .then(response => {
          setSpecies(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching species:', error);
        });
    }
  }, [character.species]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/StarWars.png')}
        style={styles.backgroundImage}>
        <View style={styles.containerText}>
          <Text style={styles.infoText}>
            Name:
            <Text style={styles.text}> {character.name}</Text>
          </Text>
          <Text style={styles.infoText}>
            Birth Year:
            <Text style={styles.text}> {character.birth_year}</Text>
          </Text>
          <Text style={styles.infoText}>
            Gender:
            <Text style={styles.text}> {character.gender}</Text>
          </Text>
          <Text style={styles.infoText}>
            Home World:
            <Text style={styles.text}> {homeworld}</Text>
          </Text>
          <Text style={styles.infoText}>
            Species:
            <Text style={styles.text}> {species}</Text>
          </Text>
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
    paddingTop: 30,
    alignItems: 'center',
  },
  containerText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20,
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

export default CharacterDetails;
