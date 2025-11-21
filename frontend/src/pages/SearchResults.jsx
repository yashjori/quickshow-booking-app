import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Film, Meh } from 'lucide-react';
import toast from 'react-hot-toast';
import { movieApi } from '../lib/quickshowApi';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('title') ?? '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const matches = await movieApi.search(query);
        setResults(matches);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Unable to search movies right now');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center space-x-3 mb-6">
          <Search className="h-6 w-6 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">
            Showing results for <span className="text-red-600">"{query || 'All'}"</span>
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-white rounded-2xl h-80" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Meh className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No matching titles</h2>
            <p className="text-gray-500 mb-6">Try a different title or explore our curated collections.</p>
            <Link
              to="/movies"
              className="inline-flex items-center px-5 py-2 rounded-full border text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Film className="h-4 w-4 mr-2" />
              Browse All Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={movie.posterUrl || 'https://via.placeholder.com/300x400'}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{movie.genre}</p>
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{movie.title}</h2>
                  <p className="text-sm text-gray-500">Rated {movie.rating}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
