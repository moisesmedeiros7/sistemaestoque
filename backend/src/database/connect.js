const bd = require('../../config/bd.json');
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(
    `mongodb+srv://${bd.usuario}:${bd.senha}@${bd.url}`,
    (error) => {
        if (error) {
          return console.log("Ocorreu um erro ao se conectar-se ao MongoDB: ", error);
        }
        return console.log("Conexão ao MongoDB realizada com sucesso!");
        }
    );
};
  
module.exports = connectToDatabase;
