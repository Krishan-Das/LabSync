import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is missing in environment variables");
}

const config = {
  PORT: Number(process.env.PORT),
};

export default config;