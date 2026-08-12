import { initializeApp, cert } from "firebase-admin";
import fs from "fs";

const loadServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON");
    }
  }

  const path = new URL("../serviceAccountKey.json", import.meta.url).pathname;
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  }

  throw new Error(
    "Firebase service account is not configured. Set FIREBASE_SERVICE_ACCOUNT or provide services/auth/serviceAccountKey.json"
  );
};

const serviceAccount = loadServiceAccount();

export const app = initializeApp({
  credential: cert(serviceAccount)
});
