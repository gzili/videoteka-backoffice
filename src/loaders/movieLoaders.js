import { api } from "../api.js";

export function moviesLoader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const page = url.searchParams.get('page');
  const searchParams = new URLSearchParams();
  searchParams.set('size', '10');
  q && searchParams.set('title', q);
  page && searchParams.set('page', page);
  return api.get('movies', { searchParams }).json();
}

export async function movieLoader({ params }) {
  return api.get(`movies/${params.id}`).json();
}
