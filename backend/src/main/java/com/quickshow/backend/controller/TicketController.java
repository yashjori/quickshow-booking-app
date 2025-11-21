package com.quickshow.backend.controller;

import com.quickshow.backend.model.Ticket;
import com.quickshow.backend.service.TicketBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketBookingService ticketBookingService;

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketBookingService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        Optional<Ticket> ticket = ticketBookingService.getTicketById(id);
        return ticket.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getTicketsByUser(@PathVariable String userId) {
        List<Ticket> tickets = ticketBookingService.getTicketsByUser(userId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/show/{showId}")
    public ResponseEntity<List<Ticket>> getTicketsByShow(@PathVariable String showId) {
        List<Ticket> tickets = ticketBookingService.getTicketsByShow(showId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/status/{bookingStatus}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable String bookingStatus) {
        List<Ticket> tickets = ticketBookingService.getTicketsByStatus(bookingStatus);
        return ResponseEntity.ok(tickets);
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        Ticket createdTicket = ticketBookingService.createTicket(ticket);
        if (createdTicket != null) {
            return ResponseEntity.ok(createdTicket);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable String id, @RequestBody Ticket ticketDetails) {
        Ticket updatedTicket = ticketBookingService.updateTicket(id, ticketDetails);
        if (updatedTicket != null) {
            return ResponseEntity.ok(updatedTicket);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelTicket(@PathVariable String id) {
        boolean cancelled = ticketBookingService.cancelTicket(id);
        if (cancelled) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        boolean deleted = ticketBookingService.deleteTicket(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 