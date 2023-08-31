# Telematica

**Estudiante(s)**: Tomas Calle  
📧 **Email**: tcallee@eafit.edu.co

**Profesor**: Edwin Nelson Montoya Munera  
📧 **Email**: emontoya@eafit.edu.co

---

## Reto Mom y gRPC

### 1. Descripción de la Actividad

Crear un API Gateway que se conecte a 2 microservicios: "search file" y "list files". Si alguno de los servicios falla, el request debe ser enviado al MOM (Message Oriented Middleware).

### 1.1. Logros

Cumplí con todos los objetivos. El código sigue buenas prácticas, manteniendo un equilibrio entre ser DRY y evitar un acoplamiento excesivo.

### 1.2. Áreas de Mejora

Se cumplieron todas las expectativas. Sin embargo, en el futuro sería beneficioso implementar una estrategia diferente para notificar al cliente cuando su petición ha sido procesada por el consumidor del MOM.

### 2. Diseño y Arquitectura

Se creó un directorio para cada servicio y un único directorio para los protos. Cada servicio tiene un archivo `main` que actúa como controlador y maneja toda la lógica necesaria de los archivos en `/services`. Cada microservicio sigue este patrón.

### 3. Ambiente de Desarrollo

Todo fue desarrollado con Node.js y se utilizaron las siguientes tecnologías y librerías:

- **Express**: HTTP server
- **gRPC**: RPC
- **RabbitMQ**: MOM
- **SendGrid**: Envío de emails

#### Cómo compilar y ejecutar:

1. Instalar Node.js y npm.
2. Ejecutar `npm i`.
3. Iniciar cada servicio individualmente con `node <filename>`.
4. Recuerda hacer una copia de `.env.example` y configurarla con los parámetros adecuados.

#### Detalles del Desarrollo:

Inicialmente, la lógica del consumidor del MOM fue escrita en Python por conveniencia, pero esto resultó ser un mal patrón ya que se repetía la lógica de "search file" y "list file".

#### Configuración del Proyecto:

Haz una copia de `.env.example` y configura las variables con los parámetros deseados.

### 4. Ambiente de Producción

Los detalles específicos de las librerías y paquetes están en `package.json`.

### IPs y Dominios:

Todos los microservicios están montados en la misma máquina con las siguientes direcciones:

- **API**: 52.55.99.177:80
- **search_file**: 172.31.44.38:50051 (privado)
- **list_file**: 172.31.44.38:50051 (privado)


