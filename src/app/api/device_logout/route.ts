import { db } from "~/server/db";

export async function POST(req: Request) {
  const data = await req.json();

  const { sessionId } = data;

  try {
    await db.session.update({
      where: {
        id: sessionId,
      },
      data: {
        expires: new Date(),
      },
    });
    return new Response("200");
  } catch (error) {
    return new Response("500");
  }
}
