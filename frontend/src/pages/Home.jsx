import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Clock, ArrowRight } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import axios from '../lib/axios';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/api/movies');
      setMovies(response.data);
      console.log(movies)
      if (response.data.length > 0) {
      setFeaturedMovie(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative h-96 md:h-[600px]">
          <div className="absolute inset-0">
            <img
              src={featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="relative z-10 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {featuredMovie.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-3">
                  {featuredMovie.description}
                </p>
                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-white">{featuredMovie.ratingScore}/10</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-300" />
                    <span className="text-white">{featuredMovie.duration} min</span>
                  </div>
                  <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                    {featuredMovie.rating}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to={`/movie/${featuredMovie.id}`}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Watch Now</span>
                  </Link>
                  <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Movies Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Now Showing</h2>
            <Link
              to="/movies"
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {movies.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No movies available</h3>
              <p className="text-gray-500">Check back later for new releases!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.slice(0, 10).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
                
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose QuickShow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book your favorite movies with just a few clicks. Simple and hassle-free experience.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Get the best deals and discounts on movie tickets. Save money on every booking.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round the clock customer support to help you with any booking issues.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 