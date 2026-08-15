import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Flights = {
  id: number;
  gate: number;
  gate_code?: string;
  flight_number?: string;
  destination: string;
  status: string;
  departure_time?: string;
  created_at?: string;
};



export async function listFlightsPublicApi() {
  const { data } = await http.get<Paginated<Flights>>("/api/flights/");
  return data; // { ... , results: [] }
}


export async function listFlightsAdminApi() {
  const { data } = await http.get<Paginated<Flights>>("/api/flights/");
  return data;
}


export async function createFlightsApi(payload: Omit<Flights, "id">) {
  const { data } = await http.post<Flights>("/api/flights/", payload);
  return data;
}

export async function updateFlightsApi(id: number, payload: Partial<Flights>) {
  const { data } = await http.put<Flights>(`/api/flights/${id}/`, payload);
  return data;
}


export async function deleteFlightsApi(id: number) {
  await http.delete(`/api/flights/${id}/`);
}