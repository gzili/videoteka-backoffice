import { api } from "../api.js";

export function seriesLoader() {
  return api.get('series').json();
}