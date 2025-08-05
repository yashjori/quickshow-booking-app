package com.quickshow.backend.controller;

import com.quickshow.backend.model.Theater;
import com.quickshow.backend.service.TheaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/theaters")
@CrossOrigin(origins = "http://localhost:5173")
public class TheaterController {

    @Autowired
    private TheaterService theaterService;

    @GetMapping
    public ResponseEntity<List<Theater>> getAllTheaters() {
        List<Theater> theaters = theaterService.getAllTheaters();
        return ResponseEntity.ok(theaters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Theater> getTheaterById(@PathVariable String id) {
        Optional<Theater> theater = theaterService.getTheaterById(id);
        return theater.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Theater>> getTheatersByCity(@PathVariable String city) {
        List<Theater> theaters = theaterService.getTheatersByCity(city);
        return ResponseEntity.ok(theaters);
    }

    @PostMapping
    public ResponseEntity<Theater> createTheater(@RequestBody Theater theater) {
        Theater createdTheater = theaterService.createTheater(theater);
        return ResponseEntity.ok(createdTheater);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Theater> updateTheater(@PathVariable String id, @RequestBody Theater theaterDetails) {
        Theater updatedTheater = theaterService.updateTheater(id, theaterDetails);
        if (updatedTheater != null) {
            return ResponseEntity.ok(updatedTheater);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTheater(@PathVariable String id) {
        boolean deleted = theaterService.deleteTheater(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 