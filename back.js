var express = require("express");
var app = express();

app.set("view engine", "hbs");
app.use(express.static(__dirname));

app.get("/", function(req, res){
    res.render("index.hbs");
});

app.listen(3000);