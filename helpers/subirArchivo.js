const path= require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo=({archivo},extencionesValidas = ['png','jpg','jpeg','gif'],carpeta='')=>{

    return new Promise((resolve,reject)=>{

     
        const nombreCortado=archivo.name.split('.');
        //extencion del archivo 
        const extencion = nombreCortado[nombreCortado.length - 1];
        //extenciones validas
    
     
        if(!extencionesValidas.includes(extencion)){
          return reject(`Extencion no valida :  "${extencion}" , lista de extenciones validas : ${extencionesValidas}`)
        }
     
        //nombre temporal archivo
        const nombreTemporal= uuidv4()+'.'+extencion;
     
         const uploadPath =path.join( __dirname , '../uploads',carpeta ,nombreTemporal);
       
         // Use the mv() method to place the file somewhere on your server
         archivo.mv(uploadPath, function(err) {
           if (err){
             return reject('Ocurrio un error , comuniquese con el administrador')
            }
       
          resolve(nombreTemporal);
         });
    })

}

module.exports = {subirArchivo}