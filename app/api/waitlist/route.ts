import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO: connect to your email service (Resend, Mailchimp, ConvertKit, etc.)
  // Example with Resend:
  // await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID! });

  console.log("New waitlist signup:", email);

  return NextResponse.json({ ok: true });
}
