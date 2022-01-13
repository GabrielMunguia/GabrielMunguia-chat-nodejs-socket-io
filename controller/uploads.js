const path = require('path');
const fs= require('fs');
const { response } = require("express");
const { subirArchivo } = require("../helpers/subirArchivo");
const { Usuario, Producto } = require("../models");
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL)


const cargarArchivo = async (req, res = response) => {
  console.log(req.files);

  try {
    //solo se subiran archivos de texto
    // const nombre= await  subirArchivo(req.files,['txt','md'],"textos");

    // guarda el archivo en la ubicacion por defecto  , asi como solo acepta los archivos por defecto
    const nombre = await subirArchivo(req.files);
    return res.json({ nombre });
  } catch (error) {
    return res.json({ error });
  }
};




const actualizarImagen = async (req, res = response) => {


  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {

    case "usuarios":

      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msj: `Error no existe ningun usuario con ese id : ${id}`,
        });
      }

      break;

    case "productos":

      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msj: `Error no existe ningun producto con ese id : ${id}`,
        });
      }
      break;

    default:

      return res.status(500).json({
        msj: "Error : Contacte con el administrador!!",
      });
  }

  //Verifico si el modelo ya tenia imagen
  if(modelo.img){
    //Elimino la imagen antigua del servidor
    const pathImg= path.join(__dirname,'../uploads/',coleccion,modelo.img);
    if(fs.existsSync(pathImg)){
      fs.unlinkSync(pathImg);
    }
  }

  try {
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    modelo.save();
    return res.json({ modelo });
  } catch (error) {
    return res.json({ error });
  }
};






const actualizarImagenCloudinary = async (req, res = response) => {


  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {

    case "usuarios":

      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msj: `Error no existe ningun usuario con ese id : ${id}`,
        });
      }

      break;

    case "productos":

      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msj: `Error no existe ningun producto con ese id : ${id}`,
        });
      }
      break;

    default:

      return res.status(500).json({
        msj: "Error : Contacte con el administrador!!",
      });
  }

  //Verifico si el modelo ya tenia imagen
  if(modelo.img){
    //Elimino la imagen antigua del servidor
    const nombreArray= modelo.img.split('/');
    const nombre = nombreArray[nombreArray.length - 1];
    const [public_id]=nombre.split('.');
    cloudinary.uploader.destroy(public_id)
  
  }

  try {
    const {tempFilePath}=req.files.archivo;
    const {secure_url}= await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url;
    modelo.save();


    return res.json(modelo);
  } catch (error) {
    console.log(error)
    return res.json({ error });
  }


};





const mostrarImagen = async (req, res = response) => {


  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {

    case "usuarios":

      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msj: `Error no existe ningun usuario con ese id : ${id}`,
        });
      }

      break;

    case "productos":

      modelo = await Producto.findById(id);

      if (!modelo) {
        return res.status(400).json({
          msj: `Error no existe ningun producto con ese id : ${id}`,
        });
      }
      break;

    default:

      return res.status(500).json({
        msj: "Error : Contacte con el administrador!!",
      });
  }

  //Verifico si el modelo ya tenia imagen
  if(modelo.img){
    //Elimino la imagen antigua del servidor
    const pathImg= path.join(__dirname,'../uploads/',coleccion,modelo.img);
    if(fs.existsSync(pathImg)){
     return res.sendFile(pathImg)
    }
  }
  return res.sendFile( path.join(__dirname,'../assets/','no-image.jpg'))


 
};
module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
  
};
