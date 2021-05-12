/*IMPORTS*/
const Router = require("express");
const Vacunacion = require("./schemas/Vacunacion");
const fs = require('fs');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

/*VARIABLES A UTILIZAR*/
const app = Router();
let top = new Array;
let gen = new Array;
let ult = new Array;


/* Datos almacenados en la base de datos, en MongoDB */
/* Gráfica de pie de los géneros de los vacunados por país, en MongoDB. */
/* Los últimos cinco vacunados almacenados por país, en MongoDB */


app.get("/", async (req, res) => {
    console.log("GET")
    limpieza()
    Vacunacion.find()
        .then(result => {
            console.log(result)
            res.send(result);
        })
        .catch(err => {
            console.log(err)
            res.send(err);
        });
});

/*SERVICIOS FINALES*/
/* Datos almacenados en la base de datos, en MongoDB */
app.post("/find", async (req, res) => {
    console.log("FIND")
    limpieza()
    Vacunacion.find()
        .then(result => {
            console.log(result)
            res.send(result);
        })
        .catch(err => {
            console.log(err)
            res.send(err);
        });
});

/* Gráfica de pie de los géneros de los vacunados por país, en MongoDB */
app.post("/genero", async (req, res) => {
    console.log("GENERO")
    limpieza()
    Vacunacion.find()
        .then(result => {
            res.send(genero(result));
        })
        .catch(err => {
            console.log(err)
            res.send(err);
        });
});

/* Los últimos cinco vacunados almacenados por país, en MongoDB */
app.post("/ultimos", async (req, res) => {
    console.log("ULTIMOS")
    limpieza()
    Vacunacion.find()
        .then(result => {
            res.send(ultimos(result));
        })
        .catch(err => {
            console.log(err)
            res.send(err);
        });
});



/*METODOS VARIOS*/
function genero(result) {
    gen = new Array;

    for (let i of result) {
        agregarPais(i)
    }

    console.log(gen)
    return gen
}

function agregarPais(dato) {
    let exist = false;
    for (let i in gen) {
        if (gen[i][0] == dato.location) {
            if (dato.gender == 'male') {
                gen[i][1]++;
            } else {
                gen[i][2]++;
            }
            exist = true;
            break;
        }
    }

    if (!exist) {
        if (dato.gender == 'male') {
            gen.push([dato.location, 1, 0]);
        } else {
            gen.push([dato.location, 0, 1]);
        }
    }
}

function ultimos(result) {
    ult = new Array;

    for (let i of result) {
        agregarDato(i)
    }

    //console.log(ult)

    getUltimos();

    //console.log(top)
    return top
}

function agregarDato(dato) {
    let exist = false;
    for (let i in ult) {
        if (ult[i][0] == dato.location) {
            ult[i][1].push(dato)
            exist = true;
            break;
        }
    }

    if (!exist) {
        ult.push([dato.location, [dato]]);
    }

}

function getUltimos() {
    for (let i of ult) {
        let v = 5;
        let j = [];
        if(i[1] instanceof Array){
            j = i[1];
        }
        //console.log(j.length)
        for (let a = j.length; a > 0; a--) {
            if (v > 0) {
                //console.log(i[0])
                //console.log(i[1])
                //console.log(j[j.length-1])
                top.push(j.pop())
                v--;
            }else{
                break;
            }
        }
    }

}

function limpieza() {
    top = new Array;
    gen = new Array;
    ult = new Array;
}

module.exports = app;