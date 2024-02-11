//using MariaDB fork of MySQL. It ties in very easily.

var mysql = require('mysql');
var http = require('http');
var bodyParser = require('body-parser');

var queryresult
var body

var con = mysql.createConnection({
    host: "localhost",
    user: "middleman",
    password: "jsinterface",
    database: "test"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL interface operational");
});

http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }
    if (req.method === "POST"){
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString()
        });
        req.on("end", () => {
            console.log("body:");
            console.log(body);
            try{
                var requestData = JSON.parse(body);
                //var requestData = body;
                var sqlQuery = requestData.query;

                console.log("body:");
                console.log(requestData);

                con.query(sqlQuery, function (err, result, fields) {
                    if (err) {
                        console.error("Error executing query:", err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({response: "Error executing query: " + err.message}));
                        return;
                    }

                    console.log("requested data:");
                    console.log(result)
                    queryresult = result;
                    res.end(JSON.stringify(queryresult));
                });
            } catch(err) {
                console.error("Error processing request: ", err);
                res.statusCode = 500;
                res.end(JSON.stringify({response: "Error processing request: " + err.message}));
            }
        })
    };
}).listen(8080);