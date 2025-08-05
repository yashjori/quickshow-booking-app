package com.quickshow.backend.repository;

import com.quickshow.backend.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByShowId(String showId);
    List<Ticket> findByBookingStatus(String bookingStatus);
    List<Ticket> findByUserIdAndBookingStatus(String userId, String bookingStatus);
} 