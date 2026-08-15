import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Gates = {
    id: number; 
    code: string;
    terminal: string;
    is_available: boolean;
    created_at: string;
 };


export async function listGatesPublicApi() {
  const { data } = await http.get<Paginated<Gates>>("/api/gates/");
  return data; // { ... , results: [] }
}

export async function listGatesAdminApi() {
  const { data } = await http.get<Paginated<Gates>>("/api/gates/");
  return data;
}

export async function createGatesApi(payload: Omit<Gates, "id">) {
  const { data } = await http.post<Gates>("/api/gates/", payload);
  return data;
}

export async function updateGatesApi(id: number, payload: Partial<Gates>) {
  const { data } = await http.put<Gates>(`/api/gates/${id}/`, payload);
  return data;
}

export async function deleteGatesApi(id: number) {
  await http.delete(`/api/gates/${id}/`);
}