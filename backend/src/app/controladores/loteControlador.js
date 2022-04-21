const lote = require ('../model/lote.model'); 
const products = require('../model/produto.model');

module.exports = {
    
    async criar (req, res) { // criar lote
      const { numero, quantidade, data_validade, produto } = req.body; //pegando nome, perecivel e quantidade
      // validações 
      if(!produto) // se o id de produto não for passado
      return res.status(400).send( {error:'Não é possível entrada sem referência (ID) do produto!'} );

      if(!numero  || !quantidade)  //verificando se há campos vazios
      return res.status(400).send( {error:'número e quantidade são campos obrigatórios.'} );
      
      if(quantidade<1) //se a quantidade for menor que 1
      return res.status(400).send( {error:'Impossível inserir quantidade menor que um.'} );
   
      const product_bd = await products.findById(produto);    //pegando o produto que o lote se referencia

      if ((product_bd.perecivel === true)  &&  (!data_validade)) // se PRODUTO for perecível e data_validade vazio 
      return res.status(400).send( {error:'Se o produto é perecível a data de validade é obrigatória.'} );

      req.body.data_entrada = new Date();// gerando data atual para data_entrada
      req.body.saldo = quantidade;
       
      try {
          const lote_db = await lote.create(req.body); //pegando requisição e mandando pro banco

          res.status(201).json(lote_db);
      } catch (error) {
          res.status(500).send(error.message);
      }
   },

    async editar (req, res){ //Editar lote
        try {
          const id = req.params.id;
          const lote_db = await lote.findByIdAndUpdate(id, req.body, { new: true });
      
          res.status(200).json(lote_db);
        } catch (error) {
          res.status(500).send(error.message);
        }
   },
      
   async excluir (req, res) {  // excluir lote
        try {
          const id = req.params.id;
      
          const lote_db = await lote.findByIdAndRemove(id);
      
          res.status(200).json(lote_db);
        } catch (error) {
          res.status(500).send(error.message);
        }
   },
      
   async buscarTodos (req, res) {  //buscar todos os lotes
      try {
        const lotes_db = await products.aggregate([ //Col A
          { $lookup: {
                 from: "lotes",  // Col B
                 localField: "_id",  // id Col A
                 foreignField: "produto",  // FK col B
                 as: "conj_lotes"
            }},
          //  { $unwind: "$conj_lotes" }, //desagrupando conj_lotes
            {$sort: {"nome": -1}} //ordenando por nome
        ]);
        
        res.status(200).json(lotes_db);
      } catch (error) {
          return res.status(500).send(error.message);
      }
    },
      
   async buscarPorID (req, res) {  //buscar lote por ID
      try {
        const id = req.params.id;
      
        const lote_db = await lote.findById(id);
      
        return res.status(200).json(lote_db);
      } catch (error) {
          return res.status(500).send(error.message);
     }
   },
      

}