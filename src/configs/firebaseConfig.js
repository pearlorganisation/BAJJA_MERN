// // import axios from "axios";
// import { google } from "googleapis";

// // Service account credentials
// const serviceAccountJson = {
//   type: "service_account",
//   project_id: "gogoa-4d569",
//   private_key_id: "d8b91f886e7079c4e9fd4a0189f27e32be25e18c",
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCs4Nc15faxxque\nNhCDdgpHzS4r2MyNmZCjrBB5LzkJx2uulcrLWejGWHc+dthXrqeXwNX03LIQAv3h\nOcxHVcoTYDdrw6YYnPCPsSO2Yi/hL+W3lgoJGWUXqpwelqV+ejMzJQaLxdMA8e1o\ny26x/yMCPUFL0v8xrqxN7cujF8C/EJJK4IFe5ZdvveF7U98cJX0V7xWP5ypHcTo6\nYkom0woH+6C0AN6Cd/U/o/nIrvzgFFdzAJvgQzV4XWt6JxgJtY6sss46p2lInR6b\nLaXeiGZIBoA1h9D1k9U4QJcDJT6P09orEz/O2ZkWyNMYQxl3+aMRtPGdQurMhai8\npcWF45OHAgMBAAECggEAE+soALbJULxiQ61ZA7yS/KjgW/7zupDqAGGv2DafrMfE\nWW462mk2j7vbqV/KF3gxKSP3wum2vm+Jzux44/M3gDoCyLDXL1jNwtCXG8l+WMTL\nA/cOmvPJGQv4RvH2iXcM9SSb93jIkgBN6VgfHfUWlIh4QINEEfZdNfFjGByBgcH3\njVc89bnRy8KJc9WcZVFubSqf1H+spRwiZ7Dz2f5avz88FTWgnoJBJiyRCUlNschK\nA3U9/9fwVO5yQ3Ia/JZ7VtFyg3SoZ23S7m7KdudiRnEzw3L1MNLmWjWw1yeQYCgK\nYA5qWA7A2NBSVn/BJl9CdGIoCGsczoPoEL6HCrI4CQKBgQDViKIEk6gL+f7epvYs\n/sQW6aVif/p/bTe3lEnG0cbVGioAKtt4QpmtmavGcOtJNX+clx0qSFYrAyXqequ2\ndMfJ8kyc1bXz38VrHEdkIbGv06SnOAKQkxupNsvbHGHF3kRo4G24LuMBKjfQ62uN\nQwoOhrJufQ9098wrkzoqR+huMwKBgQDPQl6vWB0vDiC+4DIoIf9CWfQG96q4udre\nxMQCRB+KRpxjdjRJ3kQ0CbigLQBjcwx7RBAlYIfnIrR2hpJ0TnaAO/ugDmreigaT\nlZ+sthjiiL3aUwhmVEuEFNjQNuVj4wKo/Ze3wDOWex85v3freCa2SdPzFlSTX3br\nBMkED91JXQKBgBa5CXSvOcy8d7C916iGG9vMVTscH038E1fHweoUXLJErH+EEALG\nI5Bjr/HYBlGuDbxeIE5lkDXXietfznIGD1SgIiL2YvxmrZ1uTvKK21u4i+b3gN5d\nqS3ilOLmLElgE6uNZl+ZLbLsCTCEPNe1cJaHIum7CTALRoDElAX3zPYdAoGBAMng\ncM/EOPDrhvPE9rXmn3amna3nsS+rQEg6Sl2Ws04BhzTOHxJQYAh764yBKN61YlPy\nsPNnOhjl0fedDqwg/QXc5zQ4ttm6gbthQx18ZXLKFHrC4+ygcMnfcGwm/Hq11JJ8\nKDqACP+rP3gFSq5d4v8tnDgr6Qd/NhqnF5FQTo+1AoGAZPUq2q5f8HyXdgU+nLpi\n2nlxyzyFN7PULTbM4D0arFSLeGOSQMNOZISU1ITtMwAGFmsYLjIc5T8w9x1GNt1M\nmCUTaK0erR0OER9b6flFPqj5AjXQt1hKhE2SHk9NuwG3SrvqLbCe+5qskSlgjPEk\nFhlHihGcv5uGA/3Wd37A4Es=\n-----END PRIVATE KEY-----\n",
//   client_email: "firebase-adminsdk-5a6ea@gogoa-4d569.iam.gserviceaccount.com",
//   client_id: "118023257420300985930",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url:
//     "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5a6ea%40gogoa-4d569.iam.gserviceaccount.com",
// };

// // Scopes
// const scopes = [
//   "https://www.googleapis.com/auth/userinfo.email",
//   "https://www.googleapis.com/auth/firebase.database",
//   "https://www.googleapis.com/auth/firebase.messaging",
// ];

