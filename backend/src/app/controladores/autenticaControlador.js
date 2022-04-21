const usuario = require ('../model/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../../config/auth.json');

 // função para gerar token com jwt
function gerarToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {

async registrarUsuario (req, res) { // criar usuário
     
      const {nome, email, senha} = req.body;

      if(!nome || !email  || !senha)  //verificando campos vazios
      return res.status(400).send( {error:'nome, email e senha são campos obrigatórios.'} )
  
      if (await usuario.findOne( {email} ) )  //verficando se o email já está cadastrado
         return res.status(400).send( {error: 'Usuário já cadastrado!'} )
     
     try {
       user = await usuario.create(req.body); //pegando requisição e mandando pro banco
       user.senha = undefined; // impedindo da senha voltar ao front
   
       res.status(201).send ({
         user,
         token: gerarToken( {id:user.id} ) //passando token através da função
       } ); 
   
   
     } catch (error) {
       res.status(500).send(error.message);
     }
},

async autenticar (req, res) {  // Autenticar usuário
  const { email , senha } = req.body;
  
  if (!email || !senha)  //verificando se algum veio campo vazio
  return res.status(400).send( {error:'email e senha são campos obrigatórios.'} )

  const user = await usuario.findOne({email}).select('+senha'); //buscando usuário no banco
  
  if (!user) // se não existe usuário
    return res.status(400).send( {error:'Usuário inexistente!' });

  if (!await bcrypt.compare(senha, user.senha)) //se as senhas não batem
    return res.status(400).send( {error:'Senha inválida'} );

  user.senha = undefined; // impedindo da senha voltar ao front
  
  // se passou pelas validações, retorne o usuário e token   
  res.send ({
    user,
    token: gerarToken( {id:user.id} ) //passando através da função
    } ); 
},

  
async esqueciSenha (req, res){ // esqueci minha senha
    const { email } = req.body;  // pegando o email do body
  
    try {
      const user = await usuario.findOne( { email }); //buscando usuário com o email recebido
  
      if (!user) // se não existe usuário na busca
      return res.status(400).send( {error:'Usuário inexistente!' });
  
      const token = crypto.randomBytes(20).toString('hex');  // criar um token
      const now = new Date();  // pegar o tempo atual
  
      now.setHours(now.getHours()+1); //adicone 1h no tempo atual
      
      await usuario.findByIdAndUpdate(user.id, {   //setando o token e o tempo na base de dados
        '$set': {
          senhaResetToken: token,   
          senhaResetExpira: now,
        }
      });
  
      mailer.sendMail({
        to: email,
        from: 'naoresponda@estoque.com',
        template: 'auth/forgot_password',
        context: { token },
      }, (err) => {
        if(err) //se apresentar um erro ao enviar o email
          return res.status(400).send( { error: 'Não foi possível enviar o email' } ) 
    
          return res.status(200).send('Email enviado com sucesso!');
      });
    
    } catch (error) {
      res.status(400).send({ error: 'Erro na recuperação da senha. Tente novamente!' })
      console.log(error);
    }
  
}, 
  
async resetarSenha(req, res){
    const { email, token, senha } = req.body; //pegando as informações do body
  
    try {
      const user = await usuario.findOne( {email} ) //selecionando da bse de dados o usuário do email passado com info do token
      .select('+senhaResetToken senhaResetExpira');  
  
      if(!user) //se a seleção não encontrou usuário na busca
      return res.status(400).send( {error:'Usuário inexistente!' });
  
      if(token !== user.senhaResetToken ) //verificando token
      return res.status(400).send( {error:'Token inválido!' });
  
      const now = new Date();
      if (now > user.senhaResetExpira) // verificando se o token expirou
      return res.status(400).send( { error: 'O token expirou, gere outro!'} ); 
  
      user.senha = senha; //salvando a nova senha 
      await user.save();  // no bd
  
      return res.send('Senha alterada com sucesso!')
    } catch (error) {
      res.status(400).send( {error: 'Não foi posśivel resetar a senha, tente novamente'} );
    }
  
  
},

}