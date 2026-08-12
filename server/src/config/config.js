import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is missing in environment variables");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing in environment variables");
}

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is missing in environment variables");
}

if (!process.env.LS_TOKEN) {
  throw new Error("LS_TOKEN is missing in environment variables");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT_PRIVATE_KEY is missing in environment variables");
}



const config = {
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV,
  LS_TOKEN: process.env.LS_TOKEN,
  
  MONGO_URI: process.env.MONGO_URI,

  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
};

export default config;