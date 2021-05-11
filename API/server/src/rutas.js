/*IMPORTS*/
const Router  = require("express");
const Vacunacion = require("./schemas/Vacunacion");
const fs = require('fs');

/*VARIABLES A UTILIZAR*/
const app = Router();
let top = new Array;
let gen = new Array;


/* Datos almacenados en la base de datos, en MongoDB */
/* Gráfica de pie de los géneros de los vacunados por país, en MongoDB. */
/* Los últimos cinco vacunados almacenados por país, en MongoDB */


/*SERVICIOS FINALES*/
/* Datos almacenados en la base de datos, en MongoDB */
app.post("/find", async (req, res) => {
    Vacunacion.find()
     .then(result => {
        res.send(result);
     })
     .catch(err => {
         console.log(err)
         res.send(err);
     });
});

/* Gráfica de pie de los géneros de los vacunados por país, en MongoDB */
app.post("/genero", async (req, res) => {
    Vacunacion.find()
     .then(result => {
        res.send(genero(result));
     })
     .catch(err => {
         console.log(err)
         res.send(err);
     });
});

/*REGIÓN MÁS INFECTADA*/
app.post("/region", async (req, res) => {
    Vacunacion.find()
     .then(result => {
        res.send(region(result));
     })
     .catch(err => {
         console.log(err)
         res.send(err);
     });
});

/*TOP 5 DEPARTAMENTOS INFECTADOS*/
app.post("/funnel", async (req, res) => {
    Vacunacion.find()
     .then(result => {
        res.send(top5Deptos(result));
     })
     .catch(err => {
         console.log(err)
         res.send(err);
     });
});

/*PORCENTAJE DE Vacunacion INFECTADOS POR STATE*/
app.post("/circular1", async (req, res) => {
    Vacunacion.find()
     .then(result => {
        res.send(infectados(result, "state"));
     })
     .catch(err => {
         console.log(err)
         res.send(err);
     });
});

/*PORCENTAJE DE Vacunacion INFECTADOS POR INFECTEDTYPE*/
app.post("/circular2", async (req, res) => {
    Vacunacion.find()
     .then(result => {
        res.send(infectados(result, "infectedtype"));
     })
     .catch(err => {
         console.log(err)
         res.send(err);
     });
});

/*ÚLTIMOS 5 Vacunacion REGISTRADOS*/
app.post("/ultimos", async (req, res) => {
    Vacunacion.find()
     .then(result => {
        res.send(ultimos(result));
     })
     .catch(err => {
         console.log(err)
         res.send(err);
     });
});

/*RANGO DE EDAD DE INFECTADOS*/
app.post("/edades", async (req, res) => {
    Vacunacion.find()
     .then(result => {
        res.send(edades(result));
     })
     .catch(err => {
         console.log(err);
         res.send(err);
     });
});

/*LECTURA DE MEMORIA RAM*/
app.post("/ram", async (req, res) => {
    fs.readFile("./lecturas/ram_proyecto1", 'utf-8', (err, data) => {
        //console.log(data);
        let d = JSON.parse(data);
        console.log(d);
        if(err) {
            console.log(err)
            res.send(err);
        } else {
            res.send(d)
        }
    });
});

/*LECTURA DE MEMORIA CPU*/
app.post("/cpu", async (req, res) => {
    fs.readFile("./lecturas/cpu_proyecto1", 'utf-8', (err, data) => {
        //console.log(data);
        let d = JSON.parse(data);
        console.log(d);
        if(err) {
            console.log(err)
            res.send(err);
        } else {
            res.send(d)
        }
    });
});

/*LECTURA DE MEMORIA RAM*/
app.post("/clean", async (req, res) => {
    Vacunacion.remove()
     .then(result => {
        res.send(result);
     })
     .catch(err => {
         console.log(err);
         res.send(err);
     });
});


/*METODOS VARIOS*/
function genero(result){
    gen = new Array;
    
    for(let i of result){
        agregarPais(i)
    }

    //console.log(gen)
    return gen
}

