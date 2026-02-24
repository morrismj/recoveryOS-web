import { beforeEach, describe, expect, it, vi } from "vitest";

const getServerSessionMock = vi.fn();
const authOptionsStub = { providers: [] };

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock
}));

vi.mock("../lib/auth/options", () => ({
  authOptions: authOptionsStub
}));

describe("auth session helpers", () => {
  beforeEach(() => {
    getServerSessionMock.mockReset();
  });

  it("returns null when there is no session", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);

    const { getCurrentUserId } = await import("../lib/auth/session");
    const result = await getCurrentUserId();

    expect(result).toBeNull();
    expect(getServerSessionMock).toHaveBeenCalledWith(authOptionsStub);
  });

  it("returns null when NextAuth treats an expired session as missing", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);

    const { getCurrentUserId } = await import("../lib/auth/session");
    const result = await getCurrentUserId();

    expect(result).toBeNull();
    expect(getServerSessionMock).toHaveBeenCalledWith(authOptionsStub);
  });

  it("returns the user id for a valid session", async () => {
    getServerSessionMock.mockResolvedValueOnce({
      user: { id: "user-123", email: "test@example.com" },
      expires: "2026-12-31T00:00:00.000Z"
    });

    const { getCurrentUserId } = await import("../lib/auth/session");
    const result = await getCurrentUserId();

    expect(result).toBe("user-123");
    expect(getServerSessionMock).toHaveBeenCalledWith(authOptionsStub);
  });
});
