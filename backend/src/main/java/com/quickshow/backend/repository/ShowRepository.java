package com.quickshow.backend.repository;

import com.quickshow.backend.model.Show;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends MongoRepository<Show, String> {
    List<Show> findByMovieIdAndShowDateAndIsActiveTrue(String movieId, LocalDate showDate);
    List<Show> findByTheaterIdAndShowDateAndIsActiveTrue(String theaterId, LocalDate showDate);
    List<Show> findByMovieIdAndIsActiveTrue(String movieId);
    List<Show> findByTheaterIdAndIsActiveTrue(String theaterId);
    List<Show> findByIsActiveTrue();
}