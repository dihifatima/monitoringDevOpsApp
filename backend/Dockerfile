# -------- 1) Build the application --------
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies first (faster builds)
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn -q clean package -DskipTests=true -Dmaven.test.skip=true

# -------- 2) Run the application (lighter image) --------
FROM --platform=linux/arm64 eclipse-temurin:21-jre
WORKDIR /app

# Active le profil "prod" par défaut dans le conteneur
ENV SPRING_PROFILES_ACTIVE=prod

# Copy the jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-Xmx350m", "-XX:TieredStopAtLevel=1", "-XX:+UseSerialGC", "--enable-preview", "-jar", "app.jar"]