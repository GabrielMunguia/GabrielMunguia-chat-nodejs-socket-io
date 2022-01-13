const bcrypt = require("bcryptjs");
const { response, request } = require("express");

const Usuario = require("../models/usuario");
//la importacion de response se hace solo para tener el autocompletado, en typescript es inecesario
const usuariosDAOGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = await req.query;
  const query = { estado: true };

  //   const usuarios = await Usuario.find(query).skip((parseInt(desde))) .limit(parseInt(limite));
  //  const total= await Usuario.countDocuments(query);

  const [total, usuarios] = await Promise.all([
    await Usuario.countDocuments(query),
    await Usuario.find(query).skip(parseInt(desde)).limit(parseInt(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosDAOPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contra
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  //Guardar en base de datos

  await usuario.save();

  res.json({
    status: true,
    msg: "POST CON EXITO",
    usuario,
  });
};
const usuariosDAOPut = async (req, res) => {
  const id = req.params.id;

  const { __id, google, password, correo, ...resto } = req.body;

  if (password) {
    //Encriptar la contra
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  // SI NO SE AGREGA EL TERCER ARGUMENTO DEVUELVE EL USUARIO  ANTES DEL UPDATE

  const usr = await Usuario.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    status: true,
    msg: "USUARIO ACTUALIZADO",
    usr,
  });
};
const usuariosDAODelete = async (req, res) => {
  const id = req.params.id;

  // Elimina fisicamente pero no es recomendable por que se pierden las relaciones
  //  const usr =await Usuario.findByIdAndDelete(id);
  const usr = await Usuario.findByIdAndUpdate(id, { estado: false });

  const usuarioAuth = req.usuario;

  res.json({
    usr,
    //  usuarioAuth
  });
};

module.exports = {
  usuariosDAOGet,
  usuariosDAODelete,
  usuariosDAOPost,
  usuariosDAOPut,
};
