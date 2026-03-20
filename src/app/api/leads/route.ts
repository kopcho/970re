import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const details = [
      `${name} · ${email}`,
      phone,
      type === "valuation" ? address : message,
    ].filter(Boolean).join("\n");

    await resend.emails.send({
      from: "970.re <onboarding@resend.dev>",
      to: "9706698677@vtext.com",
      subject: `New 970.re lead — ${type}`,
      text: `New 970.re lead — ${type}\n${details}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
