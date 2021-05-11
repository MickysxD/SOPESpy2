let mongoose = require("mongoose")
var Schema = mongoose.Schema;

/* localhost = mongo*/
/* 104.197.236.53 */
let host = "104.197.236.53";
/*CONEXION A MONGODB*/
mongoose.connect(`mongodb://${host}:27017/proyecto2`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log("Conectado a db"))
    .catch(err => console.log(err));

var Model = new Schema({
    name: String,
    location: String,
    gender: String,
    age: Number,
    vaccine_type: String,
    path: String
});

let Vacunacion = mongoose.model('vacunacion', Model)

module.exports = Vacunacion;
