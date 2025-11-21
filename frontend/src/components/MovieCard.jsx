import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Play, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { isFavoriteMovie, toggleFavoriteMovie } from '../lib/favorites';

const PlaceholderPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80';

const MovieCard = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(() => isFavoriteMovie(movie.id));
  const poster = movie.posterUrl || PlaceholderPoster;

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { isFavorite: nextState } = toggleFavoriteMovie(movie);
    setIsFavorite(nextState);
    const message = nextState ? 'Added to favourites' : 'Removed from favourites';
    (nextState ? toast.success : toast)(message);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        <img src={poster} alt={movie.title} className="w-full h-80 object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur bg-white/70 text-gray-700 hover:text-red-600 transition-colors ${
            isFavorite ? 'text-red-600 border-red-200' : 'border-white/60'
          }`}
          aria-label="Toggle favourite"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
          {movie.rating || 'NR'}
        </div>
        <Link
          to={`/movie/${movie.id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="bg-white text-gray-900 px-4 py-2 rounded-full flex items-center space-x-2 font-semibold shadow-lg">
            <Play className="h-4 w-4 text-red-600" />
            <span>View Details</span>
          </span>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">{movie.title}</h3>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{movie.ratingScore?.toFixed(1) ?? '8.5'}/10</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{movie.duration ?? 120} min</span>
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{movie.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-gray-400">{movie.genre}</span>
          <Link
            to={`/movie/${movie.id}`}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Book Seats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

