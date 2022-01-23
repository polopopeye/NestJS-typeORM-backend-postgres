# docker conection

docker-compose.yml
este tiene servicios que se crean, llamados containers y podemos ejecutar facilmente db en local de manera rapida...

```
version: '3.3'

services:
  postgres:
    image: postgres:13
    environment:
     - POSTGRES_DB=my_db
     - POSTGRES_USER=root
     - POSTGRES_PASSWORD=123456
    ports:
      - '5432:5432'
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

```

no subir data:

```
# Docker Data
/postgres_data

```

## cli

```
docker-compose up -d postgres
docker-compose ps
docker-compose down

```

### conectar/salir to image (server)

`docker-compose exec postgres bash `
`salir => exit`

#### conectar to postgress cli

`psql -h localhost -d graphql -U polopopeye`

- \d+ => para buscar tablas
- \q => para salir

### interfaz pgadmin4

en docker.yml

```

  pgadmin:
    image: dpage/pgadmin4
    environment:
      - PGADMIN_DEFAULT_EMAIL=root@admin.com
      - PGADMIN_DEFAULT_PASSWORD=root
    ports:
      - '5050:80'
```

### PGADMIN4

localhost:5050 => por defecto en yaml creado

primero tenemos que crear objeto y conectar a db

docker ps => para obtener uid del proceso

docker inspect 6835fa9902af => para tener la ipadress

se puede crear una tabla con query tools

```
CREATE TABLE tasks (
id serial PRIMARY KEY,
title varchar (225) NOT NULL,
completed boolean DEFAULT false
)
```

# Conectar Nest con DB =>

https://node-postgres.com/

npm i pg => para conectar driver official
npm i @types/pg -D => typado para trabajar con TS

luego en app.module

```
import { Client } from 'pg';


const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'postgress',
  password: '12345',
  port: 5432,
});
client.connect();
client.query('SELECT * FROM tasks', (e, res) => {
  console.log(e);
  console.log(res.rows);
});
```

luego se tiene que añadir como provider para consultarlo cuando sea necesario

## DB as injectable desde un provider

mirar de poner en dbmodule

# ORM

instalar con nestJS
npm install --save @nestjs/typeorm typeorm
nueva version solo
npm install --save typeorm

Abstrae el codigo, es POO => typeORM

Que hace? Capa extra que le ingresamos a nuestra app
Se encarga de la conexion y todo en base a modelos y entidades
En esas entidades definidos propiedades y metodos.
No vamos a realizar codigo sql para ejecutar las operaciones. Pero el ORM nos permite realizar operaciones y consultas complejas.
Tambien nos abstrae la conexion, asi que nos podemos conectar a diferentes motores.
Hay dos famosos ORM que se utilizan y son:
Sequelize
TypeORM

```
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configuration: ConfigType<typeof config> = config()) => {
      const {
        engine,
        dbName: database,
        user: username,
        password,
        port,
        host,
      } = configuration.postgres;

      console.log(engine, database, username, password, port, host);

      const connection = await createConnection({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      });
      return connection;
    },
  },
];



@Module({
  providers: [
    ...databaseProviders,
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const {
          user,
          host,
          password,
          port,
          dbName: database,
        } = configService.postgres;
        const client = new Client({
          user,
          host,
          database,
          password,
          port,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'PG', ...databaseProviders],
})
export class DatabaseModule {}


```

## CREAR MODELOS

esto va en entitites

como:

```
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'int' })
  price: number;
  @Column({ type: 'int' })
  stock: number;
  @Column({ type: 'varchar' })
  image: string;
}

```

luego se importa al modelo que necista

imports: [DatabaseModule],
