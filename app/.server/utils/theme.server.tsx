import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";
import invariant from "tiny-invariant";

invariant(
  process.env.SESSION_SECRET,
  "SESSION_SECRET must be set in your .env file!"
);

const isProduction = process.env.NODE_ENV === "production";

export const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    ...(isProduction ? { domain: "whiskeynook.com", secure: true } : {}),
  },
});

export const themeSessionResolver =
  createThemeSessionResolver(themeSessionStorage);
