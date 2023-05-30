import { api } from "../api.js";

export function seriesLoader() {
  return api.get('series').json();
}

export function loadSeriesById({ params }) {
  return api.get(`series/${params.id}`).json();
}

export function episodeLoader({ params }) {
  return api.get(`episodes/${params.id}`).json();
}
