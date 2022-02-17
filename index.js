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


/*-------------------------WEBSOCKET-------------------------------*/
const mensajes = [];

io.on('connection', socket => {
    console.log(`Nuevo cliente conectado ${socket.id}`);

  
    socket.emit('mensajes', mensajes);


    socket.on('mensajeNuevo', data=>{
        mensajes.push(data);
  
        io.sockets.emit('mensajes', mensajes);
    });
});


/*-----------------------------------------------------------------*/



/*----------------------------PAGINAS------------------------------*/

app.get('/', (req, res)=>{
    res.render('inicio', {productos: productos});
});



/*---------------------------------*/



router.get("/productos",(req,res)=>{


  
  
  res.send(productos);
});



/*---------------------------------*/



router.get("/productos/:id",(req,res)=>{

  function getById(id){

    const filtro = productos.find((filtro) => filtro.id == id);
   
          if(filtro !== undefined){
              console.log(filtro)
              console.log("-----------------")
              res.send(filtro)
              
          }else{
              console.log(`no se encontro un producto para el id ${id}`)
              return null
          }}
    

    getById(req.params.id)

})



/*---------------------------------*/



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



/*---------------------------------*/



router.delete("/productos/:id",(req,res)=>{
  function deleteById(id){
 
    let valor = id
    
    productos = productos.filter(item => item.id != valor)
    res.send(productos)
}
deleteById(req.params.id)

});



/*---------------------------------*/



router.put("/productos/:id",(req,res)=>{


  function editById(title,price,id){

    let filtro = productos.find((filtro) => filtro.id == id);
  
    filtro = {
      title: title,
      price: price,
      id: id
    }
  res.send(filtro)
  }
  
 editById("nombre Editado","numero editado",req.params.id)

});



/*---------------------------------*/

let inCart = []

router.get("/carrito",(req,res)=>{



res.render("carro",{productos:productos})

});









app.post('/incart', (req,res) => {
  let nuevoItem = {
    
    title: req.body.title,
    price: req.body.price,

  }

  inCart.push(nuevoItem)

  let productosString = JSON.stringify(inCart)

  res.send(`<body>
    <h1>Tu Carrito</h1>
    <p>${productosString}</p>
    <a href="/api/carrito">agregar otro producto</a>
  </body>`)
  

  console.log("funciona")
})







const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})



/*---------------------------------*/



server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});



/*---------------------------------*/


