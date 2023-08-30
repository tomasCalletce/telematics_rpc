const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../proto/find_file.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const fileServiceProto = grpc.loadPackageDefinition(packageDefinition);
const services = require('./services/findFile') 

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const server = new grpc.Server();

const PORT = process.env.FIND_FILE_PORT;
const IP = process.env.FIND_FILE_IP;

const find = async (call, callback) => {
  try {
    const filesFound = await services.findFile(call.request.name);
    callback(null, { found : filesFound });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      details: "Error reading directory"
    });
  }
};

server.addService(fileServiceProto.FileService.service, { FindFile: find });
server.bindAsync(`${IP}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`gRPC server running on http://${IP}:${PORT}`);
});
