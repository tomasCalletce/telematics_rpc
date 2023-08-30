const amqp = require('amqplib/callback_api');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const searchService = require('../find_file/services/findFile');
const listService = require('../list_files/services/listFiles');
const rabbitMQService = require('./services/email')

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
        handle(body);
      } catch (error) {
        console.log(error);
      }
      channel.ack(msg);
    });
  });
});

const send = (email,package) => {
  console.log(`sent ${package} to ${email}`);
  rabbitMQService.sendMessage(package,email);
}

const handle = async (body) => {
  if(body.type === 'list'){
    const files = await listService.listFiles();
    send(body.email,files);
  }else if(body.type === 'search'){
    const files = await searchService.findFile(body.value);
    send(body.email,files);
  }
}