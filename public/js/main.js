
const socket = io.connect();

function enviarMensaje() {
    const nombre = document.querySelector('#nombre');
    const mensaje = document.querySelector('#mensaje');
    
    socket.emit('mensajeNuevo', {autor: nombre.value, texto: mensaje.value});
    return false;
}

socket.on('mensajes', mensajes => {
    console.log(mensajes);

    let contMensajesHtml = '';

    mensajes.forEach(mensaje => {
        contMensajesHtml += `<span><b>${mensaje.autor}: </b>${mensaje.texto}</span><br>`;
    });

    document.getElementById('contenedorMsjs').innerHTML = contMensajesHtml;
});

function makeHtmlTable(productos) {
    
}