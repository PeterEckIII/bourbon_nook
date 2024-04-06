import { findUserByEmail, findUserByUsername } from "../models/user.model";

export async function checkForExisting(email: string, username: string) {
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    return { email: "That email has already registered on Bourbon Nook" };
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    return { username: "That username has already been taken. Try another" };
  }
}
