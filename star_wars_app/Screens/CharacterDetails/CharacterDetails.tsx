import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
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
    <View>
      <View>
        <Text>
          Name:
          <Text> {character.name}</Text>
        </Text>
        <Text>
          Birth Year:
          <Text> {character.birth_year}</Text>
        </Text>
        <Text>
          Gender:
          <Text> {character.gender}</Text>
        </Text>
        <Text>
          Home World:
          <Text> {homeworld}</Text>
        </Text>
        <Text>
          Species:
          <Text> {species}</Text>
        </Text>
      </View>
    </View>
  );
};

export default CharacterDetails;
