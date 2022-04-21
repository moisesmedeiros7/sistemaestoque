const produto = require('../model/produto.model'); 
const lote = require('../model/lote.model');

module.exports = {
    
    async criar (req, res) { // criar produto
      const { nome, unidade, fabricante } = req.body; //pegando nome, unidade e fabricante 
      
      if(!nome || !unidade  || !fabricante)  //verificando se há campos vazios
      return res.status(400).send( {error:'nome, unidade e fabricante são campos obrigatórios.'} )
      
      if (await produto.findOne( {nome , unidade,fabricante} ) )  //verficando se tem produto cadastrado com mesmo nome, unidade e fabricante
          return res.status(400).send( {error: 'Produto já cadastrado!'} );
      
      try {
          const product = await produto.create( {...req.body,  usuario_criacao: req.userId} ); //pegando requisição e mandando pro banco

          res.status(201).json(product);
      } catch (error) {
          res.status(500).send(error.message);
      }
   },

    async editar (req, res){ //Editar produto
      const { nome, unidade, fabricante } = req.body; //pegando nome, unidade e fabricante 
      
      if(!nome || !unidade  || !fabricante)  //verificando se há campos vazios
      return res.status(400).send( {error:'nome, unidade e fabricante são campos obrigatórios.'} )
       
      // verificar se existe lote cadastrado para o produto, caso exista NÃO EDITA PRODUTO
      const lote_bd = await lote.find( {id:"produto"}  );
      if (lote_bd.length !== 0)
      return res.status(400).send("Não é possivel Editar Produto com entradas/lotes cadastrad@s!")


        try {
          const id = req.params.id;
          const product = await produto.findByIdAndUpdate(id, req.body, { new: true });
      
          res.status(200).json(product);
        } catch (error) {
          res.status(500).send(error.message);
        }
      
   },
      
    async excluir (req, res) {  // excluir produto
        try {
          const id = req.params.id;
      
          // verificar se existe lote cadastrado para o produto, caso exista NÃO EXCLUA PRODUTO
          const lote_bd = await lote.find( {"produto":id}  );
          if (lote_bd.length !== 0)
          return res.status(400).send("Não é possivel excluir Produto com entradas/lotes cadastrad@s!")

          const product = await produto.findByIdAndRemove(id);
      
          res.status(200).json(product);
        } catch (error) {
          res.status(500).send(error.message);
        }
   },
      
    async buscarTodos (req, res) {  //buscar todos os produtos
        try {
          const products = await produto.find({});
        
          res.status(200).json(products);
        } catch (error) {
          return res.status(500).send(error.message);
        }
   },
         
    async buscarPorID (req, res) {  //buscar produto por ID
        try {
          const id = req.params.id;
          const product = await produto.findById(id);
      
          return res.status(200).json(product);
        } catch (error) {
          return res.status(500).send(error.message);
        }
   },

   async buscarPornome(req, res) {  //buscar produto por ID
    try {
      //const nome = req.body.nome;
  
      const product = await produto.find(  {nome: RegExp(req.body.nome, 'i')}  );
  

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).send(error.message);
    }
},
      

}