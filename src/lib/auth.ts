import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "gs_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET is missing or shorter than 32 characters");
  }
  return secret;
}

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Admin login is configured when both ADMIN_EMAIL and ADMIN_PASSWORD are set. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD);
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Checks the admin email (case-insensitive) and password. HMACs of both sides
 * are compared so neither length nor content leaks through timing, and both
 * fields are always checked so the response doesn't reveal which one was wrong.
 */
export async function credentialsMatch(email: string, password: string): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail?.trim() || !expectedPassword) return false;
  const [e1, e2, p1, p2] = await Promise.all([
    hmac(`email:${normalizeEmail(email)}`),
    hmac(`email:${normalizeEmail(expectedEmail)}`),
    hmac(`pw:${password}`),
    hmac(`pw:${expectedPassword}`),
  ]);
  const emailOk = timingSafeEqual(e1, e2);
  const passwordOk = timingSafeEqual(p1, p2);
  return emailOk && passwordOk;
}

export async function createSession(): Promise<void> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin.${expires}`;
  const token = `${payload}.${await hmac(payload)}`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const [, exp, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return timingSafeEqual(sig, await hmac(`admin.${exp}`));
}

/** Call at the top of every admin page and every admin server action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
