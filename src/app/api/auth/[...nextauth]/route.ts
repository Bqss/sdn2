import { firestore } from "@/lib/firebase";
import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const handler = nextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials )
        if (credentials?.email == 'null' || credentials?.password == 'null') {
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
          bcrypt.compareSync(credentials?.password as string, user.docs[0].data().password)
        ) {
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
});

export { handler as GET, handler as POST };
