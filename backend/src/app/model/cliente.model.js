const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
  nome:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: false,
  },
  descricao:{
    type: String,
    required: false,
  },
  endereco:{
    type: String,
    required: false,
  },
  
});

const cliente = mongoose.model("Client", userSchema);

module.exports = cliente;