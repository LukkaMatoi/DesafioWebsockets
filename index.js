/* ---------------------- Modulos ----------------------*/
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io')

/* ---------------------- Servidor----------------------*/
const app = express();

const router = express.Router();

const httpServer = new HttpServer(app)

const io = new IOServer(httpServer)

app.use(express.static('public'))

app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs')

app.use("/api",router)

app.use(bodyParser.urlencoded({extended: true}))

const PORT = 8000

/*---------------------------PRODUCTOS-----------------------------*/

let productos = 
    [{
      title: "Carta",
      price: 10,
      id: 1
    },

        {
          title: "Peluche",
          price: 100,
          id: 2
        },
 
            {
              title: "Figura",
              price: 200,
              id: 3
            }]

/*-----------------------------------------------------------------*/


const mensajes = [];

io.on('connection', socket => {
    console.log(`Nuevo cliente conectado ${socket.id}`);

  
    socket.emit('mensajes', mensajes);


    socket.on('mensajeNuevo', data=>{
        mensajes.push(data);
  
        io.sockets.emit('mensajes', mensajes);
    });
});



app.get('/', (req, res)=>{
    res.render('inicio', {productos: productos});
});



app.post('/save', (req,res) => {
  let nuevoItem = {
    title: req.body.title,
    price: req.body.price,
    id: productos.length + 1,

  }

  productos.push( nuevoItem)

  let productosString = JSON.stringify(productos)

  res.send(`<body>
    <h1>Lista de Productos</h1>
    <p>${productosString}</p>
    <a href="/">agregar otro producto</a>
  </body>`)
  

  console.log(nuevoItem)
  console.log(productos)
})



;
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})


server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});

