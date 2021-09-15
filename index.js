//Curso formação node.js - vitor lima (guia do programador)

//Imports
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const connection = require("./database/database");

const Pergunta = require('./database/Pergunta'); // model de perguntas
const Resposta = require('./database/Resposta'); // model de Resposta


//database
connection
    .authenticate()
    .then(() => {
        console.log("Conectado ao DB com sucesso.")
    })
    .catch((msgErro) => {
        console.log("Errouuuu!!!")
    })


//View engine: EJS
app.set("view engine", "ejs"),
    app.use(express.static("public"))


// BodyParser - verifiar isso.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// Rotas

app.get("/", (req, res) => {
    Pergunta.findAll({
        raw: true,
        order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
});


app.get("/perguntar", (req, res) => {
    res.render("perguntar.ejs");
});


app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

// rota que define a pagina das perguntas.
app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {
            id: id
        }
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: {
                    perguntaId: pergunta.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            res.redirect("/");
        }
    });
});


app.post("/responder/", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });

});


app.listen(8038, () => {
    console.log("App rodando!");
});