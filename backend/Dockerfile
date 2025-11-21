# ----------------------------
# 1. Build Stage
# ----------------------------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download deps first
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ----------------------------
# 2. Run Stage
# ----------------------------
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy jar from previous stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Start Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
