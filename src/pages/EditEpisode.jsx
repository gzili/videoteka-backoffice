import { Create } from "./Create.jsx";
import { useLoaderData } from "react-router-dom";

export function EditEpisode() {
  const episode = useLoaderData();

  return <Create episode={episode} />
}