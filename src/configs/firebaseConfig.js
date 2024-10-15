import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Service account credentials from environment variables
const serviceAccountJson = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database",
  "https://www.googleapis.com/auth/firebase.messaging",
];

// Function to get access token
export async function getAccessToken() {
  const authClient = new google.auth.JWT(
    serviceAccountJson.client_email,
    null,
    serviceAccountJson.private_key,
    scopes
  );

  await authClient.authorize();
  const accessToken = authClient.credentials.access_token;

  // Log the access token for debugging (optional)
  console.log("Access Token:", accessToken);

  return accessToken;
}
