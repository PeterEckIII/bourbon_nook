package com.bourbon_nook.bottles_api.models.requests;

import com.bourbon_nook.bottles_api.enums.BottleStatus;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateBottleRequest {
    @NotNull(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private String type;

    @NotNull(message = "Status is required")
    private BottleStatus status;

    @NotNull(message = "Distillery is required")
    private String distillery;

    @NotNull(message = "Producer is required")
    private String producer;

    @NotNull(message = "Country is required")
    private String country;

    @NotNull(message = "Region is required")
    private String region;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Age is required")
    private String age;

    @NotNull(message = "Proof is required")
    private double proof;

    @NotNull(message = "Release year is required")
    private int releaseYear;

    @NotNull(message = "Barrel information is required. Type 'N/A' if no additional information is given")
    private String barrelInformation;

    @NotNull(message = "Finishing is required. Type 'N/A' if no finishing barrels were used")
    private String finishing;

    @NotNull(message = "Image URL is required")
    private String imageUrl;

    private LocalDate openDate;
    private LocalDate killDate;

    public CreateBottleRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BottleStatus getStatus() {
        return status;
    }

    public void setStatus(BottleStatus status) {
        this.status = status;
    }

    public String getDistillery() {
        return distillery;
    }

    public void setDistillery(String distillery) {
        this.distillery = distillery;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public double getProof() {
        return proof;
    }

    public void setProof(double proof) {
        this.proof = proof;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getBarrelInformation() {
        return barrelInformation;
    }

    public void setBarrelInformation(String barrelInformation) {
        this.barrelInformation = barrelInformation;
    }

    public String getFinishing() {
        return finishing;
    }

    public void setFinishing(String finishing) {
        this.finishing = finishing;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDate getOpenDate() {
        return openDate;
    }

    public void setOpenDate(LocalDate openDate) {
        this.openDate = openDate;
    }

    public LocalDate getKillDate() {
        return killDate;
    }

    public void setKillDate(LocalDate killDate) {
        this.killDate = killDate;
    }
}
