import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, RefreshCcw } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { getFavorites, removeFavoriteMovie } from '../lib/favorites';

const Favourite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFavorites(getFavorites());
    setLoading(false);
  }, []);

  const removeFromFavorites = (movieId) => {
    const updatedFavorites = removeFavoriteMovie(movieId);
    setFavorites(updatedFavorites);
  };

  const refreshFavorites = () => {
    setFavorites(getFavorites());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favourites</h1>
            <p className="text-gray-600">Save must-watch titles and unlock personalised alerts.</p>
          </div>
          <button
            onClick={refreshFavorites}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Sync</span>
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">Start adding movies to your favorites to see them here.</p>
            <Link
              to="/"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <div key={movie.id} className="relative">
                <MovieCard movie={movie} />
                <button
                  onClick={() => removeFromFavorites(movie.id)}
                  className="absolute top-2 right-2 bg-white text-red-600 p-2 rounded-full shadow hover:bg-red-50 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourite; 