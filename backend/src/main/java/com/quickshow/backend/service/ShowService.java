package com.quickshow.backend.service;

import com.quickshow.backend.model.Show;
import com.quickshow.backend.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShowService {

    @Autowired
    private ShowRepository showRepository;

    public List<Show> getAllShows() {
        return showRepository.findByIsActiveTrue();
    }

    public Optional<Show> getShowById(String id) {
        return showRepository.findById(id);
    }

    public List<Show> getShowsByMovie(String movieId) {
        return showRepository.findByMovieIdAndIsActiveTrue(movieId);
    }

    public List<Show> getShowsByTheater(String theaterId) {
        return showRepository.findByTheaterIdAndIsActiveTrue(theaterId);
    }

    public List<Show> getShowsByMovieAndDate(String movieId, LocalDate showDate) {
        return showRepository.findByMovieIdAndShowDateAndIsActiveTrue(movieId, showDate);
    }

    public List<Show> getShowsByTheaterAndDate(String theaterId, LocalDate showDate) {
        return showRepository.findByTheaterIdAndShowDateAndIsActiveTrue(theaterId, showDate);
    }

    public Show createShow(Show show) {
        show.setCreatedAt(LocalDateTime.now());
        show.setUpdatedAt(LocalDateTime.now());
        show.setActive(true);
        return showRepository.save(show);
    }

    public Show updateShow(String id, Show showDetails) {
        Optional<Show> show = showRepository.findById(id);
        if (show.isPresent()) {
            Show existingShow = show.get();
            existingShow.setMovieId(showDetails.getMovieId());
            existingShow.setTheaterId(showDetails.getTheaterId());
            existingShow.setScreenNumber(showDetails.getScreenNumber());
            existingShow.setShowDate(showDetails.getShowDate());
            existingShow.setShowTime(showDetails.getShowTime());
            existingShow.setTicketPrice(showDetails.getTicketPrice());
            existingShow.setTotalSeats(showDetails.getTotalSeats());
            existingShow.setAvailableSeats(showDetails.getAvailableSeats());
            existingShow.setShowType(showDetails.getShowType());
            existingShow.setUpdatedAt(LocalDateTime.now());
            return showRepository.save(existingShow);
        }
        return null;
    }

    public boolean deleteShow(String id) {
        Optional<Show> show = showRepository.findById(id);
        if (show.isPresent()) {
            Show existingShow = show.get();
            existingShow.setActive(false);
            existingShow.setUpdatedAt(LocalDateTime.now());
            showRepository.save(existingShow);
            return true;
        }
        return false;
    }

    public boolean updateAvailableSeats(String showId, int seatsBooked) {
        Optional<Show> show = showRepository.findById(showId);
        if (show.isPresent()) {
            Show existingShow = show.get();
            int newAvailableSeats = existingShow.getAvailableSeats() - seatsBooked;
            if (newAvailableSeats >= 0) {
                existingShow.setAvailableSeats(newAvailableSeats);
                existingShow.setUpdatedAt(LocalDateTime.now());
                showRepository.save(existingShow);
                return true;
            }
        }
        return false;
    }
} 