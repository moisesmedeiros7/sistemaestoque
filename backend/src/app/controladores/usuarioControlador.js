const usuario = require ('../model/usuario.model');


module.exports = {

async editar (req, res){ //Editar usuário
  //validações
  const {nome, email, senha} = req.body;
   
  if(!nome || !email  || !senha)  //verificando se há campos vazios
  return res.status(400).send( {error:'nome, email e senha são campos obrigatórios.'} )
  /*
  if (await usuario.findOne( {email} ) ) //verficando se o email já está cadastrado
  return res.status(400).send( {error: 'Email já cadastrado!'} )
  */
  const usuario_bd = await usuario.findById(req.params.id);  //pegando o id do usuário da requisição
  
  if(req.userId !== (usuario_bd._id).toString())  // se id usuário logado = id usuario da requisição --objectId
  return res.status(401).send( {error: 'usuário não tem permissão de alterar outro usuário!'} );

  try {
    const id = req.params.id;
    const user = await usuario.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
},

 async excluir (req, res) {  // excluir usuário
  const usuario_bd = await usuario.findById(req.params.id);  //pegando o id do usuário da requisição
 
  if(req.userId !== (usuario_bd._id).toString())  // se id usuário logado = id usuario da requisição --objectId
  return res.status(401).send( {error: 'usuário não tem permissão de deletar outro usuário!'} );
  
  try {
    const id = req.params.id;

    const user = await usuario.findByIdAndRemove(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
},

async buscarTodos (req, res) {  //buscar todos os usuários
  try {
    const users = await usuario.find({});
    console.log(new Date())
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
},


 async buscarPorID (req, res) {  //buscar usuário por ID
  try {
    const id = req.params.id;

    const user = await usuario.findById(id);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).send(error.message);
  }
},


}
