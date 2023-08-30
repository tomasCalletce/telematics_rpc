const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PROTO_PATH = path.resolve(__dirname, '../proto/find_file.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const fileServiceProto = grpc.loadPackageDefinition(packageDefinition);
const DIRECTORY_PATH = path.join(__dirname, '../files');

const server = new grpc.Server();

const PORT = process.env.FIND_FILE_PORT;
const IP = process.env.FIND_FILE_PORT;

const find = (call, callback) => {
  fs.readdir(DIRECTORY_PATH, (err, files) => {
    if (err) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error reading directory"
      });
      return;
    }

    const filesFound = [];

    files.forEach((file) => {
      if (file.startsWith(call.request.name)) {
        filesFound.push(file);
      }
    });

    callback(null, { found : filesFound });
  });
};


server.addService(fileServiceProto.FileService.service, { FindFile: find });
server.bindAsync(`${IP}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`gRPC server running on http://${IP}:${PORT}`);
});
