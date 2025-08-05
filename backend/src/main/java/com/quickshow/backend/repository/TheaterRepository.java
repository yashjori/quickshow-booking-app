package com.quickshow.backend.repository;

import com.quickshow.backend.model.Theater;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterRepository extends MongoRepository<Theater, String> {
    List<Theater> findByIsActiveTrue();
    List<Theater> findByCity(String city);
    List<Theater> findByCityAndIsActiveTrue(String city);
} 