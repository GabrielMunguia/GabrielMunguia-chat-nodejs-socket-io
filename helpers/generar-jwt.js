const jwt = require('jsonwebtoken')
const {Usuario} = require('../models')
const generarJWT = (uid = "") => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid
        };
        jwt.sign(payload, process.env.SECRETOKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('no se pudo crear el token')
            }
            resolve(token)
        })

    })

}

const validacionJWT = async (token) => {
    try {
        const infoToken = jwt.verify(token, process.env.SECRETOKEY);
        if (! infoToken) {
            return null;
        }
        const {uid} = infoToken;
        const usuario =await  Usuario.findById(uid);
        if (usuario) {
            console.log(usuario.estado)
            if (usuario.estado ==true) {
                return usuario;
            }else{
                return null;
            }
           
        } else {
            return null;
        }


    } catch (error) {
        return null;
    }

}

module.exports = {
    generarJWT,
    validacionJWT
}
