import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = await getToken({
    req
  });

  // Generate JWT token from payload
  const secret = process.env.NEXTAUTH_SECRET; // Replace with your own secret key
  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  const payload = {
    // Add your payload data here
  };
  
  const signature = jwt.sign({ header, payload }, secret);
  
  const encodedToken = `${Buffer.from(JSON.stringify(header)).toString("base64")}.${Buffer.from(JSON.stringify(payload)).toString("base64")}.${signature}`;
  
  return Response.json(encodedToken);
}


