import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const envFiles = [".env.local", ".env"];

for (const envFile of envFiles) {
  const fullPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
    break;
  }
}