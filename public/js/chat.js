let socket= null;
let usuario=null;
//REFERENCIAS HTML
const uid=document.querySelector('#uid');
const mensaje= document.querySelector("#mensaje");
const ulUsuarios=document.querySelector('#ulUsuarios');
const ulChat=document.querySelector('#ulChat');
const btnSalir=document.querySelector('#salir');

const url = ( window.location.hostname.includes('localhost') )
                    ? 'http://localhost:8080/api/auth/'
                    : 'https://munguia-chat-node-socket-io.herokuapp.com/api/auth/';
const validarJWT=async ()=>{
const token = localStorage.getItem('token')||"";



if(token.length <=10){
    window.location="index.html"
    throw new Error('No existe token valido')
}
const resp= await fetch(url,{
    headers:{"x-token":token}
})

const {msj,usuario:usuarioDB,token:tokenDB}= await resp.json();
if(msj){
    window.location="index.html"
     throw new Error(msj);
   
}
usuario=usuarioDB
document.title=usuario.nombre;
localStorage.setItem('token',token)
await conectarSocket();
}

const conectarSocket=async ()=>{
    socket=io({
        "extraHeaders":{
            "x-token":localStorage.getItem('token')
        }
    });

    socket.on('connect',()=>{
        console.log('Socket online')
        //TODO
    })

    socket.on('disconnect',()=>{
        //TODO
        console.log('Socket ofline')
    })

    socket.on('recibir-mensaje',dibujarMensajes)
   

    socket.on('usuarios-activos',dibujarUsuariosConectados)

    socket.on('mensaje-privado',(payload)=>{
        console.log(payload)
        
    })

  
    
}

const dibujarUsuariosConectados=(usuarios=[])=>{
    let usuariosLi="";
    usuarios.forEach(({nombre,uid})=>{
        usuariosLi+=`
          <li class="mt-2 container">
             <h5 class="text-success">${nombre}</h5>
             <span class="text-muted fs-6">${uid}</span>
          </li>
        `
    })

    ulUsuarios.innerHTML=usuariosLi;
}
mensaje.addEventListener('keyup',(ev)=>{
    if(ev.keyCode!==13){
        return;
    }
    const mensajeText= mensaje.value;
    if(!mensajeText.length>0){
      
       return 
    }


    socket.emit('enviar-mensaje',{mensaje:mensajeText,uid:uid.value})
    mensaje.value=""
})

const dibujarMensajes=(mensajes=[])=>{
    let mensajesHTML="";
    mensajes.forEach(({nombre,mensaje,uid})=>{
      
        mensajesHTML+=`
          <li class="mt-2 container d-flex justify-content-${uid===usuario.uid?"start":"end"} ">
            <div class="d-flex flex-column col-8  bg-${uid===usuario.uid?"primary ":"secondary"} text-white rounded ">
            <span class="fs-6 px-2 py-1 col-12 d-flex justify-content-end">${nombre}</span>
            <span class="px-2 py-1" >${mensaje}</span>
            </div>
          </li>
        `
    })

    ulChat.innerHTML=mensajesHTML;
}


const main = async ()=>{
    validarJWT();
}

main ();