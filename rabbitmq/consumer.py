import pika
import os

connection = pika.BlockingConnection(pika.ConnectionParameters('52.55.99.177', 5672, '/', pika.PlainCredentials("user", "password")))
channel = connection.channel()

def list_files(directory):
    with os.scandir(directory) as entries:
        return [entry.name for entry in entries if entry.is_file()]

def callback(ch, method, properties, body):
    if(body == b'list'):
        directory_path = "../files"
        files = list_files(directory_path)
        for file_name in files:
          print(file_name)
        return
    if(body == b'help'):
        print('help')
        return
    channel.stop_consuming()
    
channel.basic_consume(queue="serve-queue", on_message_callback=callback, auto_ack=True)
channel.start_consuming()
