import createClient from "openapi-fetch";
import type { paths } from "./api-schema";

const client = createClient<paths>({
  baseUrl: process.env.FIREFLY_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.FIREFLY_API_KEY}`,
  },
});

export default client;
