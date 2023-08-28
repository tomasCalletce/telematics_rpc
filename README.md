## Reto 2

Breve descripción de la actividad:
Crear un API Gateway con conexión a 2 microservicios: "search file" y "list files". Si falla algún servicio, entonces se debe enviar el request al MOM (Message Oriented Middleware).

1.1. ¿Qué aspectos cumplió o desarrolló de la actividad propuesta por el profesor (requerimientos funcionales y no funcionales)?
Cumplí con todos los objetivos. Para mejorar, se puede evitar repetir la lógica de "search file" y "list file" en Python y JS. En el futuro, el "consumer" debería estar escrito en JS y ambos, Python y JS, deberían importar la función adecuada.

1.2 Información general de diseño de alto nivel, arquitectura, patrones y mejores prácticas utilizadas:
Se creó un directorio para cada servicio y un solo directorio para los protos.
Descripción del ambiente de desarrollo y técnico:

1.3 Lenguajes de programación: JS, Python
Frameworks y bibliotecas: Express, gRPC, RabbitMQ

Instrucciones de compilación y ejecución:
Ejecutar npm i en el root.
Ejecutar pip install en /rabbitmq.
Es necesario tener Python y Node instalados en la máquina.
Para ejecutar cada parte del sistema, navega a los respectivos directorios y ejecuta el archivo principal con node main.

IP o nombres de dominio:
52.55.99.177


