const express = require ("express");
const app = express(); 
const bodyParser = require ("body-parser");
const { urlencoded } = require("body-parser");
const cors = require ("cors")
app.use (cors());

const mongoose = require("mongoose");
const mongooseModel = require("./funcionario");

mongoose.connect("mongodb://localhost:27017/funcionario",{useNewUrlParser: true, useUnifiedTopology: true});

const MeuFuncionario = mongoose.model("funcionario",mongooseModel);



app.use (bodyParser.urlencoded({extended:false}));
app.use (bodyParser.json());

const jwt = require("jsonwebtoken");
const JWTSecret = "jjkjsjdssllldldsdsdjdksjkdsjhjhjhllhjls"



function auth(req,res,next){
    const authToken = req.headers['authorization']
    
    if(authToken != undefined){
    
        const bearer = authToken.split(' ');
        var token = bearer[1];
    
        jwt.verify(token,JWTSecret,(err, data) => {
            if(err){
                res.status(401);
                res.json({err:"Token inválido!"});
            }else{
    
                req.token = token;
                req.loggedUser = {id: data.id,email: data.email};               
                next();
            }
        });
    }else{
        res.status(401);
        res.json({err:"Token inválido!"});
    } 
    }



    app.get("/funcionario",auth,(req,res)=>{


        MeuFuncionario.find({}).then(MeuFunc => {
            res.statusCode = 200;
            res.json(MeuFunc);
        })
    })
    
    app.get("/funcionario/:id",auth,(req , res)=>{
    
        if(isNaN(req.params.id)){
            res.sendStatus(400)
        }else{
           var id = parseInt(req.params.id);
        
           var funcionario = funcionario.find(g =>g.id == id);
        
        
           if(funcionario !=undefined){
               res.json(funcionario);
           }else{
               res.sendStatus(404);
           }
        }
        });
    
       
    
    
        app.post("/funcionario",auth,(req,res)=>{
          
            var {nameDofuncionario,tipoDofuncionario,ageDofuncionario,skillDofuncionario} = req.body;
            const funcionarioParaInserir = new MeuFuncionario ({
            
                name: nameDofuncionario,    
                tipo: tipoDofuncionario,
                age: ageDofuncionario,
                skill: skillDofuncionario
            
            });
            
        funcionarioParaInserir.save();
        
        res.sendStatus(200);
        })
        
        app.delete("/funcionario/:idFunc",auth,(req,res)=>{
        
            MeuFuncionario.findByIdAndDelete(req.params.idFunc).then(MeuFunc=>{
                res.statusCode = 200;
                res.json("oky");
        
                console.log("Dado removido")
            }).catch(err =>{
                console.log(err)
            })

        });
        
        app.put("/funcionario/:id",auth,(req, res) => {
        
            var {nameDofuncionario,tipoDofuncionario,ageDofuncionario,skillDofuncionario} = req.body;

                MeuFuncionario.findByIdAndUpdate(req.params.id,{name: "willian ", tipo: "programador ", age: "30 ", skill: "fazer feijao " }).then(MeuFunc=>{
                    res.statusCode = 200;
                    res.json("oky");

                    console.log("iten atualizado")
                }).catch(err =>{
                    console.log(err)

                    res.statusCode = 500;
                    res.json("error");
                })

            
        
        });


        app.post("/auth",(req,res)=>{
            var {name, age, } = req.body;
    

            jwt.sign({id: 15, name: "maisa"},JWTSecret,{expiresIn:'48h'},(err, token) => {
                if(err){
                    res.status(400);
                    res.json({err:"Falha interna"});
                }else{
                    res.status(200);
                    res.json({token: token});
                }
            })

            
        })
    






app.listen(9091,()=>{
console.log ("api rodando");
});