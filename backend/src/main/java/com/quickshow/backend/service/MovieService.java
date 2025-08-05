package com.quickshow.backend.service;

import com.quickshow.backend.model.Movie;
import com.quickshow.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findByIsActiveTrue();
    }

    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    public List<Movie> searchMoviesByTitle(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> getMoviesByLanguage(String language) {
        return movieRepository.findByLanguage(language);
    }

    public Movie createMovie(Movie movie) {
        movie.setCreatedAt(LocalDateTime.now());
        movie.setUpdatedAt(LocalDateTime.now());
        movie.setActive(true);
        return movieRepository.save(movie);
    }

    public Movie updateMovie(String id, Movie movieDetails) {
        Optional<Movie> movie = movieRepository.findById(id);
        if (movie.isPresent()) {
            Movie existingMovie = movie.get();
            existingMovie.setTitle(movieDetails.getTitle());
            existingMovie.setDescription(movieDetails.getDescription());
            existingMovie.setGenre(movieDetails.getGenre());
            existingMovie.setDirector(movieDetails.getDirector());
            existingMovie.setCast(movieDetails.getCast());
            existingMovie.setPosterUrl(movieDetails.getPosterUrl());
            existingMovie.setTrailerUrl(movieDetails.getTrailerUrl());
            existingMovie.setDuration(movieDetails.getDuration());
            existingMovie.setRating(movieDetails.getRating());
            existingMovie.setRatingScore(movieDetails.getRatingScore());
            existingMovie.setLanguage(movieDetails.getLanguage());
            existingMovie.setReleaseDate(movieDetails.getReleaseDate());
            existingMovie.setUpdatedAt(LocalDateTime.now());
            return movieRepository.save(existingMovie);
        }
        return null;
    }

    public boolean deleteMovie(String id) {
        Optional<Movie> movie = movieRepository.findById(id);
        if (movie.isPresent()) {
            Movie existingMovie = movie.get();
            existingMovie.setActive(false);
            existingMovie.setUpdatedAt(LocalDateTime.now());
            movieRepository.save(existingMovie);
            return true;
        }
        return false;
    }
} 