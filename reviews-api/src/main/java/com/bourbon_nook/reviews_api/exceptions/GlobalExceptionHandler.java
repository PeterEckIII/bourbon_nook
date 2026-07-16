package com.bourbon_nook.reviews_api.exceptions;

import com.bourbon_nook.reviews_api.models.responses.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final HttpServletRequest request;

    public GlobalExceptionHandler(HttpServletRequest request) {
        this.request = request;
    }

    @ExceptionHandler(ReviewNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleReviewNotFound(ReviewNotFoundException ex) {
        log.warn("Review not found: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .errorCode(ErrorCodes.REVIEW_NOT_FOUND)
                .message(ex.getMessage())
                .developerMessage("Review ID does not exist in the system")
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(NoteNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoteNotFound(NoteNotFoundException ex) {
        log.warn("Note not found: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .errorCode(ErrorCodes.USER_NOT_FOUND)
                .message(ex.getMessage())
                .developerMessage("Note ID does not exist in the system")
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCustomerNotFound(UserNotFoundException ex) {
        log.warn("Customer not found: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .errorCode(ErrorCodes.USER_NOT_FOUND)
                .message(ex.getMessage())
                .developerMessage("User ID does not exist in the system")
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        log.warn("Unauthorized: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .errorCode(ErrorCodes.UNAUTHORIZED)
                .message(ex.getMessage())
                .developerMessage("User is not authorized")
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error(HttpStatus.FORBIDDEN.getReasonPhrase())
                .errorCode(ErrorCodes.ACCESS_DENIED)
                .message(ex.getMessage())
                .developerMessage("Access denied for user")
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorResponse> handleTokenExpired(TokenExpiredException ex) {
        log.warn("Token expired: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .errorCode(ErrorCodes.TOKEN_EXPIRED)
                .message(ex.getMessage())
                .developerMessage("Token expired for user")
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(DatabaseErrorException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseError(DatabaseErrorException ex) {
        log.warn("Database error: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .errorCode(ErrorCodes.DATABASE_ERROR)
                .message("Unable to process your request. Please try again later.")
                .developerMessage("Database operation failed: " + ex.getClass())
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(ExternalServiceErrorException.class)
    public ResponseEntity<ErrorResponse> handleExternalServiceError(ExternalServiceErrorException ex) {
        log.warn("External service error: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.SERVICE_UNAVAILABLE.value())
                .error(HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase())
                .errorCode(ErrorCodes.EXTERNAL_SERVICE_ERROR)
                .message("Service temporarily unavailable. Please try again later")
                .developerMessage("External API call failed: " + ex.getMessage())
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    @ExceptionHandler(InternalServiceErrorException.class)
    public ResponseEntity<ErrorResponse> handleInternalServiceError(InternalServiceErrorException ex) {
        log.warn("Internal service error: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse.Builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .errorCode(ErrorCodes.INTERNAL_SERVICE_ERROR)
                .message("An unexpected error occurred. We're working on fixing it.")
                .developerMessage(ex.getClass().getSimpleName() + ": " + ex.getMessage())
                .path(request.getRequestURI())
                .traceId(getTraceId())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    private String getTraceId() {
        return MDC.get("traceId") != null ? MDC.get("traceId") : UUID.randomUUID().toString();
    }
}
