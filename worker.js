const fs = require('fs');
const path = require('path');
const { workerData, parentPort } = require('worker_threads');

let ip1 = workerData.ip1;
let ip2 = workerData.ip2;

const readStream = new fs.ReadStream(workerData.fileName, 'utf8');
const writeStream1 = fs.createWriteStream(path.join(__dirname, ip1 + '_request.log'), { flags: 'a', encoding: 'utf8' });
const writeStream2 = fs.createWriteStream(path.join(__dirname, ip2 + '_request.log'), { flags: 'a', encoding: 'utf8' });

readStream.on('data', (chunk) => {

    let stringsArr = chunk.toString().split("\n");
    for(let i = 0; i < stringsArr.length; i++) {
        if (stringsArr[i].includes(ip1)) {
            writeStream1.write(stringsArr[i] + "\n");
        }

        if (stringsArr[i].includes(ip2)) {
            writeStream2.write(stringsArr[i] + "\n");
        }
    }
});

readStream.on('end', () => console.log('File reading finished'));
readStream.on('error', () => console.log(err));

parentPort.postMessage({ result: 'success work!' });