const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PROTO_PATH = path.resolve(__dirname, '../proto/list_files.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const fileServiceProto = grpc.loadPackageDefinition(packageDefinition);
const services = require('./services/listFiles') 

const PORT = process.env.LIST_FILE_PORT;
const ID = process.env.LIST_FILE_IP;

const server = new grpc.Server();

const listFiles = async (call, callback) => {
    try {
      const files = await services.listFiles();
      callback(null, { filenames: files });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error reading directory"
      });
    }
};

server.addService(fileServiceProto.FileService.service, { ListFiles: listFiles });
server.bindAsync(`${ID}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`gRPC server running on http://${ID}:${PORT}`);
});
