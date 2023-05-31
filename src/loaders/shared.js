import { api } from "../api.js";
import { PAGE_SIZES } from "../config.js";

export function makeBrowseLoader(path) {
  return ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const page = url.searchParams.get('page');
    const size = parseInt(url.searchParams.get('size'), 10);
    const searchParams = new URLSearchParams();
    searchParams.set('size', PAGE_SIZES.includes(size) ? `${size}` : '10');
    q && searchParams.set('title', q);
    page && searchParams.set('page', page);
    return api.get(path, { searchParams }).json();
  }
}