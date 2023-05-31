import { api } from "../api.js";
import { makeBrowseLoader } from "./shared.js";

export const moviesLoader = makeBrowseLoader('movies');

export async function movieLoader({ params }) {
  return api.get(`movies/${params.id}`).json();
}
