"use server";

import { decrypt } from "@/utils/encryption";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SESSION_DURATION = 15 * 60; // 15 minutes

export async function signIn(passcode: string, encryptedPasscode: string) {
  const decryptedPasscode = decrypt(encryptedPasscode, passcode);
  const isValidPasscode = verifyPasscode(passcode, decryptedPasscode);

  if (isValidPasscode) {
    // Create a session token
    const token = sign({ authenticated: true }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the token in an HTTP-only cookie
    cookies().set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION,
      path: "/",
    });

    return { success: true };
  } else {
    return { success: false, error: "Invalid passcode" };
  }
}

export async function extendSession() {
  const token = cookies().get("session_token")?.value;

  if (token) {
    try {
      const decoded = verify(token, JWT_SECRET) as { authenticated: boolean };
      if (decoded.authenticated) {
        const newToken = sign({ authenticated: true }, JWT_SECRET, {
          expiresIn: SESSION_DURATION,
        });
        cookies().set("session_token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: SESSION_DURATION,
          path: "/",
        });
      }
    } catch (error) {
      console.error(error);
      // Token is invalid, do nothing
    }
  }
}

export async function signOut() {
  cookies().delete("session_token");
  redirect("/sign-in");
}

export async function checkAuth() {
  const token = cookies().get("session_token")?.value;

  if (!token) {
    return false;
  }

  try {
    verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function verifyPasscode(passcode: string, decryptedPasscode: string): boolean {
  return passcode === decryptedPasscode;
}
