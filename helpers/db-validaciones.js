const Role=require('../models/rol');
const Usuario = require('../models/usuario');
const {Categoria,Producto} = require('../models')

const esRolValido=async (rol ="")=>{
    const exiteRol= await Role.findOne({rol});
    if(!exiteRol){
      throw new Error (` El rol '${rol}' no existe en la base de datos `)
    }
  }

  const emailExiste=  async (correo="")=>{
   const existeCorreo= await  Usuario.findOne({correo});
    if(existeCorreo){
      throw new Error (`El correo ya existe ${correo}`)
    }
  }

  const usuarioExiste=async (id)=>{
    const existeUsr= await  Usuario.findById(id);

    if(!existeUsr){
      throw new Error (`No existe ningun usuario con este id :  ${id}`)
    }
  }

  const existeCategoria=async (id)=>{
    console.log(id)
    const existeCat= await  Categoria.findById(id);

    if(!existeCat){
      throw new Error (`No existe ninguna categoria  con este id :  ${id}`)
    }
  }

  const existeProducto=async (id)=>{
    console.log(id)
    const existe= await  Producto.findById(id);

    if(!existe){
      throw new Error (`No existe ninguna producto  con este id :  ${id}`)
    }
  }

  const existeCategoriaNombre=async (nombre)=>{


    const existeCat= await  Categoria.findOne({nombre:nombre.toUpperCase()});

    if(existeCat){
      throw new Error (`Ya existe una categoria con ese nombre :  ${nombre.toUpperCase()}`)
    }
  }


  const coleccionesPermitidas =(coleccion='',colecciones=[])=>{

    const incluida= colecciones.includes(coleccion);

    if(!incluida){
       throw new Error (`La coleccion : ${coleccion} no es valida , lista de colecciones validas : ${colecciones}`);
    }
    
    return true;

  }

  module.exports = {
      esRolValido,
      emailExiste,
      usuarioExiste,
      existeCategoria,
      existeCategoriaNombre,
      existeProducto,
      coleccionesPermitidas
}