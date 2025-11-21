import { storage } from './storage';

const FAVORITES_KEY = 'quickshow_favorites';

const readFavorites = () => storage.get(FAVORITES_KEY, []);

const writeFavorites = (favorites) => {
  storage.set(FAVORITES_KEY, favorites);
  return favorites;
};

export const getFavorites = () => readFavorites();

export const isFavoriteMovie = (movieId) => readFavorites().some((movie) => movie.id === movieId);

export const toggleFavoriteMovie = (movie) => {
  const favorites = readFavorites();
  const exists = favorites.some((item) => item.id === movie.id);

  const updated = exists
    ? favorites.filter((item) => item.id !== movie.id)
    : [...favorites, movie];

  writeFavorites(updated);
  return { favorites: updated, isFavorite: !exists };
};

export const removeFavoriteMovie = (movieId) => {
  const updated = readFavorites().filter((movie) => movie.id !== movieId);
  writeFavorites(updated);
  return updated;
};

