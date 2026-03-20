import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, address, message } = body;

    if (!type || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO leads (type, name, email, phone, address, message)
      VALUES (${type}, ${name}, ${email}, ${phone ?? null}, ${address ?? null}, ${message ?? null})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
