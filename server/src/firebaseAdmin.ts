import admin from "firebase-admin";
import fs from "fs";
import path from "path";

function initFirebaseAdmin() {
  if (admin.apps.length) return admin;

  // If GOOGLE_APPLICATION_CREDENTIALS is set, use the file
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath && fs.existsSync(credPath)) {
    const serviceAccount = require(path.resolve(credPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return admin;
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // replace literal \n with real newlines
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    return admin;
  }

  // Fall back to application default (works if GOOGLE_APPLICATION_CREDENTIALS provided to env by platform)
  admin.initializeApp({});
  return admin;
}

const firebaseAdmin = initFirebaseAdmin();
const db = firebaseAdmin.firestore();

export { firebaseAdmin as admin, db };
