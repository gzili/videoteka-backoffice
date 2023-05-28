import { Create } from "./Create.jsx";
import { useLoaderData } from "react-router-dom";

export function EditMovie() {
  const movie = useLoaderData();

  return <Create movie={movie} />
}