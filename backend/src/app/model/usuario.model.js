const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    
  nome:{
    type: String,
    required: true,
  },
  sobrenome: {
    type: String,
    required: false,
  },
  matricula: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true, // email único para cada usuário
    required: true,
    lowercase: true, // tudo minúsculo
  },
  
  admin: {
    type: Boolean,
    default: false,
  },
  
  senha: {
    type: String,
    required: true,
    minlength: 6,
    select: false, //não trazer nas buscas
  },

  senhaResetToken:{
    type: String,
    select: false,
  },
  senhaResetExpira:{
    type: Date,
    select: false,
  },
  
  criacao: {
    type: Date,
    default: Date.now,
  },

});
  

userSchema.pre('save', async function(next){  // função para encryptar senha antes de salvar
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});  


const usuario = mongoose.model("User", userSchema);

module.exports = usuario;