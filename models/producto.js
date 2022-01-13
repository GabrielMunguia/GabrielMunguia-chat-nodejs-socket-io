const {Schema,model}= require('mongoose')

const productoSchema=Schema({
nombre :{
    type:String,
    required:[true,'El nombre es requerido'],
    unique:true,
}
,
estado :{
    type:Boolean,
    default:true,
    required:true,
},
usuario:{
    type:Schema.Types.ObjectID,
    ref:'Usuario',
    required:[true,'El usuario es obligatorio'],
},
precio:{
    type:Number,
    default:0,
},
categoria:{
    type:Schema.Types.ObjectID,
    ref:'Categoria',
    required:[true,'La categoria es obligatoria'],

},
descripcion :{type:String},
disponible :{type:Boolean,default:true},
img:{type:String}

});

productoSchema.methods.toJSON=function(){
    const {__v,estado,...data}= this.toObject();
    return data;
}

module.exports=model('Producto',productoSchema);