import React, { useEffect, useMemo, useState } from 'react';
import { Filter, SortDesc } from 'lucide-react';
import toast from 'react-hot-toast';
import MovieCard from '../components/MovieCard';
import { movieApi } from '../lib/quickshowApi';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortOption, setSortOption] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await movieApi.list();
        setMovies(data);
      } catch (error) {
        console.error('Unable to load movies', error);
        toast.error('Unable to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const genres = useMemo(() => {
    const genreSet = new Set(movies.map((movie) => movie.genre));
    return ['all', ...Array.from(genreSet).filter(Boolean)];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let list = [...movies];
    if (genreFilter !== 'all') {
      list = list.filter((movie) => movie.genre === genreFilter);
    }
    switch (sortOption) {
      case 'rating':
        list.sort((a, b) => (b.ratingScore ?? 0) - (a.ratingScore ?? 0));
        break;
      case 'duration':
        list.sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));
        break;
      default:
        list.sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''));
    }
    return list;
  }, [movies, genreFilter, sortOption]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-red-500 mb-1">Browse movies</p>
            <h1 className="text-4xl font-bold text-gray-900">Premium catalogue</h1>
            <p className="text-gray-600 mt-2">Filter by genre, compare formats, and lock in the perfect showtime.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={genreFilter}
                onChange={(event) => setGenreFilter(event.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border bg-white text-sm font-semibold text-gray-700"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All genres' : genre}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <SortDesc className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border bg-white text-sm font-semibold text-gray-700"
              >
                <option value="popular">Newest</option>
                <option value="rating">Highest rated</option>
                <option value="duration">Longest runtime</option>
              </select>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-96 rounded-2xl bg-white animate-pulse" />
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <p className="text-xl font-semibold text-gray-700 mb-2">Nothing found for these filters</p>
            <p className="text-gray-500">Try a different genre or sort order.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;

