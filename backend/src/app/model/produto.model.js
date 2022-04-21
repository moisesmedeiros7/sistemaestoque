const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
  nome:{
    type: String,
    required: true,
  },
  fabricante:{
    type: String,
    required: false,
  },
  unidade:{
    type: String,
    required: true,
  },
  categoria:{
    type: String,
    required: false,
  },
  descricao:{
    type: String,
    required: false,
  },
  perecivel:{
    type: Boolean,
    required: true,
  },
  licitavel:{
    type: Boolean,
    required: false,
  },
  dataVencLic:{
    type: Date,
    required: false,
  },
  usuario_criacao:{  // ID do Usuário que cadastrou
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
   },

});

const produto = mongoose.model("Product", userSchema);

module.exports = produto;