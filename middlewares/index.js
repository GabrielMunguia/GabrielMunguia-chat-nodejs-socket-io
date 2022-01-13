const  validarJWT  = require('./validar-JWT');
const  validarRol= require('./validar-roles');
const  validarCampos = require('./validarCampos');

module.exports={
    ...validarRol,
    ...validarJWT,
    ...validarCampos
}