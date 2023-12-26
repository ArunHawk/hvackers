import axios from "axios";

const axiosPublicCall = axios.create({
  // baseURL: "https://dback.sightspectrum.co.in",
  baseURL: 'http://localhost:4001',
});

const videoCallApi = {
  // baseURL: "https://dback.sightspectrum.co.in",
  baseURL: 'http://localhost:3000',
}
const axiosPrivateCall = axios.create({
  // baseURL: "https://dback.sightspectrum.co.in",
  baseURL: 'http://localhost:4001',
});

const axiosJsonCall = axios.create({
  baseURL: "https://api.jsonbin.io/v3"
});

axiosPrivateCall.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export { axiosPublicCall, axiosPrivateCall, axiosJsonCall, videoCallApi };

// https://sight-spectrum-ats-backend-production.up.railway.app/
// baseURL: 'http://localhost:4001',

// baseURL: 'https://sightspectrum.co.in/',
