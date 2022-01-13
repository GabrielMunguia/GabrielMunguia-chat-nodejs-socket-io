const express = require("express");
const cors = require('cors');
const {dbConnection} = require("../database/config");
const fileUpload = require("express-fileupload");
const socketController = require("../socket/socket.controller");


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            usuarios: '/api/usuarios',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            auth: '/api/auth',
            productos: '/api/productos',
            uploads: '/api/uploads'
        }


        // Conectar a la base de datos
        this.connectarDB();

        // MIDDLEWARES

        this.middleware();
        // RUTAS
        this.routes();

        // SOCKET
        this.server = require('http').createServer(this.app);

        this.io = require('socket.io')(this.server);

        this.socket();


    }

    routes() {


        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))

    }

    middleware() { // Directorio publico
        this.app.use(express.static('public'))
        // CORS
        this.app.use(cors())
        // Lectura y parseo del body en JSON
        this.app.use(express.json())

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({useTempFiles: true, tempFileDir: '/tmp/', createParentPath: true}));
    }

    async connectarDB() {
        await dbConnection()
    }

    socket(){
      this.io.on('connection',(socket)=>{socketController(socket,this.io)});
    }

    listen() {
        this.server.listen(process.env.PORT, () => {
            console.log("localhost:", process.env.PORT);
        });
    }
}

module.exports = Server;
