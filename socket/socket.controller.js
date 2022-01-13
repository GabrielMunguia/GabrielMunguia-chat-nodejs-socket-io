const { validacionJWT } = require("../helpers/generar-jwt");
const ChatMensajes=require('../models/chat-mensaje');

const chatMensajes = new ChatMensajes();

const socketController=async (socket,io)=>{

    const usuario = await validacionJWT(socket.handshake.headers['x-token']||"");
    if(!usuario){
        socket.disconnect();
    }
  

    // agregamos el usuario al array;
    chatMensajes.agregarUsuario(usuario);
    io.emit('usuarios-activos',chatMensajes.usuariosArr)


    //Agrego un usuario a su sala privada , las salas que tiene son / socket.id,global,usuario.id
    socket.join(usuario.id);

      //Envio todos los mensajes al usuario , al nomas loguearse
      socket.emit('recibir-mensaje',chatMensajes.ultimos10) 

    //Limpiar cuando alguien se desconecta
    
    socket.on('disconnect',()=>{
        chatMensajes.desconectarUsuario(usuario.id)
        //notifico los cambios
        io.emit('usuarios-activos',chatMensajes.usuariosArr)
    })




    socket.on('enviar-mensaje',({uid,mensaje})=>{
        console.log(uid.length)
        if(uid){

            //mensaje privado
             socket.to(uid).emit('mensaje-privado',{de:usuario.nombre,mensaje});

        }else{
            chatMensajes.enviarMensaje(usuario.id,usuario.nombre,mensaje);
       io.emit('recibir-mensaje',chatMensajes.ultimos10)
        }
    })

  
}

module.exports = socketController