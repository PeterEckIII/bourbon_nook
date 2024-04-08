import { Meta, Links, Form, ScrollRestoration } from "@remix-run/react";
import {
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import ModeToggle from "../ModeToggle/ModeToggle";
import { Button } from "../ui/button";

export default function Layout({
  children,
  theme,
}: {
  theme: Theme | null;
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={theme} />
        <Links />
      </head>
      <body>
        <ThemeProvider specifiedTheme={theme} themeAction="/api/set-theme">
          <ModeToggle />
          <Form action="/logout" method="POST">
            <Button type="submit">Logout</Button>
          </Form>
          {children}
          <ScrollRestoration />
        </ThemeProvider>
      </body>
    </html>
  );
}
