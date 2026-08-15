import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gates, listGatesPublicApi } from "../api/gates.api";
import { type Flights, listFlightsAdminApi, createFlightsApi, updateFlightsApi, deleteFlightsApi } from "../api/flights.api";


export default function AdminFlightsPage() {
 const [items, setItems] = useState<Flights[]>([]);
 const [gates, setGates] = useState<Gates[]>([]);
 const [error, setError] = useState("");


 const [editId, setEditId] = useState<number | null>(null);
 const [gate, setGate] = useState<number>(0);

 const [flight_number, setFlightNumber] = useState("");
 const [destination, setDestination] = useState("");
 const [status, setStatus] = useState("scheduled");
 const [departure_time, setDepartureTime] = useState("");
 const [created_at, setCreatedAt] = useState("");




 const load = async () => {
   try {
     setError("");
     const data = await listFlightsAdminApi();
     setItems(data.results); // DRF paginado
   } catch {
     setError("No se pudo cargar órdenes de producción. ¿Login? ¿Token admin?");
   }
 };


 const loadGates = async () => {
   try {
     const data = await listGatesPublicApi();
     setGates(data.results); // DRF paginado
     if (!gate && data.results.length > 0) setGate(data.results[0].id);
   } catch {
     // si falla, no bloquea la pantalla
   }
 };


 useEffect(() => { load(); loadGates(); }, []);


 const save = async () => {
   try {
     setError("");
     if (!gate) return setError("Seleccione una gate");
     if (!flight_number.trim()) return setError("El numero del vuelo ");


     const payload = {
       gate: Number(gate),
       flight_number:flight_number.trim(),
       destination:destination.trim(),
       status: status,
       departure_time: departure_time.trim(),
       created_at: created_at.trim(),
     };


     if (editId) await updateFlightsApi(editId, payload);
     else await createFlightsApi(payload as any);


     setEditId(null);
     setFlightNumber("");
     setDestination("");
     setStatus("scheduled");
     setDepartureTime("");
     setCreatedAt("");
     await load();
   } catch {
     setError("No se pudo guardar orden de producción. ¿Token admin?");
   }
 };


 const startEdit = (order: Flights) => {
   setEditId(order.id);
   setGate(order.gate ?? 0);
   setFlightNumber(order.flight_number ?? "");
   setDestination(order.destination ?? "");
   setStatus(order.status);
   setDepartureTime(order.departure_time ?? "");
   setCreatedAt(order.created_at ?? "");
 };


 const remove = async (id: number) => {
   try {
     setError("");
     await deleteFlightsApi(id);
     await load();
   } catch {
     setError("No se pudo eliminar vehículo. ¿Token admin?");
   }
 };


 return (
   <Container sx={{ mt: 3 }}>
     <Paper sx={{ p: 3 }}>
       <Typography variant="h5" sx={{ mb: 2 }}>Admin Órdenes de Producción (Privado)</Typography>


       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}


       <Stack spacing={2} sx={{ mb: 2 }}>
         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>


           <FormControl sx={{ width: 260 }}>
             <InputLabel id="gates">gates</InputLabel>
             <Select
               labelId="gates"
               label="gates"
               value={gate}
               onChange={(e) => setGate(Number(e.target.value))}
             >
               {gates.map((m) => (
                 <MenuItem key={m.id} value={m.id}>
                   {m.id} (#{m.id})
                 </MenuItem>
               ))}
             </Select>
           </FormControl>
           <TextField label="numero de vuelo" value={flight_number} onChange={(e) => setFlightNumber(e.target.value)} fullWidth />
           <TextField label="destino" value={destination} onChange={(e) => setDestination(e.target.value)} fullWidth />
           <TextField label="departure_time" value={departure_time} onChange={(e) => setDepartureTime(e.target.value)} fullWidth />
           <TextField label="created_at" value={created_at} onChange={(e) => setCreatedAt(e.target.value)} fullWidth />

         </Stack>


         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
           <FormControl sx={{ width: 260 }}>
             <InputLabel id="estado-label">Estado</InputLabel>
             <Select
               labelId="estado-label"
               label="Estado"
               value={status}
               onChange={(e) => setStatus(String(e.target.value))}
             >
               <MenuItem value="scheduled">Scheduled</MenuItem>
               <MenuItem value="boarding">Boarding</MenuItem>
               <MenuItem value="departed">Departed</MenuItem>
               <MenuItem value="delayed">Delayed</MenuItem>
               <MenuItem value="cancelled">Cancelled</MenuItem>
             </Select>
           </FormControl>


           <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
           <Button variant="outlined" onClick={() => { setEditId(null); setFlightNumber(""); setDestination(""); setStatus("scheduled"); }}>Limpiar</Button>
           <Button variant="outlined" onClick={() => { load(); loadGates(); }}>Refrescar</Button>
         </Stack>
       </Stack>


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
             <TableCell align="right">Acciones</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {items.map((flight) => (
             <TableRow key={flight.id}>
               <TableCell>{flight.id}</TableCell>
               <TableCell>{flight.gate}</TableCell>
               <TableCell>{flight.gate_code ?? flight.gate}</TableCell>
               <TableCell>{flight.flight_number}</TableCell>
               <TableCell>{flight.destination}</TableCell>
                <TableCell>{
                  flight.status === "scheduled" ? "Scheduled" : 
                  flight.status === "boarding" ? "Boarding" :
                  flight.status === "departed" ? "Departed" : 
                  flight.status === "delayed" ? "Delayed" :  
                  flight.status === "cancelled" ? "Cancelled" :  
                  "Finalizado"
                  }
                </TableCell>

               <TableCell>{flight.departure_time}</TableCell>
               <TableCell>{flight.created_at}</TableCell>
               <TableCell align="right">
                 <IconButton onClick={() => startEdit(flight)}><EditIcon /></IconButton>
                 <IconButton onClick={() => remove(flight.id)}><DeleteIcon /></IconButton>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </Paper>
   </Container>
 );
}