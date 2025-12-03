import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,  // e.g., http://localhost:1337/api
});

export async function fetchIndustry() {
  const res = await api.get("/industries?populate=*");
  return res.data.data;
}

export async function fetchCareer() {
  const res = await api.get("/careers?populate=*");
  return res.data.data;
}

export async function fetchTeam() {
  const res = await api.get("/teams?populate[TeamList][populate]=*");
  return res.data.data;
}

// export async function fetchHome() {
//   const res = await api.get("/homes?populate=*");
//   return res.data.data;
// }

export async function fetchServices() {
  const res = await api.get("/services?filters[Services][ServiceTitle][$eq]=Project%20Management&populate[Services][populate][ServiceHead][populate]=*");
  return res.data.data;
}

export default api;
