import type { user } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "../db";

invariant(
  process.env.SESSION_SECRET,
  "SESSION_SECRET must be set in your .env file!"
);

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__bourbon-nook-session",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      secrets: [process.env.SESSION_SECRET],
    },
  });

const USER_SESSION_KEY = "userId";

export async function getUserId(
  request: Request
): Promise<user["id"] | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams.toString()}`);
  }
  return userId;
}

interface CreateUserSessionArgs {
  request: Request;
  userId: user["id"];
  remember?: boolean;
  redirectTo?: string;
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: CreateUserSessionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo || "/", {
    headers: {
      "Set-Cookie": await commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function verifyLogin(email: user["email"], password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { password: true },
  });

  if (!existingUser || !existingUser.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, existingUser.password.hash);

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = existingUser;
  console.log(_password.userId);

  return userWithoutPassword;
}
