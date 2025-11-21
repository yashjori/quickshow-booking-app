import http from './axios';
import { mockMovies, mockShows, mockBookings, mockTheaters } from '../data/mockData';
import { storage } from './storage';

const BOOKINGS_KEY = 'quickshow_bookings';
const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || 'demo-user';
const prefersMock = (import.meta.env.VITE_USE_MOCK_DATA ?? 'true').toString().toLowerCase() !== 'false';
const apiUnavailable = !import.meta.env.VITE_API_URL;

if (typeof window !== 'undefined' && !storage.exists(BOOKINGS_KEY)) {
  storage.set(BOOKINGS_KEY, mockBookings);
}

const deepClone = (payload) => JSON.parse(JSON.stringify(payload));

const fetchBookingsStore = () => storage.get(BOOKINGS_KEY, deepClone(mockBookings));

const persistBookingsStore = (bookings) => {
  storage.set(BOOKINGS_KEY, bookings);
  return bookings;
};

const shouldUseMock = () => prefersMock || apiUnavailable;

const withFallback = async (requestFn, fallbackFn) => {
  if (!shouldUseMock()) {
    try {
      return await requestFn();
    } catch (error) {
      console.warn('[QuickShow] API request failed, using mock data.', error);
    }
  }
  return fallbackFn();
};

const enrichShow = (show) => {
  const bookings = fetchBookingsStore().filter(
    (booking) => booking.showId === show.id && booking.bookingStatus !== 'CANCELLED',
  );
  const seatsTaken = bookings.reduce((acc, booking) => acc + booking.seatNumbers.length, 0);
  return {
    ...show,
    availableSeats: Math.max(show.totalSeats - seatsTaken, 0),
  };
};

export const movieApi = {
  list: () =>
    withFallback(
      async () => (await http.get('/movies')).data,
      () => deepClone(mockMovies),
    ),
  get: (id) =>
    withFallback(
      async () => (await http.get(`/movies/${id}`)).data,
      () => deepClone(mockMovies.find((movie) => movie.id === id)),
    ),
  search: (query) => {
    const fallback = () =>
      deepClone(
        mockMovies.filter((movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase()),
        ),
      );

    if (!query) return fallback();

    return withFallback(
      async () => (await http.get(`/movies/search`, { params: { title: query } })).data,
      fallback,
    );
  },
};

export const showApi = {
  forMovieAndDate: (movieId, isoDate) =>
    withFallback(
      async () => (await http.get(`/shows/movie/${movieId}/date/${isoDate}`)).data,
      () =>
        deepClone(
          mockShows.filter(
            (show) => show.movieId === movieId && (!isoDate || show.showDate === isoDate),
          ),
        ).map(enrichShow),
    ),
  get: (showId) =>
    withFallback(
      async () => (await http.get(`/shows/${showId}`)).data,
      () => {
        const show = mockShows.find((item) => item.id === showId);
        return show ? enrichShow(show) : null;
      },
    ),
  listUpcoming: () => deepClone(mockShows).map(enrichShow),
};

export const theaterApi = {
  list: () => deepClone(mockTheaters),
};

export const bookingApi = {
  listByUser: (userId = DEFAULT_USER_ID) =>
    withFallback(
      async () => (await http.get(`/tickets/user/${userId}`)).data,
      () =>
        deepClone(
          fetchBookingsStore().filter((booking) => booking.userId === userId),
        ),
    ),
  create: async (payload) =>
    withFallback(
      async () => (await http.post('/tickets', payload)).data,
      () => {
        const show = mockShows.find((item) => item.id === payload.showId);
        if (!show) {
          throw new Error('Show not found');
        }
        const newBooking = {
          id: `bk-${Date.now()}`,
          userId: payload.userId || DEFAULT_USER_ID,
          showId: payload.showId,
          seatNumbers: payload.seatNumbers,
          totalAmount: payload.totalAmount,
          bookingStatus: 'CONFIRMED',
          bookingDate: new Date().toISOString(),
          showDateTime: `${show.showDate}T${show.showTime}`,
        };
        const updated = [...fetchBookingsStore(), newBooking];
        persistBookingsStore(updated);
        return deepClone(newBooking);
      },
    ),
  cancel: (bookingId) =>
    withFallback(
      async () => (await http.put(`/tickets/${bookingId}/cancel`)).data,
      () => {
        const updated = fetchBookingsStore().map((booking) =>
          booking.id === bookingId
            ? { ...booking, bookingStatus: 'CANCELLED', cancelledAt: new Date().toISOString() }
            : booking,
        );
        persistBookingsStore(updated);
        return { id: bookingId, bookingStatus: 'CANCELLED' };
      },
    ),
};

export const getDefaultUserId = () => DEFAULT_USER_ID;

export const getBookedSeatsForShow = (showId) =>
  deepClone(
    fetchBookingsStore()
      .filter((booking) => booking.showId === showId && booking.bookingStatus !== 'CANCELLED')
      .flatMap((booking) => booking.seatNumbers),
  );

