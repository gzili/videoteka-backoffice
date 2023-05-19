import { api } from "../api.js";
import { useQuery } from "@tanstack/react-query";

function getAdminMessage() {
  return api.get('messages/admin').json();
}

export function Create() {
  const { data } = useQuery(['messages/admin'], getAdminMessage);

  return <div>Message: {data?.message}</div>;
}