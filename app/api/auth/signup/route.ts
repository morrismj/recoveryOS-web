import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "../../../../lib/db/index";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const normalizedEmail = email?.trim().toLowerCase() ?? "";
  if (!normalizedEmail || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const existing = await db.userProfile.findUnique({
    where: { email: normalizedEmail }
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 12);
  const user = await db.userProfile.create({
    data: {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      passwordHash,
      timezone: "UTC"
    }
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
