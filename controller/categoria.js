const { response } = require("express");
const { Categoria } = require("../models");


const crearCategoria = async (req, res = response) => {
  try {
    
    const nombre = req.body.nombre.toUpperCase();
    const CategoriaDB = await Categoria.findOne({ nombre });

    if (CategoriaDB) {
      return res.status(400).json({
        msg: `Ya existe la categoria : ${nombre}`,
      });
    }

    //Gerara la data
    const data = {
      nombre,
      usuario: req.usuario._id,
    };
    const categoria = new Categoria(data);
    categoria.save();


    res.status(201).json({
      categoria,
    });
  } catch (e) {
    
    res.status(500).json({
      msg: "Ocurrio un error! Contacta al administrador"
    })
  }

};


const obtenerCategoria = async (req, res = response) => {

  const id = req.params.id;

  const categoria = await Categoria.findById(id).populate('usuario', 'nombre');






  res.status(400).json({
    categoria

  })

}

const obtenerCategorias = async (req, res = response) => {
  try {

    const { limite = 5, desde = 0 } = await req.query
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
      await Categoria.countDocuments(query),
      await Categoria.find(query).populate('usuario', 'nombre').skip((parseInt(desde))).limit(parseInt(limite)),

    ])
    res.status(400).json({
      total, categorias
    })



  } catch (e) {
    console.log(e)
    res.status(500).json({
      msj: 'Ocurrio un error  comuniquese con el administrador '
    })
  }
}

const actualizarCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();

    const usuario = req.usuario;
    const data = {
      nombre,
      usuario
    }
    // SI NO SE AGREGA EL TERCER ARGUMENTO DEVUELVE LA CATEGORIA  ANTES DEL UPDATE


    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });




    res.json({
      status: true,
      msg: "CATEGORIA  ACTUALIZADA",
      categoria
    });
  } catch (e) {
    console.log(e)
    res.status(500).json({
      msj: 'Error! Comuniquese con el administrador'
    })
  }
}


const borrarCategoria = async  (req,res)=>{

  try{
    const id=req.params.id;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false});

    if(categoria.estado===false){
      return res.status(400).json({
        msj:'Error : La categoria no existe'
      })
    }
    res.status(201).json({
      msj:'Se elimino el siguiente registro',
      categoria,
      id
    })

  }catch(e){
    console.log(e)
    res.status(500).json({
      msj:'Ocurrio un error! Contacte con el administrador'
    })
  }
}


module.exports = {
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
  actualizarCategoria,
  borrarCategoria
};
