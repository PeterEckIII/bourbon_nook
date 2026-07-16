package com.bourbon_nook.users_api.exceptions;

public class UserUsernameAlreadyExistsException extends RuntimeException {
  public UserUsernameAlreadyExistsException(String message) {
    super(message);
  }
}
