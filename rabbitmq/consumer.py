import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('52.55.99.177', 5672, '/', pika.PlainCredentials("user", "password")))
channel = connection.channel()

def callback(ch, method, properties, body):
    print(f'{body} is received')
    
channel.basic_consume(queue="serve-queue", on_message_callback=callback, auto_ack=True)
channel.start_consuming()
