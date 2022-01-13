const { Router } = require("express");
const { check } = require("express-validator");
const { buscar } = require("../controller/buscar");

const router= Router();
router.get('/:coleccion/:termino',[
    check('coleccion','La coleccion es obligatoria').not().isEmpty(),
    check('termino','La termino es obligatoria').not().isEmpty(),
],buscar);

module.exports=router;