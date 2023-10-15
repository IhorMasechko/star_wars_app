import axios, {AxiosResponse} from 'axios';

const baseURL = 'https://swapi.dev/api/';

export interface SWAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SWAPICharacter[];
}

export interface SWAPICharacter {
  name: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  species: string[];
  url: string;
  liked: boolean;
}

export const queryNames = async (page: number): Promise<SWAPICharacter[]> => {
  try {
    const response: AxiosResponse<SWAPIResponse> = await axios.get(
      `${baseURL}/people?page=${page}`,
    );
    return response.data.results;
  } catch (error) {
    throw error;
  }
};
