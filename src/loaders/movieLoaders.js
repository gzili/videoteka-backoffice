import { api } from "../api.js";

export function moviesLoader() {
  return api.get('movies').json();
}

export async function movieLoader({ params }) {
  return api.get(`movies/${params.id}`).json();
}
