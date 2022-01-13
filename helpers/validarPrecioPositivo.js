const { response } = require("express");

const validarPrecioPositivo=(precio)=>{
   

    if (!precio) {
     return true;
      }else if(!isNaN(precio)){
        if(precio<0){
        
            throw new Error('El precio tiene que ser positivo o cero');
           
        }
        return true;
    }else{
        throw new Error('El precio tiene que ser un numero');
    }
  
  


}

module.exports = {validarPrecioPositivo}