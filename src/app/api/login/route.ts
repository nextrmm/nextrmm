import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await db.user.findUnique({
    where: { email },
  });
  if (user && user.hashedPassword) {
    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (isValid) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      const sessionToken = uuidv4();
      const session = await db.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires,
        },
      });
      const date = new Date();
      date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      const cookieExpires = date.toUTCString();
      return new Response("", {
        status: 200,
        headers: {
          "Set-Cookie": `next-auth.session-token=${sessionToken}; expires=${cookieExpires};path=/`,
        },
      });
    } else {
      return new Response(JSON.stringify({ error: "Wrong Request" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
