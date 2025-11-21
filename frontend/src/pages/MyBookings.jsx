import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Ticket, Download, X, Film, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi, movieApi, showApi, theaterApi, getDefaultUserId } from '../lib/quickshowApi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [bookingData, movieList, showList, theaters] = await Promise.all([
        bookingApi.listByUser(getDefaultUserId()),
        movieApi.list(),
        showApi.listUpcoming(),
        Promise.resolve(theaterApi.list()),
      ]);

      const movieMap = Object.fromEntries(movieList.map((movie) => [movie.id, movie]));
      const showMap = Object.fromEntries(showList.map((show) => [show.id, show]));
      const theaterMap = Object.fromEntries(theaters.map((theater) => [theater.id, theater]));

      const enriched = bookingData.map((booking) => {
        const show = showMap[booking.showId] ?? {};
        const movie = movieMap[show.movieId];
        const theater = theaterMap[show.theaterId];
        return {
          ...booking,
          movie,
          show,
          theater,
        };
      });

      setBookings(enriched);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingApi.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your movie ticket bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
            <Link
              to="/"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div>
                          <p className="text-sm text-gray-400">
                            Booking #{booking.id ? booking.id.substring(0, 8) : '—'}
                          </p>
                          <h3 className="text-xl font-semibold text-gray-900">{booking.movie?.title ?? 'QuickShow Booking'}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        <InfoPill icon={<Calendar className="h-5 w-5 text-gray-400" />} label="Show Date" value={booking.showDateTime ? new Date(booking.showDateTime).toLocaleDateString() : 'TBD'} />
                        <InfoPill icon={<Clock className="h-5 w-5 text-gray-400" />} label="Show Time" value={booking.showDateTime ? new Date(booking.showDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'} />
                        <InfoPill icon={<MapPin className="h-5 w-5 text-gray-400" />} label="Venue" value={booking.theater ? `${booking.theater.name}, ${booking.theater.city}` : 'TBD'} />
                        <InfoPill icon={<Ticket className="h-5 w-5 text-gray-400" />} label="Seats" value={booking.seatNumbers?.join(', ') ?? '-'} />
                        <InfoPill icon={<DollarSign className="h-5 w-5 text-gray-400" />} label="Amount" value={`$${booking.totalAmount?.toFixed(2) ?? '0.00'}`} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Booked on {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'TBD'}
                        </div>
                        <div className="flex space-x-2">
                          {booking.bookingStatus === 'CONFIRMED' && (
                            <>
                              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                              >
                                <X className="h-4 w-4" />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings; 

const InfoPill = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    {icon}
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);