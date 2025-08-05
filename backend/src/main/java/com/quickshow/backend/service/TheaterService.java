package com.quickshow.backend.service;

import com.quickshow.backend.model.Theater;
import com.quickshow.backend.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TheaterService {

    @Autowired
    private TheaterRepository theaterRepository;

    public List<Theater> getAllTheaters() {
        return theaterRepository.findByIsActiveTrue();
    }

    public Optional<Theater> getTheaterById(String id) {
        return theaterRepository.findById(id);
    }

    public List<Theater> getTheatersByCity(String city) {
        return theaterRepository.findByCityAndIsActiveTrue(city);
    }

    public Theater createTheater(Theater theater) {
        theater.setCreatedAt(LocalDateTime.now());
        theater.setUpdatedAt(LocalDateTime.now());
        theater.setActive(true);
        return theaterRepository.save(theater);
    }

    public Theater updateTheater(String id, Theater theaterDetails) {
        Optional<Theater> theater = theaterRepository.findById(id);
        if (theater.isPresent()) {
            Theater existingTheater = theater.get();
            existingTheater.setName(theaterDetails.getName());
            existingTheater.setAddress(theaterDetails.getAddress());
            existingTheater.setCity(theaterDetails.getCity());
            existingTheater.setState(theaterDetails.getState());
            existingTheater.setZipCode(theaterDetails.getZipCode());
            existingTheater.setPhone(theaterDetails.getPhone());
            existingTheater.setEmail(theaterDetails.getEmail());
            existingTheater.setScreens(theaterDetails.getScreens());
            existingTheater.setAmenities(theaterDetails.getAmenities());
            existingTheater.setUpdatedAt(LocalDateTime.now());
            return theaterRepository.save(existingTheater);
        }
        return null;
    }

    public boolean deleteTheater(String id) {
        Optional<Theater> theater = theaterRepository.findById(id);
        if (theater.isPresent()) {
            Theater existingTheater = theater.get();
            existingTheater.setActive(false);
            existingTheater.setUpdatedAt(LocalDateTime.now());
            theaterRepository.save(existingTheater);
            return true;
        }
        return false;
    }
} 