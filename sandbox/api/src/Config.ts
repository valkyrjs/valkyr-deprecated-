import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 8370,
  auth: {
    secret: process.env.AUTH_SECRET || "development",
    token: {
      letters: "1234567890",
      length: 6
    }
  },
  mongo: {
    name: process.env.MONGO_STREAMS_NAME || "toolkit",
    uri: process.env.MONGO_STREAMS_URI || "mongodb://localhost:27027"
  }
};
