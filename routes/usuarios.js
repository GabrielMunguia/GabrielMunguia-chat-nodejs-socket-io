const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosDAOGet,
  usuariosDAOPut,
  usuariosDAOPost,
  usuariosDAODelete,
} = require("../controller/usuariosDAO");
const {
  esRolValido,
  emailExiste,
  usuarioExiste,
} = require("../helpers/db-validaciones");


const {
  validarJWT,
  validarRol,
  tieneRol,
  validarCampos,
} = require("../middlewares");
const router = Router();

router.get("/", usuariosDAOGet);

router.put(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    check("rol").custom(esRolValido),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password tiene que ser minimo de 6 caracteres"
    ).isLength({ min: 6 }),
    check("correo", "NO es un correo valido").isEmail(),

    validarCampos,
  ],
  usuariosDAOPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password tiene que ser minimo de 6 caracteres"
    ).isLength({ min: 6 }),
    check("correo", "NO es un correo valido").isEmail(),
    check("correo").custom(emailExiste),
    // check('rol','ROl no es valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosDAOPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // validarRol,
    tieneRol("ADMIN_ROLE", "SUPER_ADMIN_ROLE"),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos,
  ],
  usuariosDAODelete
);

module.exports = router;
