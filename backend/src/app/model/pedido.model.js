const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
  numero:{  //gerar no backend
    type: String,
    required: true,
  },
  quantidade:{
    type: Number,
    required: true,
  },
  data_pedido:{  //gerar no backend
    type: Date,
    required: true,
  },
  
  usuario_pedido:{  // ID do Usuário que cadastrou
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  lote_pedido:{  // ID do Lote despachado
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lote',
    required: true,
  },

  cliente_pedido:{  // ID do Cliente destino
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },

});

const pedido = mongoose.model("Pedido", userSchema);

module.exports = pedido;