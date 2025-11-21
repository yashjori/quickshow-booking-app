import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Clock, ArrowRight, MapPin, Crown, Sparkles, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import MovieCard from '../components/MovieCard';
import { movieApi, showApi, theaterApi } from '../lib/quickshowApi';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [partnerTheaters, setPartnerTheaters] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const [movieList, showList] = await Promise.all([
          movieApi.list(),
          showApi.listUpcoming(),
        ]);

        setMovies(movieList);
        const sortedShows = [...showList].sort((a, b) =>
          new Date(`${a.showDate}T${a.showTime}`) - new Date(`${b.showDate}T${b.showTime}`)
        );
        setUpcomingShows(sortedShows.slice(0, 5));
        setPartnerTheaters(theaterApi.list());

        const heroCandidate = movieList.find((movie) => movie.backdropUrl) ?? movieList[0];
        setFeaturedMovie(heroCandidate ?? null);
      } catch (error) {
        console.error('Error loading movies', error);
        toast.error('Unable to load movies right now. Showing demo data.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const curatedCollections = useMemo(() => {
    if (!movies.length) {
      return { premium: [], family: [], trending: [] };
    }

    const premium = movies.filter((movie) => movie.tags?.includes('Dolby Atmos')).slice(0, 4);
    const family = movies.filter((movie) => movie.genre === 'Animation' || movie.rating === 'PG').slice(0, 4);
    const trending = movies.slice(0, 6);

    return {
      premium,
      family,
      trending,
    };
  }, [movies]);

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
        <section className="relative h-96 md:h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>
          <div className="relative z-10 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-white">
                <p className="text-sm uppercase tracking-widest text-red-300 mb-2">Featured Premiere</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{featuredMovie.title}</h1>
                <p className="text-lg md:text-xl text-gray-100 mb-6 line-clamp-3">
                  {featuredMovie.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm md:text-base">
                  <span className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span>{featuredMovie.ratingScore}/10</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-white/70" />
                    <span>{featuredMovie.duration} min</span>
                  </span>
                  <span className="bg-red-600/90 text-white px-3 py-1 rounded text-sm font-semibold uppercase tracking-wide">
                    {featuredMovie.rating}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={`/movie/${featuredMovie.id}`}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Book Now</span>
                  </Link>
                  {featuredMovie.trailerUrl && (
                    <button
                      onClick={() => window.open(featuredMovie.trailerUrl, '_blank')}
                      className="border border-white/70 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                    >
                      Watch Trailer
                    </button>
                  )}
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
            <Link to="/movies" className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {movies.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
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

      {/* Collections Section */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <div className="flex items-center space-x-2 text-sm uppercase tracking-widest text-red-500 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Curated Experiences</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Collections that fit your vibe</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <CollectionCard title="Premium & Dolby" badge="Top Picks" movies={curatedCollections.premium} />
            <CollectionCard title="Family Friendly" badge="Weekends" movies={curatedCollections.family} />
          </div>
        </div>
      </section>

      {/* Upcoming premium shows */}
      {upcomingShows.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-widest text-red-500 mb-1">Premium Experiences</p>
                <h2 className="text-3xl font-bold text-gray-900">Cinematic events happening this week</h2>
              </div>
              <Link to="/my-bookings" className="text-red-600 font-semibold hover:text-red-700">
                Manage Bookings
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {upcomingShows.map((show) => {
                const movie = movies.find((item) => item.id === show.movieId);
                const theater = partnerTheaters.find((item) => item.id === show.theaterId);
                return (
                  <div key={show.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{show.showType}</p>
                        <h3 className="text-xl font-semibold text-gray-900">{movie?.title}</h3>
                        <p className="text-sm text-gray-500">{movie?.genre}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {Math.max(show.availableSeats ?? 0, 0)} seats left
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <CalendarPill label={show.showDate} value={show.showTime} />
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{theater?.city ?? 'TBD'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Starting at</p>
                        <p className="text-lg font-semibold text-red-600">${show.ticketPrice}</p>
                      </div>
                    </div>
                    <Link
                      to={`/movie/${show.movieId}`}
                      className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Explore showtimes
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose QuickShow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Play className="h-8 w-8 text-white" />}
              title="Lightning fast booking"
              description="Reserve premium seats with real-time availability and instant confirmation."
            />
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Get the best deals and discounts on movie tickets. Save money on every booking.
              </p>
            </div>
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-white" />}
              title="24/7 Concierge"
              description="We’re online day and night to help with bookings, refunds, and travel plans."
            />
          </div>
        </div>
      </section>

      {/* Partner Theaters */}
      {partnerTheaters.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-widest text-red-500 mb-1">Partner Theaters</p>
                <h2 className="text-3xl font-bold text-gray-900">Cinemas we love</h2>
              </div>
              <span className="inline-flex items-center space-x-2 text-sm text-gray-500">
                <Crown className="h-4 w-4 text-amber-500" />
                <span>Verified premium partners</span>
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {partnerTheaters.slice(0, 3).map((theater) => (
                <div key={theater.id} className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{theater.name}</h3>
                      <p className="text-sm text-gray-500">{theater.city}</p>
                    </div>
                    <Ticket className="h-8 w-8 text-red-500" />
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {theater.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const CalendarPill = ({ label, value }) => {
  const formattedDate = label
    ? new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    : 'Soon';
  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
      <span>{formattedDate}</span>
      <span className="text-gray-400">•</span>
      <span>{value ?? '--:--'}</span>
    </div>
  );
};

const CollectionCard = ({ title, badge, movies }) => (
  <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="uppercase text-xs tracking-[0.3em] text-white/60 mb-1">{badge}</p>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <div className="bg-white/10 px-3 py-1 rounded-full text-xs uppercase tracking-widest">Curated</div>
    </div>
    <div className="grid gap-4">
      {movies.map((movie) => (
        <Link key={movie.id} to={`/movie/${movie.id}`} className="flex items-center space-x-4 group">
          <img
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80'}
            alt={movie.title}
            className="w-14 h-20 rounded-lg object-cover border border-white/10"
          />
          <div>
            <p className="font-semibold group-hover:text-red-300 transition-colors">{movie.title}</p>
            <p className="text-sm text-white/70">{movie.genre}</p>
          </div>
        </Link>
      ))}
      {!movies.length && <p className="text-white/60 text-sm">Coming soon...</p>}
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center">
    <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;