package com.quickshow.backend.controller;

import com.quickshow.backend.model.Show;
import com.quickshow.backend.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/shows")
@CrossOrigin(origins = "http://localhost:5173")
public class ShowController {

    @Autowired
    private ShowService showService;

    @GetMapping
    public ResponseEntity<List<Show>> getAllShows() {
        List<Show> shows = showService.getAllShows();
        return ResponseEntity.ok(shows);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable String id) {
        Optional<Show> show = showService.getShowById(id);
        return show.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Show>> getShowsByMovie(@PathVariable String movieId) {
        List<Show> shows = showService.getShowsByMovie(movieId);
        return ResponseEntity.ok(shows);
    }

    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<Show>> getShowsByTheater(@PathVariable String theaterId) {
        List<Show> shows = showService.getShowsByTheater(theaterId);
        return ResponseEntity.ok(shows);
    }

    @GetMapping("/movie/{movieId}/date/{showDate}")
    public ResponseEntity<List<Show>> getShowsByMovieAndDate(
            @PathVariable String movieId,
            @PathVariable String showDate) {
        LocalDate date = LocalDate.parse(showDate);
        List<Show> shows = showService.getShowsByMovieAndDate(movieId, date);
        return ResponseEntity.ok(shows);
    }

    @GetMapping("/theater/{theaterId}/date/{showDate}")
    public ResponseEntity<List<Show>> getShowsByTheaterAndDate(
            @PathVariable String theaterId,
            @PathVariable String showDate) {
        LocalDate date = LocalDate.parse(showDate);
        List<Show> shows = showService.getShowsByTheaterAndDate(theaterId, date);
        return ResponseEntity.ok(shows);
    }

    @PostMapping
    public ResponseEntity<Show> createShow(@RequestBody Show show) {
        Show createdShow = showService.createShow(show);
        return ResponseEntity.ok(createdShow);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Show> updateShow(@PathVariable String id, @RequestBody Show showDetails) {
        Show updatedShow = showService.updateShow(id, showDetails);
        if (updatedShow != null) {
            return ResponseEntity.ok(updatedShow);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable String id) {
        boolean deleted = showService.deleteShow(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 