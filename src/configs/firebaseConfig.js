// import axios from "axios";
import { google } from "googleapis";

// Service account credentials
const serviceAccountJson = {
  type: "service_account",
  project_id: "gogoa-4d569",
  private_key_id: "d8b91f886e7079c4e9fd4a0189f27e32be25e18c",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCs4Nc15faxxque\nNhCDdgpHzS4r2MyNmZCjrBB5LzkJx2uulcrLWejGWHc+dthXrqeXwNX03LIQAv3h\nOcxHVcoTYDdrw6YYnPCPsSO2Yi/hL+W3lgoJGWUXqpwelqV+ejMzJQaLxdMA8e1o\ny26x/yMCPUFL0v8xrqxN7cujF8C/EJJK4IFe5ZdvveF7U98cJX0V7xWP5ypHcTo6\nYkom0woH+6C0AN6Cd/U/o/nIrvzgFFdzAJvgQzV4XWt6JxgJtY6sss46p2lInR6b\nLaXeiGZIBoA1h9D1k9U4QJcDJT6P09orEz/O2ZkWyNMYQxl3+aMRtPGdQurMhai8\npcWF45OHAgMBAAECggEAE+soALbJULxiQ61ZA7yS/KjgW/7zupDqAGGv2DafrMfE\nWW462mk2j7vbqV/KF3gxKSP3wum2vm+Jzux44/M3gDoCyLDXL1jNwtCXG8l+WMTL\nA/cOmvPJGQv4RvH2iXcM9SSb93jIkgBN6VgfHfUWlIh4QINEEfZdNfFjGByBgcH3\njVc89bnRy8KJc9WcZVFubSqf1H+spRwiZ7Dz2f5avz88FTWgnoJBJiyRCUlNschK\nA3U9/9fwVO5yQ3Ia/JZ7VtFyg3SoZ23S7m7KdudiRnEzw3L1MNLmWjWw1yeQYCgK\nYA5qWA7A2NBSVn/BJl9CdGIoCGsczoPoEL6HCrI4CQKBgQDViKIEk6gL+f7epvYs\n/sQW6aVif/p/bTe3lEnG0cbVGioAKtt4QpmtmavGcOtJNX+clx0qSFYrAyXqequ2\ndMfJ8kyc1bXz38VrHEdkIbGv06SnOAKQkxupNsvbHGHF3kRo4G24LuMBKjfQ62uN\nQwoOhrJufQ9098wrkzoqR+huMwKBgQDPQl6vWB0vDiC+4DIoIf9CWfQG96q4udre\nxMQCRB+KRpxjdjRJ3kQ0CbigLQBjcwx7RBAlYIfnIrR2hpJ0TnaAO/ugDmreigaT\nlZ+sthjiiL3aUwhmVEuEFNjQNuVj4wKo/Ze3wDOWex85v3freCa2SdPzFlSTX3br\nBMkED91JXQKBgBa5CXSvOcy8d7C916iGG9vMVTscH038E1fHweoUXLJErH+EEALG\nI5Bjr/HYBlGuDbxeIE5lkDXXietfznIGD1SgIiL2YvxmrZ1uTvKK21u4i+b3gN5d\nqS3ilOLmLElgE6uNZl+ZLbLsCTCEPNe1cJaHIum7CTALRoDElAX3zPYdAoGBAMng\ncM/EOPDrhvPE9rXmn3amna3nsS+rQEg6Sl2Ws04BhzTOHxJQYAh764yBKN61YlPy\nsPNnOhjl0fedDqwg/QXc5zQ4ttm6gbthQx18ZXLKFHrC4+ygcMnfcGwm/Hq11JJ8\nKDqACP+rP3gFSq5d4v8tnDgr6Qd/NhqnF5FQTo+1AoGAZPUq2q5f8HyXdgU+nLpi\n2nlxyzyFN7PULTbM4D0arFSLeGOSQMNOZISU1ITtMwAGFmsYLjIc5T8w9x1GNt1M\nmCUTaK0erR0OER9b6flFPqj5AjXQt1hKhE2SHk9NuwG3SrvqLbCe+5qskSlgjPEk\nFhlHihGcv5uGA/3Wd37A4Es=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-5a6ea@gogoa-4d569.iam.gserviceaccount.com",
  client_id: "118023257420300985930",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5a6ea%40gogoa-4d569.iam.gserviceaccount.com",
};

// Scopes
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

  // Log the access token for debugging
  console.log("Access Token:", accessToken);

  return accessToken;
}