// // Function to get access token
// export async function getAccessToken() {
//   const authClient = new google.auth.JWT(
//     serviceAccountJson.client_email,
//     null,
//     serviceAccountJson.private_key,
//     scopes
//   );

//   await authClient.authorize();
//   const accessToken = authClient.credentials.access_token;

//   // Log the access token for debugging
// //   console.log("Access Token:", accessToken);

//   return accessToken;
// }

export const serviceAccount = {
  type: "service_account",
  project_id: "gogoa-4d569",
  private_key_id: "153f7c683dd9db8f62407543cd229bcfcbc1ade6",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCm05+JVT2ewORs\nHIDRX7cRofQR2TpnZbtW7DQ4Cq9HjD8hI1RAM/TbbCryCfpY+hG1vUD218gtXBLX\nPXL7Etosc0pQJ51FIf2eBkUxbIE2arwuLT00K3kLPoG1qZOHcxo6sbzILRFj8q6q\ndZO8jAYWjeMWTj8XWJ6e/tPjnGJYN3A5fpIJo3U9ghLggJ7nyrEzU1CILItzt/az\nbpTkJwwYgCbOjX/Yd6Hun5zg4xgKj8Jc+SH/LrBmMBDfrJalhFJjAfcbTUhNIbRN\n9KWY+n5Ayo7V1U+YixFIwKMYYqthHnyc+2eoT+VFYxglE380A+oRGyiju4AEP5JD\nkk/5UXlJAgMBAAECggEAFRFGBSWU28q/vfBmiypTd+BULnnYkIyuGRbIrGgbBQXO\nxhxMTDRTgG87SCge66Qe3uzYuqN65dGKFpDtx4u0ribcFF3AVGXrvYxMqiZp9emK\nPKmdYEx6I4OgBUU2OoV8YzulW8EnQFA6IxAomUe0kB4Ydq1odcYM+Aa10vlhiQK5\nEPs76cxL2CT0+IFrDnr0/G1wB9DFWZsWVdyl82twByN50khHeHQWobnWjIRY0VAF\nCL57NOQcY4rBKQIyQ2ZNonFCtL1qasB0W1vPzmmO9PtHsmhss+OnJZlj+U0wNBNr\n1qiht3rW8TLPq45hwiIEQf66EZjlQ0VnbF3NvFm/BQKBgQDO+rgtQCTfeXAq+8sC\n6lZBtjjQyWXBD6H0qane0lh+E9kbOJLSEV8ApfCOgSDcTAPMSKYlwV50djTzmscQ\nzCymBY+qSIu8oeGKxWrGcGfZYKXDP6g3Gyo6lFhi8fYh3Nx+w0pAQWeB3F7smbVz\nEVPFiwLEj0HgWU07SwEHr5eC/QKBgQDOVmu8UMqyPZOXiJUNNiz92zNemgMsF9c/\nvbkOQRb1zsjW7oq0j2Dac6goVo9JM9Z1K5uPjvoBuAlCaQGZwC1lZlHHQmahxbeC\ncfIBq+nuHQCrRb/fK8bV4JGufGTll7m9Qxnes2x8P1Hr5AQ8FFe2OGkLOdGXL/Db\nUfQhOVc/PQKBgG3zJe9zyaKlIf7Tbw6HaXbS0++lbNZX9ZLApipl1vhylrwtG2FY\nNP1lKRqqYchk4Qed+BTKWeDIAmz95Y14yKcRATZV/1UfMW7EXGo5wBDrlGLZ6AQN\n/CrOLv2wxy1J5B+6ojDsDY4ggJRzOr57j+K6a6f66eXBypMazttEXdoJAoGAR25j\nna3afhoTHkKKVyiKKtfX0MhAkOMwAUEM74JZEH+lx8KNAjUgsn+Xl19f+1eWxrly\nASDeK/oqOnNfunptPM1PQkwae6aXAPGxdiKtuWEQ+joLUpc1HpW/2Uf3JgSAqKSy\nMAatZ9YD5kXpsWLZepvMwbYieNR/7W1Rtq7DJYECgYBGlmVctqx/DxB7bV0rq6zr\n60QUHr9SgRxCKy8J7ZZn2MfITsaRhhqEPaFJWc2ueVYzpsp2qiYqy3L36uWw4+QI\nFQ+qNU4zc2p660YK5DS0NGWuuVp+bBDwcMxOLcPotQXFOLPD7dT+Ih/9YrCefts+\nFNJ9ZaV+HwZ6whRURqBi5Q==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-5a6ea@gogoa-4d569.iam.gserviceaccount.com",
  client_id: "118023257420300985930",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5a6ea%40gogoa-4d569.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
