package com.bourbon_nook.bottles_api.models.responses;

public class ImageResponseModel {
    private String imageUrl;
    private String bottleId;

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getBottleId() {
        return bottleId;
    }

    public void setBottleId(String bottleId) {
        this.bottleId = bottleId;
    }
}
