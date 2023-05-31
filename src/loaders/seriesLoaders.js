import { api } from "../api.js";
import { makeBrowseLoader } from "./shared.js";

export const seriesLoader = makeBrowseLoader('series');

export function loadSeriesById({ params }) {
  return api.get(`series/${params.id}`).json();
}

export function episodeLoader({ params }) {
  return api.get(`episodes/${params.id}`).json();
}
