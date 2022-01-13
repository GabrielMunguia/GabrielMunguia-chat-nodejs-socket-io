const { response } = require("express");
const jwt= require('jsonwebtoken')
const Usuario=require('../models/usuario')


const validarJWT=async  (req,res=response,next)=>{
    const token=req.header('x-token')
    if(!token){
        return res.status(401).json({
            msj:'No hay token en la peticion'
        }
        );
    }
   
    try{

        const {uid}= jwt.verify(token,process.env.SECRETOKEY)
         const usuario=  await Usuario.findById(uid);
         if(!usuario){
            return  res.status(401).json({
                 msj:'TOken no valido -- Usuario no existe en base de datos'
             })
         }
         if(!usuario.estado){
            
            return  res.status(401).json({
                 msj:'TOken no valido -- Usuario con estado  en falso'
             })
         }

        req.usuario=usuario;
        
        next();

    }catch(e){
    
        return res.status(400).json({
            msj:'Token no valido'
        });
    }
}

module.exports={
    validarJWT
}