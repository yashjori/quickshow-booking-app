// pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../lib/axios';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('title');

  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`/api/movies/search?title=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for: <span className="text-red-600">{query}</span></h1>
      {results.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map(movie => (
            <div key={movie.id} className="bg-white rounded-lg shadow p-4">
              <img
                src={movie.posterUrl || 'https://via.placeholder.com/300x400'}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
              <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-500">{movie.genre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
