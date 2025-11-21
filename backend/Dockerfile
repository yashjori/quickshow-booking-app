# Use a Java 17 image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and pom
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy project source
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose backend port
EXPOSE 8080

# Run the Spring Boot JAR
CMD ["java", "-jar", "target/*.jar"]
