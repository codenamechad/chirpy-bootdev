import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, getBearerToken } from "./src/auth.js";
import { AuthorizationError } from "./src/api/errors.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT", () => {
  const secret = "test-secret";
  const userId = "user-123";
  let token: string;

  beforeAll(() => {
     token = makeJWT(userId, 10, secret)
  });

  it("accepts a valid token", () => {
    const userFromToken = validateJWT(token, secret);
    expect(userFromToken).toBe(userId);
  });


it("rejects a token signed with the wrong secret", () => {
  expect(() => {
    validateJWT(token, "wrong-secret");
  }).toThrow(AuthorizationError); 
})

it("rejects an expired token", () => {
  const expiredToken = makeJWT(userId, -10, secret);
  expect(() => {
    validateJWT(expiredToken, secret);
  }).toThrow(AuthorizationError);
});
});

describe("Test getBearerToken", () => {
  




})