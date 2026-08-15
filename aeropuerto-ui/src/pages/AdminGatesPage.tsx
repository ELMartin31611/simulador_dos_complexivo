import { useEffect, useState } from "react";
import {
 Container, Paper, Typography, TextField, Button, Stack,
 Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
 FormControlLabel,
 Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


import { type Gates, listGatesAdminApi, createGatesApi, updateGatesApi, deleteGatesApi } from "../api/gates.api";


export default function AdminGatesPage() {
 const [items, setItems] = useState<Gates[]>([]);
 const [error, setError] = useState("");

 const [editId, setEditId] = useState<number | null>(null);
 const [code, setCode] = useState("");
 const [terminal, setTerminal] = useState("");
 const [is_available, setIsAvailable] = useState(false);
 const [created_at, setCreatedAt] = useState("");

 const load = async () => {
   try {
     setError("");
     const data = await listGatesAdminApi();
     setItems(data.results); // DRF paginado
   } catch {
     setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
   }
 };

 useEffect(() => { load(); }, []);

 const save = async () => {
   try {
     setError("");
     if (!code.trim()) return setError("El nombre es requerido");


     const payload = {
       code: code.trim(),
       terminal: terminal,
       is_available: is_available,
       created_at:created_at
     };


     if (editId) await updateGatesApi(editId, payload);
     else await createGatesApi(payload as any);


     setEditId(null);
     setCode("");
     setTerminal("");
     setIsAvailable(false);
     setCreatedAt("");
     await load();
   } catch {
     setError("No se pudo guardar vehículo. ¿Token admin?");
   }
 };


 const startEdit = (gates: Gates) => {
   setEditId(gates.id);
   setCode(gates.code);
   setTerminal(gates.terminal);
   setIsAvailable(!!gates.is_available);
   setCreatedAt(gates.created_at);
 };


 const remove = async (id: number) => {
   try {
     setError("");
     await deleteGatesApi(id);
     await load();
   } catch {
     setError("No se pudo eliminar gate. ¿Token admin?");
   }
 };


 return (
   <Container sx={{ mt: 3 }}>
     <Paper sx={{ p: 3 }}>
       <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehículos (Privado)</Typography>


       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}


       <Stack spacing={2} sx={{ mb: 2 }}>
         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>


           <TextField label="Code" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
           <TextField label="Terminal" value={terminal} onChange={(e) => setTerminal(e.target.value)} fullWidth />
           <TextField label="created at" value={created_at} onChange={(e) => setCreatedAt(e.target.value)} fullWidth />
           <FormControlLabel
             control={<Checkbox checked={is_available} onChange={(e) => setIsAvailable(e.target.checked)} />}
             label="Activo"
           />
         </Stack>
         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
           <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
           <Button variant="outlined" onClick={() => { setEditId(null); setCode(""); setTerminal(""); setIsAvailable(false); setCreatedAt("") }}>Limpiar</Button>
           <Button variant="outlined" onClick={() => { load(); }}>Refrescar</Button>
         </Stack>
       </Stack>


       <Table size="small">
         <TableHead>
           <TableRow>
             <TableCell>ID</TableCell>
             <TableCell>code</TableCell>
             <TableCell>terminal</TableCell>
             <TableCell>is_available</TableCell>
             <TableCell>created_at</TableCell>
             <TableCell align="right">Acciones</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {items.map((gates) => (
             <TableRow key={gates.id}>
               <TableCell>{gates.id}</TableCell>
               <TableCell>{gates.code}</TableCell>
               <TableCell>{gates.terminal}</TableCell>
               <TableCell>{gates.is_available ? "Sí" : "No"}</TableCell>
               <TableCell>{gates.created_at}</TableCell>
               <TableCell align="right">
                 <IconButton onClick={() => startEdit(gates)}><EditIcon /></IconButton>
                 <IconButton onClick={() => remove(gates.id)}><DeleteIcon /></IconButton>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </Paper>
   </Container>
 );
}