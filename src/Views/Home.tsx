import {
    Button,
    Dialog,
    DialogContent,
    FormControl,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useEffectEvent, useState } from "react";
import { obtenerOrdenes } from "../peticiones/ordenes";
import CircularProgress from "@mui/material/CircularProgress";


const Home = () => {
  const [listaOrdenes, setListaOrdenes] = useState([]);
  const [listaOrdenesFiltro, setListaOrdenesFiltro]= useState([]);
  const [datosCargados, setDatosCargados] = useState(false);
  const [textoIngresado, setTextoIngresado]= useState("");
  const [estadoSeleccionado, setEstadoSelecccionado]= useState(0);
  const [usuarioIngresado,setUsuarioIngresado]= useState("");
  const [mostrarModal, setMostrarModal]= useState(false);
  const [idSeleccionado,setIdSeleccionado]= useState(0);
  const [filaSeleccionada, setFilaSeleccionada]= useState({});

  const obtenerListaOrdenes = async () => {
    debugger;
    const respuesta = await obtenerOrdenes();
    if (respuesta.status === 200) {
      console.log(respuesta);
      setDatosCargados(true);
      const datosObtenidos= respuesta.data;
      setListaOrdenes(datosObtenidos);
      setListaOrdenesFiltro(datosObtenidos)
    } else {
      console.log("Existe un error");
      console.log(respuesta);
    }
  };
  const manejarListaOrdenesSegFiltro=(e)=>{
    debugger
    const {name,value}=e.target;

    if(listaOrdenes.length>0){
        let listaActualizada=[];
        switch(name){
            case "texto":
                setTextoIngresado(value);
                buscarFiltro(value);
                break;
            case "usuario":
                setUsuarioIngresado(value);
                listaActualizada= listaOrdenes.filter((o)=> o.userId === parseInt(value));
                setListaOrdenesFiltro(listaActualizada);
                break;
            case "estado":
                setEstadoSelecccionado(value);
                const valorLista= value===1?"shipped": value===2?"created":"delivered";
                if(value!=0){
                    listaActualizada= listaOrdenes.filter((o)=> o.status === valorLista);
                    setListaOrdenesFiltro(listaActualizada);
                }
                else{
                    setListaOrdenesFiltro(listaOrdenes);
                }
                
                break;
                    }
    }

  }
  const buscarFiltro=(value)=>{
    debugger
     if (value === "") { return; }
     const estadoNumero= estadoSeleccionado===1?"shipped": estadoSeleccionado===2?"created": estadoSeleccionado===3?"delivered":"";
        const filtrarSegunTexto = listaOrdenes.filter((item) => 
        (item.userId.toString().toLowerCase().includes(value.toLowerCase()) ||
    item.status.includes(value.toLowerCase()) || 
    (item.total).toString().toLowerCase().includes(value.toLowerCase())) )
        setListaOrdenesFiltro(filtrarSegunTexto);
  }
  const mostrarDetalle=(codigo)=>{
    debugger
    setMostrarModal(true);
    const datoSeleccionado= listaOrdenes.filter((o)=> o.id=== codigo);
    setIdSeleccionado(codigo);
    setFilaSeleccionada(datoSeleccionado[0]);
  }
  const cerrarModal=()=>{
    setMostrarModal(false);
  }

  useEffect(() => {
    obtenerListaOrdenes();
  }, []);
  useEffect(()=>{
    setDatosCargados(true);
  },[estadoSeleccionado])

  return (
    <Grid size={12}>
      <Typography variant="h1" sx={{ textAlign: "center", p: 2 }}>
        Ordenes de distribucion
      </Typography>

      <Grid
        size={12}
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      >
        <FormControl>
            <Grid size={4} sx={{ px: 2 }}>
          <Typography>Texto</Typography>
          <TextField
          name="texto"
            size="small"
            value={textoIngresado}
            onChange={manejarListaOrdenesSegFiltro}
          />
        </Grid>
        </FormControl>
        
        <Grid size={4} sx={{ px: 2 }}>
          <Typography>Usuario</Typography>
          <TextField
          name="usuario"
            size="small"
            value={usuarioIngresado}
            onChange={manejarListaOrdenesSegFiltro}
          />
        </Grid>
        <Grid size={4} sx={{ px: 2 }}>
          <Typography>Estado</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="estado"
            name="estado"
            value={estadoSeleccionado}
            label="Estado"
            onChange={manejarListaOrdenesSegFiltro}
            size="small"
            fullWidth
          >
            <MenuItem value={0}>Todo</MenuItem>
            <MenuItem value={1}>shipped</MenuItem>
            <MenuItem value={2}>created</MenuItem>
            <MenuItem value={3}>delivered</MenuItem>
            
          </Select>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numero</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Detalle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosCargados && listaOrdenesFiltro ? (
              listaOrdenesFiltro.length > 0 ? (
                listaOrdenesFiltro.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.userId}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell><Button variant="contained" onClick={() => mostrarDetalle(item.id)}>
                          Mas Info</Button>
                          </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={4}>
                        <Typography align="center">No hay datos</Typography>
                    </TableCell>
                </TableRow>
                
              )
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <Grid
                    size={12}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  >
                    <CircularProgress color="success" aria-label="Loading…" />
                    <Typography sx={{ p: 3 }}>Cargando datos...</Typography>
                  </Grid>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Grid>
      <Dialog 
            onClose={cerrarModal} 
                    open={mostrarModal} maxWidth={"sm"} fullWidth={true} >
                    <DialogContent >
                       <Grid container  >
                          <Grid size={12} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", flexWrap:"wrap", }} spacing={2}>
                             <Grid size={12}>
                                <Typography>Informacion</Typography>
                                <Typography>{filaSeleccionada.total}</Typography>
                             </Grid>
                             
                          </Grid>
                       </Grid>
        
                    </DialogContent >
        
                 </Dialog>
    </Grid>
    
  );
  
};
export default Home;
