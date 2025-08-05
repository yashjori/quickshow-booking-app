package com.quickshow.backend.model;

//import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor

public class Screen {
    private String screenNumber;
    private int totalSeats;
    private String screenType; // 2D, 3D, IMAX, etc.
    private List<String> features; // Dolby, 4K, etc.
    
    // Additional constructor for convenience
    public Screen(String screenNumber, int totalSeats, String screenType, List<String> features) {
        this.screenNumber = screenNumber;
        this.totalSeats = totalSeats;
        this.screenType = screenType;
        this.features = features;
    }
}