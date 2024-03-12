import app from "./app";

try{
    app.listen(process.env.PORT)
}catch(error){
    console.log("Erro ao inicializar servidor. Erro: " + error)
};

