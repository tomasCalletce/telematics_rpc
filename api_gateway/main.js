const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const app = express();
const PORT = 3000;

// file service 
const listFilePROTO_PATH = path.resolve(__dirname, '../proto/list_files.proto');
const listFilePORT = 50051;
const listFilePackageDefinition = protoLoader.loadSync(listFilePROTO_PATH);
const listFileService = grpc.loadPackageDefinition(listFilePackageDefinition).FileService;
const listFileClient = new listFileService(`127.0.0.1:${listFilePORT}`,grpc.credentials.createInsecure());

// search service
const findFilePROTO_PATH = path.resolve(__dirname, '../proto/find_file.proto');
const findFilePORT = 50052;
const findFilePackageDefinition = protoLoader.loadSync(findFilePROTO_PATH);
const findFileService = grpc.loadPackageDefinition(findFilePackageDefinition).FileService;
const findFileClient = new findFileService(`127.0.0.1:${findFilePORT}`,grpc.credentials.createInsecure());

// list all files endpoint
app.get('/list', (req, res) => {
  listFileClient.ListFiles({}, (error, response) => {
    if (error) {
        console.error('Error calling the gRPC service', error);
        res.status(500).send('Error calling microservice');
        return;
    }
    res.json(response.filenames);
  });
});

// search file 
app.get('/search', (req, res) => {
  findFileClient.FindFile({ name: req.query.name }, (error, response) => {
    if (error) {
      console.error('Error calling the gRPC service', error);
      res.status(500).send('Error calling microservice');
      return;
    }
    res.json(response);
  });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
