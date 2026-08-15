import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { type Flights, listFlightsPublicApi } from "../api/flights.api";

export default function PublicFlightsPage() {
  const [items, setItems] = useState<Flights[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listFlightsPublicApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar la lista pública. ¿Backend encendido?");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}>
          <Typography variant="h5">Lista de Vehículos (Público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>gate</TableCell>
              <TableCell>gate_code</TableCell>
              <TableCell>flight_number</TableCell>
              <TableCell>destination</TableCell>
              <TableCell>status</TableCell>
              <TableCell>departure_time</TableCell>
              <TableCell>created_at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((flights) => (
              <TableRow key={flights.id}>
                <TableCell>{flights.id}</TableCell>
                <TableCell>{flights.gate}</TableCell>
                <TableCell>{flights.gate_code ?? flights.gate}</TableCell>
                <TableCell>{flights.flight_number}</TableCell>
                <TableCell>{flights.destination}</TableCell>
                <TableCell>{
                  flights.status === "scheduled" ? "Scheduled" : 
                  flights.status === "boarding" ? "Boarding" :
                  flights.status === "departed" ? "Departed" : 
                  flights.status === "delayed" ? "Delayed" :  
                  flights.status === "cancelled" ? "Cancelled" :  
                  "Finalizado"
                  }
                </TableCell>
                <TableCell>{flights.departure_time}</TableCell>
                <TableCell>{flights.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}