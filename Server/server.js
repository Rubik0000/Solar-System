
const http = require("http");
const fs = require("fs");


let server = http.createServer(
	(request, response) => {
		if (request.url == "/js/script.js") {
			response.writeHead(200, { "Content-type" : "application/javascript" });
			let script = fs.readFileSync("../js/script.js", "utf8");
			response.write(script);
		}
		else if (request.url == "/index.html") {
			response.writeHead(200, { "Content-type" : "text/html" });
			let page = fs.readFileSync("../index.html", "utf8");
			response.write(page);
		}
		else {
			response.writeHead(404, { "Content-type" : "text/html" });
			response.write("<h1>Resource not found</h1>");
		}
		response.end();	
	}
);


server.listen(8000);