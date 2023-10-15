import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Main from './components/Main';
import {LikesProvider} from './UseContext/useLikes';

const App: React.FC = () => {
  return (
    <LikesProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
      </SafeAreaView>
      <Main />
    </LikesProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
});

export default App;
