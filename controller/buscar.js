const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Producto, Categoria } = require("../models");
const colecciones = ["usuarios", "productos", "categorias", "roles"];
const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;
  if (colecciones.includes(coleccion)) {
    switch (coleccion) {
      case "usuarios":
        buscarUsuario(termino, res);
        break;

      case "productos":
        buscarProducto(termino,res);
        break;
        case "categorias":
            buscarCategoria(termino,res);
            break;

      default:
        res.status(500).json({
          msj: "Error : estamos trabajando en esta busqueda....",
        });
    }
  } else {
    return res.status(400).json({
      msj: `Error: solo se permite las seguientes colecciones : ${colecciones}`,
    });
  }
};

const buscarUsuario = async (termino = "", res = response) => {
  const esMongoID = isValidObjectId(termino);
  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  return res.json({
    results: usuarios,
  });
};

const buscarProducto = async (termino = "", res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
      const producto = await Producto.findById(termino).populate('categoria','nombre');
      return res.json({
        results: producto ? [producto] : [],
      });
    }
  
    const regex = new RegExp(termino, "i");
    const producto = await Producto.find({
      $or: [{ nombre: regex }, { descripcion: regex }],
      $and: [{ disponible: true }],
    }).populate('categoria','nombre');
  
    return res.json({
      results: producto,
    });
  };

  const buscarCategoria = async (termino = "", res = response) => {
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
      const categoria = await Categoria.findById(termino);
      return res.json({
        results: categoria ? [categoria] : [],
      });
    }
  
    const regex = new RegExp(termino, "i");
    const categorias = await Categoria.find({
      $or: [{ nombre: regex }],
      $and: [{ estado: true }],
    });
  
    return res.json({
      results: categorias,
    });
  };

module.exports = { buscar };
