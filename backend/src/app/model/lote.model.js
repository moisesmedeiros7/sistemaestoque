const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
  numero:{
    type: String,
    required: true,
  },
  data_validade:{
    type: Date,
    required: false,
  },
  data_entrada:{
    type: Date,
    required: true,
  },
   quantidade:{  //valor da entrada
    type: Number,
    required: true,
  },
  saldo:{  // valor de entrada menos saídas
    type: Number,
    required: true,
  },
   produto:{ // ID do produto que o lote se referencia
    type: mongoose.Schema.Types.ObjectId,
    required: true,
   },
   data_alteracao:{ // Data da última alteração
    type: Date,
    required: false,
    select: false,
  },
   usuario_alter:{  // ID do Usuário ADM que alterou a última vez
   type: mongoose.Schema.Types.ObjectId,
   required: false,
   select: false,
  },

});

const lote = mongoose.model("Lote", userSchema);

module.exports = lote;