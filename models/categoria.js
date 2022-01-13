const { Schema, model } = require("mongoose");

const CategoriaSchema=Schema({
    nombre :{
        type: String,
        required: [true,'El nombre de la categoria es obligatorio'],
        unique:true
    },
    estado:{
        type: Boolean,
        default:true,
        required: [true,'El estado es obligatorio']
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: [true,'El usuario es requerido']
    }
})
CategoriaSchema.methods.toJSON = function () {
    const { __v, ...data } = this.toObject();
    return {
      ...data
        
    };
  };

module.exports=model('Categoria',CategoriaSchema);