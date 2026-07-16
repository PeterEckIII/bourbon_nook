package com.bourbon_nook.users_api.exceptions;

public class ErrorCodes {
    public static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    public static final String USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS";
    public static final String USER_EMAIL_ALREADY_EXISTS = "USER_EMAIL_ALREADY_EXISTS";
    public static final String USER_USERNAME_ALREADY_EXISTS = "USER_USERNAME_ALREADY_EXISTS";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String ACCESS_DENIED = "ACCESS_DENIED";
    public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
    public static final String DATABASE_ERROR = "DATABASE_ERROR";
    public static final String EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR";
    public static final String INTERNAL_SERVICE_ERROR = "INTERNAL_SERVICE_ERROR";
}
