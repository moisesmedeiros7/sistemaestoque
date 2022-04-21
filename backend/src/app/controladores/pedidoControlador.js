const pedido = require('../model/pedido.model');
const lote = require('../model/lote.model');
const cliente = require ('../model/cliente.model');
const usuario = require ('../model/usuario.model');

module.exports = {
    
    async criar (req, res) { // criar pedido
      const { quantidade, lote_pedido, cliente_pedido } = req.body; //pegando quantidade, lote e cliente 
      
      if(!quantidade || !lote_pedido  || !cliente_pedido)  //verificando se há campos vazios
      return res.status(400).send( {error:'quantidade, lote e cliente são obrigatórios.'} );

      if ( quantidade < 1) // verificando se quantidade do pedido é menor que 1
      return res.status(400).send( {error:'quantidade não pode ser menor que 1.'} ); 
      
      const lote_bd = await lote.findById(lote_pedido); //buscando lote no banco
      const cliente_bd = await cliente.findById(cliente_pedido); //buscando cliente no banco
      
      if(!lote_bd) //Se o Lote não consta no Banco de Dados
      return res.status(400).send( {error:'Lote (ID) inválido.'} ); 

      if(!cliente_bd) //Se o Cliente não consta no Banco de Dados
      return res.status(400).send( {error:'Cliente (ID) inválido.'} );

      if ( quantidade > lote_bd.saldo) // verificando se quantidade solicitada é maior que saldo em estoque
      return res.status(400).send( {error:'A quantidade solicitada é maior que a quantidade disponível.'} ); 

      req.body.numero = (Math.floor(Date.now() * Math.random()).toString(36)).toString(); //gerando um id aleatório
      req.body.data_pedido = new Date();  // gerando data do pedido

      try {

          const pedido_bd = await pedido.create( {...req.body,  usuario_pedido: req.userId} ); //pegando requisição e mandando pro banco
          lote_bd.saldo = lote_bd.saldo - quantidade;  //atualizando a saldo do lote
          await lote.findByIdAndUpdate (lote_pedido, lote_bd, { new: true }); //atualizando a qtde no bd


          res.status(201).json(pedido_bd);
      } catch (error) {
          res.status(500).send(error.message);
      }
      
      

   },

    async editar (req, res){ //Editar produto
      const { quantidade, lote_pedido, cliente_pedido } = req.body; //pegando nome, unidade e fabricante 
      const id = req.params.id;

      if(!quantidade || !lote_pedido  || !cliente_pedido)  //verificando se há campos vazios
      return res.status(400).send( {error:'quantidade, lote e cliente são obrigatórios.'} );

      if ( quantidade < 1) // verificando se quantidade do pedido é menor que 1
      return res.status(400).send( {error:'quantidade não pode ser menor que 1.'} ); 
      
      const lote_bd = await lote.findById(lote_pedido); //buscando lote no banco
      const cliente_bd = await cliente.findById(cliente_pedido); //buscando cliente no banco
      const pedido_bd = await pedido.findById(id); //pegando o pedido no banco de dados
      
      if(!lote_bd) //Se o Lote não consta no Banco de Dados
      return res.status(400).send( {error:'Lote (ID) inválido.'} ); 

      if(!cliente_bd) //Se o Cliente não consta no Banco de Dados
      return res.status(400).send( {error:'Cliente (ID) inválido.'} );
      
      if(!pedido_bd) //Se o Pedido não consta no Banco de Dados
      return res.status(400).send( {error:'Pedido (ID) inválido.'} );
       
      var saldo = lote_bd.saldo + pedido_bd.quantidade; //desfazendo o saldo do pedido anterior
      saldo = saldo - quantidade; // fazendo o novo saldo do pedido

      if (saldo < 0) // verificando se saldo ficaria menor que 0
      return res.status(400).send( {error:'Não é possível ter saldo de Lote menor que 0.'} ); 

      lote_bd.saldo = saldo;
      
        try {
          
          const lote_at =  await lote.findByIdAndUpdate(lote_bd.id , lote_bd); //atualizando lote em BD
          const pedido_at = await pedido.findByIdAndUpdate(id, req.body, { new: true }); //atualizar pedido no banco
      
          res.status(200).json(pedido_at);
        } catch (error) {
          res.status(500).send(error.message);
        }
      
   },
      
    async excluir (req, res) {  // excluir produto
        
          const id = req.params.id;
          /*  // opção de colocar permissão
          const usuario_bd = await usuario.findById(req.userId);
          if (usuario_bd.admin === false)
          return res.status(203).send("Você não tem permissão para excluir pedido!")
          */
          const pedido_bd = await pedido.findById(id); //buscando pedido no banco
          if(!pedido_bd) //Se o Pedido não consta no Banco de Dados
          return res.status(400).send( {error:'Pedido (ID) inválido.'} );

          const lote_bd = await lote.findById(pedido_bd.lote_pedido); //buscando lote no banco
          var saldo = lote_bd.saldo + pedido_bd.quantidade; //desfazendo o saldo do pedido 
          lote_bd.saldo = saldo;  
      
      try {
          const lote_at =  await lote.findByIdAndUpdate(lote_bd.id , lote_bd); //atualizando lote em BD
          const pedido_at = await pedido.findByIdAndRemove(id); //removendo o pedido
      
          res.status(200).json(pedido_bd);
        } catch (error) {
          res.status(500).send(error.message);
        }
   },
      
    async buscarTodos (req, res) {  //buscar todos os produtos
        try {
          const pedidos = await pedido.find({});
        
          res.status(200).json(pedidos);
        } catch (error) {
          return res.status(500).send(error.message);
        }
   },
         
    async buscarPorID (req, res) {  //buscar produto por ID
        try {
          const id = req.params.id;
          const pedido = await pedido.findById(id);
      
          return res.status(200).json(pedido);
        } catch (error) {
          return res.status(500).send(error.message);
        }
   },

   async buscarPorNumero(req, res) {  //buscar produto por ID
    try {
      const pedido_bd = await pedido.find(  {nome: RegExp(req.body.numero, 'i')}  );
  
      return res.status(200).json(pedido);
    } catch (error) {
      return res.status(500).send(error.message);
    }
},
      

}