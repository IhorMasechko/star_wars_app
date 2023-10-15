import React, {useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {LikesContext} from '../../UseContext/useLikes';

const Statistics: React.FC = () => {
  const {globalLikes, resetCountLikes} = useContext(LikesContext) || {
    globalLikes: {male: 0, female: 0, other: 0},
  };

  const handleResetStatistics = () => {
    if (resetCountLikes) {
      resetCountLikes();
    }
  };

  return (
    <View>
      <Text>Male: {globalLikes.male} </Text>
      <Text>Female: {globalLikes.female} </Text>
      <Text>Other: {globalLikes.other}</Text>
      <TouchableOpacity onPress={handleResetStatistics}>
        <Text>Clear likes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Statistics;
