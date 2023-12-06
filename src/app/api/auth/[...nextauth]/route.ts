import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

// const handler = NextAuth(authOptions);
const handler = async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions());
};
export { handler as GET, handler as POST };
