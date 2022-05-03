import axios from "axios";

export default axios.create({
  baseURL: process.env.SERVER_DOMAIN ? process.env.SERVER_DOMAIN : "http://localhost:8000",
});
