// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// export default api;

import axios from "axios";

// 🔹 .env.local থেকে BASE URL নেওয়া হচ্ছে
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🔹 Axios instance তৈরি
const api = axios.create({
  baseURL: `${baseURL}/api`, // backend-এর /api prefix ধরে নিচ্ছি
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
