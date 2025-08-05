import {React,useState ,useEffect}from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Play } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-80 object-cover border-2 border-amber-700"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/movie/${movie.id}`}
            className="opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="bg-red-600 text-white p-3 rounded-full">
              <Play className="h-6 w-6" />
            </div>
          </Link>
        </div>
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
          {movie.rating}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600">{movie.ratingScore}/10</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{movie.duration} min</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {movie.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{movie.genre}</span>
          <Link
            to={`/movie/${movie.id}`}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 