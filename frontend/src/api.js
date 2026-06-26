import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
});

export async function fetchAppData() {
  try {
    const { data } = await api.get("/api/data");
    return data;
  } catch {
    throw new Error("Не удалось загрузить данные");
  }
}
