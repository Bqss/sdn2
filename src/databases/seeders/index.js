

const dotenv = require("dotenv");
const { exit } = require("process");
const bcrypt = require("bcrypt");

const admin = require("firebase-admin");
const envFile =
    process.env.NODE_ENV.trim() === "production"
        ? ".env.production"
        : ".env";

dotenv.config({
    path: envFile,
});

const app = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.NEXTFIREBASE_PROJECT_ID,
        clientEmail: process.env.NEXTFIREBASE_CLIENT_EMAIL,
        privateKey: process.env.NEXTFIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
});



const FirebaseCollections = {
    Users: "users",
};
const db = app.firestore();


async function seed() {
    try {
        const user = await db.collection(FirebaseCollections.Users).add({
            name: "Administrator",
            email: "admin@sdn2tamanharjo.com",
            password: bcrypt.hashSync("sdntamanharjo2", 10),
        })
        console.log("Seed completed");
    } catch (e) {
        console.log("Seed failed, " + e);
    }
    exit();
}

seed();
