import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  showApi,
  movieApi,
  bookingApi,
  getDefaultUserId,
  getBookedSeatsForShow,
} from '../lib/quickshowApi';

const SeatLayout = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);

  const fetchShowDetails = useCallback(async () => {
    try {
      const showData = await showApi.get(showId);
      if (!showData) {
        throw new Error('Show not found');
      }
      setShow(showData);
      const movieData = await movieApi.get(showData.movieId);
      setMovie(movieData);
      setBookedSeats(getBookedSeatsForShow(showId));
      setSelectedSeats([]);
    } catch (error) {
      console.error('Error fetching show details:', error);
      toast.error('Unable to load show information.');
    } finally {
      setLoading(false);
    }
  }, [showId]);

  useEffect(() => {
    fetchShowDetails();
  }, [fetchShowDetails]);


  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const cols = 10;

    for (let i = 0; i < rows.length; i++) {
      const rowSeats = [];
      for (let j = 1; j <= cols; j++) {
        const seatNumber = `${rows[i]}${j}`;
        rowSeats.push({
          id: seatNumber,
          row: rows[i],
          number: j,
          isSelected: selectedSeats.includes(seatNumber),
          isBooked: bookedSeats.includes(seatNumber),
        });
      }
      seats.push(rowSeats);
    }
    return seats;
  };

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      toast.error('Seat already booked');
      return;
    }
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < 6) { // Limit to 6 seats per booking
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        toast.error('You can select maximum 6 seats per booking');
      }
    }
  };

  const calculateTotal = () => {
    return selectedSeats.length * (show?.ticketPrice || 0);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        showId,
        movieId: movie.id,
        theaterId: show.theaterId,
        userId: getDefaultUserId(),
        seatNumbers: selectedSeats,
        totalAmount: calculateTotal(),
        paymentMethod: 'CREDIT_CARD',
      };

      await bookingApi.create(bookingData);
      toast.success('Booking successful!');
      setBookedSeats([...bookedSeats, ...selectedSeats]);
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!show || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Show not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const seats = generateSeats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Layout */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Seats</h2>
              
              {/* Movie Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{movie.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Screen {show.screenNumber}</span>
                  <span>•</span>
                  <span>{show.showType}</span>
                  <span>•</span>
                  <span>${show.ticketPrice} per seat</span>
                </div>
              </div>

              {/* Screen */}
              <div className="mb-8">
                <div className="bg-gray-300 h-2 rounded-lg mb-8"></div>
                <div className="text-center text-sm text-gray-500 mb-4">SCREEN</div>
              </div>

              {/* Seats */}
              <div className="space-y-2">
                {seats.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center space-x-1">
                    <div className="w-6 text-center text-sm font-medium text-gray-600 flex items-center">
                      {row[0].row}
                    </div>
                    {row.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.isBooked}
                        className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                          seat.isBooked
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : seat.isSelected
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Movie</span>
                  <span className="font-medium">{movie.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Show Time</span>
                  <span className="font-medium">
                    {show.showDate
                      ? new Date(`${show.showDate}T${show.showTime ?? '00:00'}`).toLocaleString([], {
                          weekday: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : show.showTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Screen</span>
                  <span className="font-medium">{show.screenNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Seats</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Seat</span>
                  <span className="font-medium">${show.ticketPrice}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-600">${calculateTotal()}</span>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Selected Seats</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || bookingLoading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {bookingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout; 