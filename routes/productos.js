const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");

const { validarJWT, tieneRol } = require("../middlewares");
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require("../controller/producto");
const { existeCategoria, existeProducto } = require("../helpers/db-validaciones");
const { validarPrecioPositivo } = require("../helpers/validarPrecioPositivo");


const router = Router();


router.get("/", obtenerProductos);

//Obtener una producto por id - publico

router.get(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);

//Crear una producto - privado- cualquier persona con token valido

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").not().isEmpty(),

    check('precio').custom(validarPrecioPositivo),
    check("idCategoria", "El idCategoria es requerido").not().isEmpty(),
    check("idCategoria", "Error , el id categoria no es valido").isMongoId(),
    check("idCategoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);

// Actalizar una categoria - privado- cualquier persona con token valido

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeProducto),
    check('precio').custom(validarPrecioPositivo),

    validarCampos,
  ],
  actualizarProducto
);

// Eliminar  una categoria - privado- solo usuarios ADMIN_ROLE

router.delete("/:id",[
    validarJWT,
    tieneRol("ADMIN_ROLE"),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
], borrarProducto);

module.exports = router;
