const express = require('express');
const autControlador = require('./src/app/controladores/autenticaControlador');
const usuarioControlador = require('./src/app/controladores/usuarioControlador'); // Importando o controlador de usuário
const produtoControlador = require('./src/app/controladores/produtoControlador');
const loteControlador = require('./src/app/controladores/loteControlador');
const clienteControlador = require ('./src/app/controladores/clienteControlador');
const pedidoControlador = require ( './src/app/controladores/pedidoControlador');
const authMiddleware = require('./src/app/middlewares/auth');

const routes = express.Router();

//rotas do controlador de autenticação
routes.post('/registro', autControlador.registrarUsuario); // chama o método criar usuário
routes.post('/login', autControlador.autenticar);  // login autenticar   
routes.post('/esquecisenha', autControlador.esqueciSenha); //rotas para recuperação de senha
routes.post('/resetarsenha', autControlador.resetarSenha);

//rotas do controlador de usuário
routes.get('/users', authMiddleware, usuarioControlador.buscarTodos); // chama o método listar todos usuários
routes.put('/users/:id', authMiddleware, usuarioControlador.editar) ; // chama o método editar usuário
routes.delete('/users/:id', authMiddleware, usuarioControlador.excluir); // chama o método editar usuário
routes.get('/users/:id', authMiddleware, usuarioControlador.buscarPorID);  // buscar pessoa por ID

//rotas do controlador de produto
routes.post('/products', authMiddleware, produtoControlador.criar); // chama o método criar produto
routes.get('/products', authMiddleware, produtoControlador.buscarTodos); // chama o método listar todos usuários
routes.patch('/products/:id', authMiddleware, produtoControlador.editar); // chama o método editar usuário
routes.delete('/products/:id', authMiddleware, produtoControlador.excluir); // chama o método editar usuário
routes.get('/products/:id', authMiddleware, produtoControlador.buscarPorID);  // buscar pessoa por ID
routes.get('/products_nome', authMiddleware, produtoControlador.buscarPornome);  // buscar pessoa por ID

//rotas do controlador de lote
routes.post('/lote', authMiddleware, loteControlador.criar); // chama o método criar produto
routes.get('/lotes', authMiddleware, loteControlador.buscarTodos); // chama o método listar todos usuários
routes.patch('/lote/:id', authMiddleware, loteControlador.editar); // chama o método editar usuário
routes.delete('/lote/:id', authMiddleware, loteControlador.excluir); // chama o método editar usuário
routes.get('/lote/:id', authMiddleware, loteControlador.buscarPorID);  // buscar pessoa por ID

//rotas do controlador de cliente
routes.post('/clients', authMiddleware, clienteControlador.criar); // chama o método criar cliente
routes.get('/clients', authMiddleware, clienteControlador.buscarTodos); // chama o método listar todos clientes
routes.patch('/clients/:id', authMiddleware, clienteControlador.editar); // chama o método editar cliente
routes.delete('/clients/:id', authMiddleware, clienteControlador.excluir); // chama o método editar cliente
routes.get('/clients/:id', authMiddleware, clienteControlador.buscarPorID);  // buscar cliente por ID
routes.get('/clients_nome', authMiddleware, clienteControlador.buscarPornome);  // buscar cliente por ID

//rotas do controlador de pedido
routes.post('/pedido', authMiddleware, pedidoControlador.criar); // chama o método criar pedido
routes.get('/pedidos', authMiddleware, pedidoControlador.buscarTodos); // chama o método listar todos pedidos
routes.patch('/pedido/:id', authMiddleware, pedidoControlador.editar); // chama o método editar pedido
routes.delete('/pedidos/:id', authMiddleware, pedidoControlador.excluir); // chama o método editar pedido
routes.get('/pedidos/:id', authMiddleware, pedidoControlador.buscarPorID);  // buscar pedido por ID
routes.get('/pedidos_numero', authMiddleware, pedidoControlador.buscarPorNumero);  // buscar pedido por numero

module.exports = routes;