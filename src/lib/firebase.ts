import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXTFIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXTFIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXTFIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: "gs://website-profile-292b9.appspot.com"
  });
}



const app = admin.app();
export const {
  auth,
  firestore,
  storage,
} = app;

