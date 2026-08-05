package com.bourbon_nook.bottles_api.models.responses;

import com.bourbon_nook.bottles_api.enums.BottleStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BottleResponseModel {
    private String id;
    private String userId;
    private String name;
    private String type;
    private BottleStatus status;
    private String distillery;
    private String producer;
    private String country;
    private String region;
    private BigDecimal price;
    private String age;
    private double proof;
    private int releaseYear;
    private String barrelInformation;
    private String finishing;
    private String imageUrl;
    private LocalDate openDate;
    private LocalDate killDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

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
