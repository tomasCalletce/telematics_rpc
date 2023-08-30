const amqp = require('amqplib/callback_api');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const searchService = require('../find_file/services/findFile');
const listService = require('../list_files/services/listFiles');

const AMQP_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/`;

amqp.connect(AMQP_URL, (err, connection) => {
  if (err) {
    throw err;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    channel.consume('serve-queue', (msg) => {

      try {
        const body = JSON.parse(msg.content.toString());
        console.log(`${body.type}: ${body.value} is received`);
        handle(body);
      } catch (error) {
        console.log(error);
      }
      channel.ack(msg);
    });
  });
});

const handle = (body) => {
  if(body.type === 'list'){
    const files = listService.listFiles();
    console.log(files);
  }else if(body.type === 'search'){
    const files = searchService.findFile(body.value);
    console.log(files);
  }
}