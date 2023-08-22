const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

const PROTO_PATH = path.resolve(__dirname, '../proto/list_files.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const fileServiceProto = grpc.loadPackageDefinition(packageDefinition);

const DIRECTORY_PATH = path.join(__dirname, 'files');
const PORT = 50051;

const server = new grpc.Server();

const listFiles = (call, callback) => {
    fs.readdir(DIRECTORY_PATH, (err, files) => {
        if (err) {
            callback({
                code: grpc.status.INTERNAL,
                details: "Error reading directory"
            });
            return;
        }
        callback(null, { filenames: files });
    });
};

server.addService(fileServiceProto.FileService.service, { ListFiles: listFiles });
server.bindAsync(`127.0.0.1:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`gRPC server running on http://127.0.0.1:${PORT}`);
});
