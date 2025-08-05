package com.quickshow.backend.config;

import com.quickshow.backend.model.Movie;
import com.quickshow.backend.model.Screen;
import com.quickshow.backend.model.Show;
import com.quickshow.backend.model.Theater;
import com.quickshow.backend.repository.MovieRepository;
import com.quickshow.backend.repository.ShowRepository;
import com.quickshow.backend.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TheaterRepository theaterRepository;

    @Autowired
    private ShowRepository showRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if no data exists
        if (movieRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // Create Movies
        Movie movie1 = new Movie();
        movie1.setTitle("The Dark Knight");
        movie1.setDescription("When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.");
        movie1.setGenre("Action");
        movie1.setDirector("Christopher Nolan");
        movie1.setCast(Arrays.asList("Christian Bale", "Heath Ledger", "Aaron Eckhart"));
        movie1.setPosterUrl("https://via.placeholder.com/300x450?text=The+Dark+Knight");
        movie1.setTrailerUrl("https://www.youtube.com/watch?v=EXeTwQWrcwY");
        movie1.setDuration(152);
        movie1.setRating("PG-13");
        movie1.setRatingScore(9.0);
        movie1.setLanguage("English");
        movie1.setActive(true);
        movie1.setReleaseDate(LocalDateTime.now().minusDays(30));
        movie1.setCreatedAt(LocalDateTime.now());
        movie1.setUpdatedAt(LocalDateTime.now());
        movieRepository.save(movie1);

        Movie movie2 = new Movie();
        movie2.setTitle("Inception");
        movie2.setDescription("A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.");
        movie2.setGenre("Sci-Fi");
        movie2.setDirector("Christopher Nolan");
        movie2.setCast(Arrays.asList("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"));
        movie2.setPosterUrl("https://via.placeholder.com/300x450?text=Inception");
        movie2.setTrailerUrl("https://www.youtube.com/watch?v=YoHD9XEInc0");
        movie2.setDuration(148);
        movie2.setRating("PG-13");
        movie2.setRatingScore(8.8);
        movie2.setLanguage("English");
        movie2.setActive(true);
        movie2.setReleaseDate(LocalDateTime.now().minusDays(15));
        movie2.setCreatedAt(LocalDateTime.now());
        movie2.setUpdatedAt(LocalDateTime.now());
        movieRepository.save(movie2);

        Movie movie3 = new Movie();
        movie3.setTitle("The Shawshank Redemption");
        movie3.setDescription("Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.");
        movie3.setGenre("Drama");
        movie3.setDirector("Frank Darabont");
        movie3.setCast(Arrays.asList("Tim Robbins", "Morgan Freeman", "Bob Gunton"));
        movie3.setPosterUrl("https://via.placeholder.com/300x450?text=The+Shawshank+Redemption");
        movie3.setTrailerUrl("https://www.youtube.com/watch?v=6hB3S9bIaco");
        movie3.setDuration(142);
        movie3.setRating("R");
        movie3.setRatingScore(9.3);
        movie3.setLanguage("English");
        movie3.setActive(true);
        movie3.setReleaseDate(LocalDateTime.now().minusDays(7));
        movie3.setCreatedAt(LocalDateTime.now());
        movie3.setUpdatedAt(LocalDateTime.now());
        movieRepository.save(movie3);

        // Create Theaters
        Theater theater1 = new Theater();
        theater1.setName("Cineplex Downtown");
        theater1.setAddress("123 Main Street");
        theater1.setCity("New York");
        theater1.setState("NY");
        theater1.setZipCode("10001");
        theater1.setPhone("(555) 123-4567");
        theater1.setEmail("info@cineplexdowntown.com");
        theater1.setScreens(Arrays.asList(
            new Screen("1", 100, "2D", Arrays.asList("Dolby", "4K")),
            new Screen("2", 80, "3D", Arrays.asList("Dolby", "4K", "3D")),
            new Screen("3", 120, "IMAX", Arrays.asList("Dolby", "4K", "IMAX"))
        ));
        theater1.setAmenities(Arrays.asList("Recliner Seats", "Dolby Sound", "4K Projection"));
        theater1.setActive(true);
        theater1.setCreatedAt(LocalDateTime.now());
        theater1.setUpdatedAt(LocalDateTime.now());
        theaterRepository.save(theater1);

        Theater theater2 = new Theater();
        theater2.setName("AMC Multiplex");
        theater2.setAddress("456 Broadway");
        theater2.setCity("New York");
        theater2.setState("NY");
        theater2.setZipCode("10002");
        theater2.setPhone("(555) 987-6543");
        theater2.setEmail("info@amcmultiplex.com");
        theater2.setScreens(Arrays.asList(
            new Screen("1", 90, "2D", Arrays.asList("Dolby")),
            new Screen("2", 75, "3D", Arrays.asList("Dolby", "3D"))
        ));
        theater2.setAmenities(Arrays.asList("Recliner Seats", "Dolby Sound"));
        theater2.setActive(true);
        theater2.setCreatedAt(LocalDateTime.now());
        theater2.setUpdatedAt(LocalDateTime.now());
        theaterRepository.save(theater2);

        // Create Shows
        LocalDate today = LocalDate.now();
        
        // Shows for Movie 1 (The Dark Knight)
        Show show1 = new Show();
        show1.setMovieId(movie1.getId());
        show1.setTheaterId(theater1.getId());
        show1.setScreenNumber("1");
        show1.setShowDate(today);
        show1.setShowTime(LocalTime.of(14, 0));
        show1.setTicketPrice(new BigDecimal("12.99"));
        show1.setTotalSeats(100);
        show1.setAvailableSeats(85);
        show1.setShowType("2D");
        show1.setActive(true);
        show1.setCreatedAt(LocalDateTime.now());
        show1.setUpdatedAt(LocalDateTime.now());
        showRepository.save(show1);

        Show show2 = new Show();
        show2.setMovieId(movie1.getId());
        show2.setTheaterId(theater1.getId());
        show2.setScreenNumber("2");
        show2.setShowDate(today);
        show2.setShowTime(LocalTime.of(17, 30));
        show2.setTicketPrice(new BigDecimal("15.99"));
        show2.setTotalSeats(80);
        show2.setAvailableSeats(60);
        show2.setShowType("3D");
        show2.setActive(true);
        show2.setCreatedAt(LocalDateTime.now());
        show2.setUpdatedAt(LocalDateTime.now());
        showRepository.save(show2);

        // Shows for Movie 2 (Inception)
        Show show3 = new Show();
        show3.setMovieId(movie2.getId());
        show3.setTheaterId(theater1.getId());
        show3.setScreenNumber("3");
        show3.setShowDate(today);
        show3.setShowTime(LocalTime.of(20, 0));
        show3.setTicketPrice(new BigDecimal("18.99"));
        show3.setTotalSeats(120);
        show3.setAvailableSeats(95);
        show3.setShowType("IMAX");
        show3.setActive(true);
        show3.setCreatedAt(LocalDateTime.now());
        show3.setUpdatedAt(LocalDateTime.now());
        showRepository.save(show3);

        Show show4 = new Show();
        show4.setMovieId(movie2.getId());
        show4.setTheaterId(theater2.getId());
        show4.setScreenNumber("1");
        show4.setShowDate(today);
        show4.setShowTime(LocalTime.of(19, 30));
        show4.setTicketPrice(new BigDecimal("11.99"));
        show4.setTotalSeats(90);
        show4.setAvailableSeats(70);
        show4.setShowType("2D");
        show4.setActive(true);
        show4.setCreatedAt(LocalDateTime.now());
        show4.setUpdatedAt(LocalDateTime.now());
        showRepository.save(show4);

        // Shows for Movie 3 (The Shawshank Redemption)
        Show show5 = new Show();
        show5.setMovieId(movie3.getId());
        show5.setTheaterId(theater2.getId());
        show5.setScreenNumber("2");
        show5.setShowDate(today);
        show5.setShowTime(LocalTime.of(16, 0));
        show5.setTicketPrice(new BigDecimal("9.99"));
        show5.setTotalSeats(75);
        show5.setAvailableSeats(50);
        show5.setShowType("2D");
        show5.setActive(true);
        show5.setCreatedAt(LocalDateTime.now());
        show5.setUpdatedAt(LocalDateTime.now());
        showRepository.save(show5);

        System.out.println("Sample data seeded successfully!");
    }
} 