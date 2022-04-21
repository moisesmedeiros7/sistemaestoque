const cliente = require('../model/cliente.model'); 


module.exports = {
    
    async criar (req, res) { // criar cliente
      const { nome } = req.body; //pegando nome 
      
      if(!nome)  //verificando se há campos vazios
      return res.status(400).send( {error:'Nome é campo obrigatório.'} )
      
      if (await cliente.findOne( {nome: nome} ) )  //verficando se tem cliente cadastrado com mesmo nome
          return res.status(400).send( {error: 'cliente já cadastrado!'} );
      
      try {
          const client = await cliente.create(req.body); //pegando requisição e mandando pro banco

          res.status(201).json(client);
      } catch (error) {
          res.status(500).send(error.message);
      }
   },

    async editar (req, res){ //Editar cliente
      const { nome } = req.body; //pegando nome, unidade e fabricante 
      
      if(!nome)  //verificando se há campos vazios
      return res.status(400).send( {error:'nome é campo obrigatório.'} );

      try {
          const id = req.params.id;
          const client = await cliente.findByIdAndUpdate(id, req.body, { new: true });
      
          res.status(200).json(client);
      } catch (error) {
          res.status(500).send(error.message);
      }
      
   },
      
    async excluir (req, res) {  // excluir cliente
        try {
          const id = req.params.id;
    
          const client = await cliente.findByIdAndRemove(id);
      
          res.status(200).json(client);
        } catch (error) {
          res.status(500).send(error.message);
        }
   },
      
    async buscarTodos (req, res) {  //buscar todos os clientes
        try {
          const clients = await cliente.find({});
        
          res.status(200).json(clients);
        } catch (error) {
          return res.status(500).send(error.message);
        }
   },
         
    async buscarPorID (req, res) {  //buscar cliente por ID
        try {
          const id = req.params.id;
          const client = await cliente.findById(id);
      
          return res.status(200).json(client);
        } catch (error) {
          return res.status(500).send(error.message);
        }
   },

   async buscarPornome(req, res) {  //buscar cliente por nome
    try {
      //const nome = req.body.nome;
  
      const client = await cliente.find(  {nome: RegExp(req.body.nome, 'i')}  );
  

      return res.status(200).json(client);
    } catch (error) {
      return res.status(500).send(error.message);
    }
},
      

}