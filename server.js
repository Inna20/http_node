const http = require('http');
const fs = require("fs");
const path = require("path");
const url = require("url");

http.createServer((request, response) => {
   	const reqUrl = new URL(
		   request.url, 
		   'http://' + request.headers.host + '/'
	);
	const queryPath = reqUrl.searchParams.get('path');

	if (queryPath) {
		const filePath = path.join(__dirname, queryPath);

		response.writeHead(200, { 'Content-Type': 'text/html'});

		if (fs.lstatSync(filePath).isDirectory()) {
			const list = fs.readdirSync(path.join(__dirname, queryPath));
			
			let output = '<ul>';
			for(let i = 1; i < list.length; i++) {
				output += '<li><a href="' + reqUrl.origin + '/?path=' + queryPath + '/' + list[i] + '">' + list[i] + '</a></li>';
			}

			response.end(output);

		} else {
			const readStream = fs.createReadStream(filePath);
			readStream.pipe(response);
		}
	}
}).listen(3000, 'localhost');