function agregarPais(dato){
    let exist = false;
    for(let i in gen){
        if(gen[i][0] == dato.location){
            if(dato.gender == 'male'){
                gen[i][1]++;
            }else{
                gen[i][2]++;
            }
            exist = true;
            break;
        }
    }

    if(!exist){
        if(dato.gender == 'male'){
            gen.push([dato.location, 1, 0]);
        }else{
            gen.push([dato.location, 0, 1]);
        }
    }
}





function getRegion(location){
    let loc = location.toLowerCase();
    if(loc == "quetzaltenango" || loc == "retalhuleu" || loc == "san marcos" || loc == "suchitepéquez" || loc == "sololá" || loc == "totonicapán"){
        return "Suroccidente"
    }else if(loc == "guatemala"){
        return "Metropolitana"
    }else if(loc == "huehuetenango" || loc == "quiché"){
        return "Noroccidente"
    }else if(loc == "chimaltenango" || loc == "sacatepéquez" || loc == "escuintla"){
        return "Central"
    }else if(loc == "alta verapaz" || loc == "baja verapaz"){
        return "Verapaz"
    }else if(loc == "chiquimula" || loc == "el progreso" || loc == "izabal" || loc == "zacapa"){
        return "Nororiente"
    }else if(loc == "jutiapa" || loc == "jalapa" || loc == "santa rosa"){
        return "Suroriente"
    }else if(loc == "petén"){
        return "Petén"
    }else{
        return location
    }
}

function region(result){
    top = new Array;
    
    for(let i of result){
        agregarTop(i)
    }

    for(var i=1;i<top.length;i++){
        for(var j=0; j<(top.length-i); j++){
            if(top[j][0] < top[j+1][0]){
                k = top[j+1][0];
                valor = top[j+1][1];
                
                top[j+1][0] = top[j][0];
                top[j+1][1] = top[j][1];
                
                top[j][0] = k;
                top[j][1] = valor;
            }
        }
    }

    let aux = new Array;
    for(var i=0; i < top.length; i++){
        if(i < 1){
            aux.push(top[i])
            break;
        }
    }

    //console.log(top)
    return aux
}

function top5Deptos(result){
    top = new Array;
    
    for(let i of result){
        agregarTop(i.location)
    }

    for(var i=1;i<top.length;i++){
        for(var j=0; j<(top.length-i); j++){
            if(top[j][0] < top[j+1][0]){
                k = top[j+1][0];
                valor = top[j+1][1];
                
                top[j+1][0] = top[j][0];
                top[j+1][1] = top[j][1];
                
                top[j][0] = k;
                top[j][1] = valor;
            }
        }
    }

    let aux = new Array;
    for(var i=0; i < top.length; i++){
        if(i < 5){
            aux.push(top[i])
        }
    }
    //top.prototype.sort()

    console.log(aux)
    return aux
}

function infectados(result, tipo){
    top = new Array;
    
    for(let i of result){
        if(tipo == "state"){
            agregarTop(i.state)
        }else if(tipo == "infectedtype"){
            agregarTop(i.infectedtype)
        }
    }

    for(var i=0; i < top.length; i++){
        top[i][0] = (top[i][0]/result.length)*100
    }

    return top
}

function agregarTop(dato){
    let exist = false;
    for(let i in top){
        if(top[i][1] == dato){
            top[i][0]++;
            exist = true;
            break;
        }
    }

    if(!exist){
        top.push([1, dato]);
    }
}



function ultimos(result){
    let aux = new Array;
    let j = 0;
    for(let i=result.length-1; i >= 0; i--){
        if(j < 5){
            j++;
            aux.push(result[i]);
        }
    }
    return aux;
}

function edades(result){
    let lista = [[0,10],[0,20],[0,30],[0,40],[0,50],[0,60],[0,70],[0,80],[0,90]]

    for(let i of result){
        if(i.age < 10){
            lista[0][0]++;
        }else if(i.age < 20){
            lista[1][0]++;
        }else if(i.age < 30){
            lista[2][0]++;
        }else if(i.age < 40){
            lista[3][0]++;
        }else if(i.age < 50){
            lista[4][0]++;
        }else if(i.age < 60){
            lista[5][0]++;
        }else if(i.age < 70){
            lista[6][0]++;
        }else if(i.age < 80){
            lista[7][0]++;
        }else{
            lista[8][0]++;
        }
    }

    return lista;
}

module.exports = app;