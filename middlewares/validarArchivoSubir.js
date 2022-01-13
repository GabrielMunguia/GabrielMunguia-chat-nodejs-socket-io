
const { response } = require("express");

//valida que se mande el archivo

const validarArchivoSubir=(req,res=response,next)=>{
    if (!req.files || Object.keys(req.files).length === 0 ||!req.files.archivo) {
        
        return res.status(400).json({
            msj:'No se subio ningun archivo.'
        });
      }
      next();
}

module.exports = {validarArchivoSubir}
