const { response } = require("express");
const { Producto,Categoria } = require("../models");


const crearProducto = async (req, res = response) => {
  try {

    const nombre = req.body.nombre.toUpperCase();

    const usuario = req.usuario;

    const precio = req.body.precio;

    const categoria=await Categoria.findById(req.body.idCategoria);
    const productoDB = await Producto.findOne({ nombre });
    const descripcion= req.body.descripcion ||'';
    const img=req.body.img||'';
    if (productoDB) {
      return res.status(400).json({
        msg: `Ya existe el producto : ${nombre}`,
      });
    }

    //Gerara la data
    const data = {
     nombre,
      usuario: usuario._id,
      precio,
      categoria:categoria,
      descripcion,
      img
    };
    const producto = new Producto(data);
   await  producto.save();


    res.status(201).json({
      producto,
    });
  } catch (e) {
      console.clear();
      console.log(e)
    res.status(500).json({
      msg: "Ocurrio un error! Contacta al administrador"
    })
  }

};


const obtenerProducto = async (req, res = response) => {

 try {
  const id = req.params.id;

  const categoria = await Producto.findById(id).populate('usuario', 'nombre');

  res.status(400).json({
    categoria

  })
 } catch (error) {
  res.status(500).json({
    msg: "Ocurrio un error! Contacta al administrador"

  })
 }

}

const obtenerProductos = async (req, res = response) => {
  try {

    const { limite = 5, desde = 0 } = await req.query
    const query = { disponible: true }

    const [total, productos] = await Promise.all([
      await Producto.countDocuments(query),
      await Producto.find(query).populate('usuario', 'nombre').skip((parseInt(desde))).limit(parseInt(limite)),

    ])
    res.status(400).json({
      total, productos
    })



  } catch (e) {
    console.log(e)
    res.status(500).json({
      msj: 'Ocurrio un error  comuniquese con el administrador '
    })
  }
}
const actualizarProducto = async( req, res = response ) => {

  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if( data.nombre ) {
      data.nombre  = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json( producto );

}


const borrarProducto = async  (req,res)=>{

  try{
    const id=req.params.id;
    const producto = await Producto.findByIdAndUpdate(id, {disponible:false});

    if(producto.disponible===false){
      return res.status(400).json({
        msj:'Error : El producto no existe'
      })
    }
    res.status(201).json({
      msj:'Se elimino el siguiente registro',
      producto,
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
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
};
