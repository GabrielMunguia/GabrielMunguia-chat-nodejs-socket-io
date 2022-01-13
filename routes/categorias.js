const { Router } = require("express");
const { check } = require("express-validator");
const { login, google } = require("../controller/auth");
const { validarCampos } = require("../middlewares/validarCampos");
const {
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
  actualizarCategoria,
  borrarCategoria,
} = require("../controller/categoria");
const { validarJWT, tieneRol } = require("../middlewares");
const { existeCategoria, existeCategoriaNombre } = require("../helpers/db-validaciones");
const router = Router();

//Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

//Obtener una categoria por id - publico

router.get(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);

//Crear una categoria - privado- cualquier persona con token valido

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actalizar una categoria - privado- cualquier persona con token valido

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeCategoria),
    check("nombre", "El nombre es requerido").not().isEmpty(),
    check("nombre").custom(existeCategoriaNombre),
    validarCampos,
  ],
  actualizarCategoria
);

//Eliminar  una categoria - privado- solo usuarios ADMIN_ROLE
router.delete("/:id",[
    validarJWT,
    tieneRol("ADMIN_ROLE"),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
], borrarCategoria);

module.exports = router;
