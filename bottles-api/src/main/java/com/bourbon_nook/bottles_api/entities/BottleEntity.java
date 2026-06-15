package com.bourbon_nook.bottles_api.entities;

import com.bourbon_nook.bottles_api.enums.BottleStatus;
import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name="bottles")
public class BottleEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 487687345876523L;

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private BottleStatus status;

    @Column
    private String distillery;

    @Column
    private String producer;

    @Column
    private String country;

    @Column
    private String region;

    @Column
    private BigDecimal price;

    @Column
    private String age;

    @Column
    private double proof;

    @Column
    private int releaseYear;

    @Column
    private String barrelInformation;

    @Column
    private String finishing;

    @Column
    private String imageUrl;

    @Column
    private LocalDate openDate;

    @Column
    private LocalDate killDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public int getYear() {
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
