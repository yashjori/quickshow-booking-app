 package com.quickshow.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickshow.backend.model.Ticket;
import com.quickshow.backend.repository.TicketRepository;

@Service
public class TicketBookingService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ShowService showService;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public List<Ticket> getTicketsByUser(String userId) {
        return ticketRepository.findByUserId(userId);
    }

    public List<Ticket> getTicketsByShow(String showId) {
        return ticketRepository.findByShowId(showId);
    }

    public List<Ticket> getTicketsByStatus(String bookingStatus) {
        return ticketRepository.findByBookingStatus(bookingStatus);
    }

    public Ticket createTicket(Ticket ticket) {
        int numberOfSeats = ticket.getSeatNumbers().size();
        BigDecimal pricePerTicket = ticket.getTotalAmount().divide(BigDecimal.valueOf(numberOfSeats));

        ticket.setBookingDate(LocalDateTime.now());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setBookingStatus("CONFIRMED");
        ticket.setPaymentStatus("PAID");

        if (showService.updateAvailableSeats(ticket.getShowId(), numberOfSeats)) {
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public Ticket updateTicket(String id, Ticket ticketDetails) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        if (ticket.isPresent()) {
            Ticket existingTicket = ticket.get();
            existingTicket.setSeatNumbers(ticketDetails.getSeatNumbers());
            existingTicket.setTotalAmount(ticketDetails.getTotalAmount());
            existingTicket.setBookingStatus(ticketDetails.getBookingStatus());
            existingTicket.setPaymentStatus(ticketDetails.getPaymentStatus());
            existingTicket.setPaymentMethod(ticketDetails.getPaymentMethod());
            existingTicket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(existingTicket);
        }
        return null;
    }

    public boolean cancelTicket(String id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        if (ticket.isPresent()) {
            Ticket existingTicket = ticket.get();
            existingTicket.setBookingStatus("CANCELLED");
            existingTicket.setUpdatedAt(LocalDateTime.now());

            int numberOfSeats = existingTicket.getSeatNumbers().size();
            showService.updateAvailableSeats(existingTicket.getShowId(), -numberOfSeats);

            ticketRepository.save(existingTicket);
            return true;
        }
        return false;
    }

    public boolean deleteTicket(String id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        if (ticket.isPresent()) {
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
    }
}