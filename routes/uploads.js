const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require("../controller/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validaciones");
const { validarCampos } = require("../middlewares");
const { validarArchivoSubir } = require("../middlewares/validarArchivoSubir");
const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "Error el id debe de ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
);

router.get(
    "/:coleccion/:id",
    [
     
      check("id", "Error el id debe de ser de mongo").isMongoId(),
      check("coleccion").custom((c) =>
        coleccionesPermitidas(c, ["usuarios", "productos"])
      ),
      validarCampos,
    ],
    mostrarImagen
  );

module.exports = router;
