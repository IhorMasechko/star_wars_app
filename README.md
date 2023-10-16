# Star wars app | Test task

## App view

<img src="./star_wars_app/assets/StarWarsVideo.gif" width="350" height="750">

## Implementation of the project

- The project was compiled with [npx react-native@latest init star_wars_app](https://reactnative.dev/docs/environment-setup).
- Components are created using the library
  "@react-native-async-storage/async-storage", "@react-navigation/native-stack", "axios"
- Used as `backend` (https://swapi.dev/api/)
- State management libraries used "useContext". All the necessary data for the correct operation of the application
   stored in `localStorage`

### Implemented:

1. `Home` page with a list of characters, button like and pagination.
2. The `Statistics` page, which displays statistics about amount likes characters in gender.
3. The `CharacterDetails` page, which displays infornmation about characters (Name, Birth Year, Gender, Home World, Species).
