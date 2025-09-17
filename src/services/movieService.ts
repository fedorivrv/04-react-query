import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { MovieResponse } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!TOKEN) {
  throw new Error('TMDB token is missing! Please add VITE_TMDB_TOKEN to .env');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MovieResponse> {
  const response: AxiosResponse<MovieResponse> = await api.get('/search/movie', {
    params: {
      query,
      page,
      include_adult: false,
      language: 'en-US',
    },
  });

  return response.data;
}
