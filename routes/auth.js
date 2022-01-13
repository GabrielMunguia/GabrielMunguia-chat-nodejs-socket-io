const {Router} = require("express");
const {check} = require('express-validator');
const {login, google, renovarToken} = require("../controller/auth");
const { validarJWT } = require("../middlewares/validar-JWT");
const {validarCampos} = require("../middlewares/validarCampos");
const router = Router();


router.post("/login", [
    check('correo', 'El correo es obligatorio!').isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    validarCampos
], login);


router.post("/google", [
    check('id_token', 'El id_token es obligatorio').notEmpty(),
    validarCampos
], google);



router.get("/",validarJWT, renovarToken);


module.exports = router;
