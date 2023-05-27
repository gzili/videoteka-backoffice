import { api } from "../api.js";

export function moviesLoader() {
  return api.get('movies').json();
}