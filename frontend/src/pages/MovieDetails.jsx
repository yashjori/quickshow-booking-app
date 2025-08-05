import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Play, ArrowLeft } from 'lucide-react';
import axios from '../lib/axios';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      fetchShows();
    }
  }, [selectedDate, id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      const response = await axios.get(`/api/shows/movie/${id}/date/${selectedDate}`);
      setShows(response.data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatTime = (time) => {
    return time.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Movie not found</h2>
          <Link to="/" className="text-red-600 hover:text-red-700">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Movie Poster */}
            <div className="md:w-1/3">
              <img
                src={movie.posterUrl || 'https://via.placeholder.com/400x600?text=Movie+Poster'}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Movie Info */}
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{movie.title}</h1>
              
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-gray-700">{movie.ratingScore}/10</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{movie.duration} min</span>
                </div>
                <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                  {movie.rating}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Synopsis</h3>
                <p className="text-gray-600 leading-relaxed">{movie.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900">Genre</h4>
                  <p className="text-gray-600">{movie.genre}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Director</h4>
                  <p className="text-gray-600">{movie.director}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Language</h4>
                  <p className="text-gray-600">{movie.language}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Release Date</h4>
                  <p className="text-gray-600">
                    {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {movie.cast && movie.cast.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Cast</h4>
                  <p className="text-gray-600">{movie.cast.join(', ')}</p>
                </div>
              )}

              {movie.trailerUrl && (
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Show Times */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Show Time</h2>
          
          {/* Date Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Date</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {getAvailableDates().map((date) => (
                <button
                  key={date}
                  onClick={() =>{setSelectedDate(date);console.log(selectedDate)}}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    selectedDate === date
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </button>
              ))}
            </div>
          </div>

          {/* Show Times */}
          {selectedDate && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Shows</h3>
              {shows.length === 0 ? (
                <p className="text-gray-500">No shows available for the selected date.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shows.map((show) => (
                    <div
                      key={show.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatTime(show.showTime)}
                        </span>
                        <span className="text-sm text-gray-500">{show.showType}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>Screen {show.screenNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{show.availableSeats} seats available</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-red-600">
                          ${show.ticketPrice}
                        </span>
                        <Link
                          to={`/booking/${show.id}`}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 