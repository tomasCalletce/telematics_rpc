const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

const PROTO_PATH = path.resolve(__dirname, '../proto/find_file.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const fileServiceProto = grpc.loadPackageDefinition(packageDefinition);

const DIRECTORY_PATH = path.join(__dirname, '../files');
const PORT = 50052;

const server = new grpc.Server();

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
server.bindAsync(`127.0.0.1:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`gRPC server running on http://127.0.0.1:${PORT}`);
});
