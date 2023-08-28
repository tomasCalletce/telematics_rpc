const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const amqp = require('amqplib/callback_api');

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

function callMom(msg) {
    const exchange = 'serve';

    amqp.connect('amqp://user:password@52.55.99.177:5672/', function(error0, connection) {
        if (error0) {
            console.error('Error connecting to RabbitMQ:', error0);
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.error('Error creating channel:', error1);
                connection.close();
                throw error1;
            }
            
            channel.assertExchange(exchange, 'direct', {
                durable: true
            });
            channel.publish(exchange, '', Buffer.from(msg));
            
            console.log("Called mom with: ", msg);
        });

        setTimeout(function() {
            connection.close();
        }, 500);
    });
}

// list all files endpoint
app.get('/list', (req, res) => {
  listFileClient.ListFiles({}, (error, response) => {
    if (error) {
      try {
        res.status(500).send('Error calling microservice, calling mom instead');
        callMom('list');
      } catch (error) {
        console.error('Error calling the gRPC service', error);
        res.status(500).send('Error calling microservice');
        return;
      }   
    }else {
      res.json(response.filenames);
    }
  });
});

// search file 
app.get('/search', (req, res) => {
  findFileClient.FindFile({ name: req.query.name }, (error, response) => {
    if (error) {
      try {
        res.status(500).send('Error calling microservice, calling mom instead');
        callMom('search');
      } catch (error) {
        console.error('Error calling the gRPC service', error);
        res.status(500).send('Error calling microservice');
        return;
      }   
    }else {
      res.json(response);
    }
  });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
