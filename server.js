import dotenv from "dotenv";
import { app } from "./app.js";
import { connectToMongoDB } from "./src/configs/connectToMongoDB.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection Failed!! ${error}`);
    process.exit(1); 
  });
