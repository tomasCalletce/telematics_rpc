const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const amqp = require('amqplib/callback_api');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT;

// file service 
const listFilePROTO_PATH = path.resolve(__dirname, '../proto/list_files.proto');
const listFilePORT = process.env.LIST_FILE_PORT;
const listFilePackageDefinition = protoLoader.loadSync(listFilePROTO_PATH);
const listFileService = grpc.loadPackageDefinition(listFilePackageDefinition).FileService;
const listFileClient = new listFileService(`${process.env.LIST_FILE_IP}:${listFilePORT}`, grpc.credentials.createInsecure());

// search service
const findFilePROTO_PATH = path.resolve(__dirname, '../proto/find_file.proto');
const findFilePORT = process.env.FIND_FILE_PORT;
const findFilePackageDefinition = protoLoader.loadSync(findFilePROTO_PATH);
const findFileService = grpc.loadPackageDefinition(findFilePackageDefinition).FileService;
const findFileClient = new findFileService(`${process.env.FIND_FILE_IP}:${findFilePORT}`, grpc.credentials.createInsecure());

function callMom(msg) {
    const exchange = 'serve';

    amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/`, function(error0, connection) {
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
        callMom(JSON.stringify({
          type : 'list',
          value : req.query.name,
          email : req.query.email 
        }));
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
        callMom(JSON.stringify({
          type : 'search',
          value : req.query.name,
          email : req.query.email 
        }));
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
    console.log(`Server running on http://${process.env.API_GATEWAY_IP}:${PORT}`);
});
