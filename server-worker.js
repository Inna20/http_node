const http = require('http');
const fs = require("fs");
const path = require("path");
const url = require("url");
const { Worker } = require('worker_threads');

const params = {
	'fileName': './access.log',
	'ip1': '34.48.240.111',
	'ip2': '89.123.1.41'
}

function start(workerData) {
	return new Promise((resolve, reject) => {
	  const worker = new Worker('./worker.js', { workerData });
  
	  worker.on('message', resolve);
	  worker.on('error', reject);
	})
}
  
start(params)
	.then(result => console.log(result)) 
	.catch(err => console.error(err));  