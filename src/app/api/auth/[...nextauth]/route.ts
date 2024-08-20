import { firestore } from "@/lib/firebase";
import nextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions :AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email == "null" || credentials?.password == "null") {
          throw new Error("Missing credentials");
        }
        const user = await firestore()
          .collection("users")
          .where("email", "==", credentials?.email)
          .get(); 


        if (user.empty) {
          throw new Error("User not found");
        }

        if (
          bcrypt.compareSync(
            credentials?.password as string,
            user.docs[0].data().password
          )
        ) {
          console.log("password udh bener");
          return {
            id: user.docs[0].id,
            username: user.docs[0].data().username,
          };
        } else {
          throw new Error("Invalid password");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
};

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
