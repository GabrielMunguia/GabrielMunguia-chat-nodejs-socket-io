const { response } = require("express");
const Usuario= require('../models/usuario')

const bcryptjs = require('bcryptjs');
const {generarJWT} = require("../helpers/generar-jwt");
const { GoogleVerify } = require("../helpers/google-verify");
const login =  async  (req,res=response)=>{
const {correo,password}=req.body;
    try{
//Verificar si el usuario existe
const usuario= await  Usuario.findOne({correo})

if(!usuario){
return  res.status(400).json({
     msj:'Correo/Password no son correcto - Correo'
 })
}

//  Verificar si usuario esta activo

 if(!usuario.estado){
    return  res.status(400).json({
         msj:'Correo/Password no son correcto - NO esta activo'
     })
 }
 
 //Verificar password

 if(!bcryptjs.compareSync(password,usuario.password)){
     return  res.status(400).json({
          msj:'Correo/Password no son correcto - Password Invalido'
      })
  }



 //Generar JWT
 const token = await generarJWT(usuario.id)
 console.log(token)


 res.json({
     usuario,
     token
     
 })
    }catch(e){

        res.status(500)({
            msj:'Comuniquese con el administrador'
        })

    }

}

const google=async (req,res)=>{
    const {id_token}=req.body;

    try{

       const {correo,nombre,img}= await GoogleVerify(id_token)

       let usuario =await  Usuario.findOne({
           correo
       })
      //SI el usuario no existe creamos uno
       if(!usuario){
        console.log('no existe')

        const datos={
            correo,
            nombre,
            img,
            password:'...',
            google:true,
            estado:true
            
        }
           usuario=new Usuario(datos)
       
        
           await usuario.save();
       }

       //Validamos si el estado del usuario

       if(!usuario.estado){
           return res.status(401).json({
               msj:'Error el usuario esta blockeado , comuniquese con el administrador'
           })
       }


       const token = await generarJWT(usuario.id)

      
        res.json({
            usuario,
            token
          
        })

    }catch(e){
        console.log(e)
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
    
}

const renovarToken= async(req,res=response)=>{

   try {
    const {usuario}=req;
    const token= await generarJWT(usuario.id);

    return res.json({
        usuario,
        token
    })
   } catch (error) {
       res.status(500).json({
           msj:'Ocurrio un error  , comuniquese con el administrador'})
   }
  


}

module.exports = {
    login,
    google,
    renovarToken
}