import dotenv from "dotenv";
import { app } from "./app.js";
import { connectToMongoDB } from "./src/configs/connectToMongoDB.js";
import admin from "firebase-admin";
import { serviceAccount } from "./src/configs/firebaseConfig.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

connectToMongoDB()
  .then(() => {
    app.listen(PORT, async () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection Failed!! ${error}`);
    process.exit(1);
  });
