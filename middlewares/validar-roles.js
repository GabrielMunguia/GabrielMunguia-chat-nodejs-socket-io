const { response } = require("express");

const validarRol = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msj: "Se quiere validar el rol , sin antes haber validado el token",
    });
  }
  const { rol, nombre } = req.usuario;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msj: `El usuario : ${nombre} no es admin`,
    });
  }
  next();
};

const tieneRol = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msj: "Se quiere validar el rol , sin antes haber validado el token",
      });
    }

    const usuario=req.usuario;
  
    if(!roles.includes(usuario.rol)){
        return res.status(401).json({
            msj:`El usuario no tiene permisos , necesita alguno de estos roles para por realizar la accion " ${roles} "`
        })
    }

    next();

  };
};

module.exports = {
  validarRol,
  tieneRol,
};
