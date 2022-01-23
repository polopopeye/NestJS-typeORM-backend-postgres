# Modulos

imports: [UsersModule, ProductsModule],

cada modulo tiene sus controlador, servicios y entidades
todod tiene que estar encapsulados, en modulos mas pequeños...

```
producto
    -categorias
    -añadir
    -eliminar

usuarios
    - controlers
    - perfil
    - buscar
    - eliminar

codigo organizado
```

@Module({
imports:[],
controllers:[]
providers:[]
export:[]
})

# cli

nest g mo products

# injections

## @injectable

dentro de servicios
existe @injectable el mas famoso para servicios

## @inject

y para global props => @inject

`constructor(@Inject('API_KEY') private apikey: string) {}`
the esta manera obtenemos el API_KEY de manera segura en toda la app
dentro del provider de appmodule

```
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },

```

## Async Inject - Factory

se puede injectar a un servicio, utiliza axios por detras...

`constructor(private httpService: HttpService) {}`

```
    {
      provide: 'TASK',
      useFactory: async (http: HttpService) => {
        const tasks = await http
          .get('https://jsonplaceholder.typicode.com/todos')
          .toPromise();
        return tasks.data;
      },
      inject: [HttpService],
    },
```

y en app service:

```
 constructor(
    @Inject('API_KEY') private apikey: string,
    @Inject('TASK') private tasks: string,
  ) {}

```

# modules

pueden exportarse e importarse,

- no puede haver loops
- padre > hijo
- tienen que ser como islas
- tinen sus services and controllers

## Global modules

@Global
estos providers son globales,
como apiKey y puede ser utilizada por cualquier modulo,
como por ejemplo database conection

```
import { Global, Module } from '@nestjs/common';

const API_KEY = 'abc12345';
const API_KEY_PROD = 'PROD-abc12345';

@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
  ],
  exports: ['API_KEY'],
})
export class DatabaseModule {}


// Luego llamarlo desde cualquier servicio

  constructor(@Inject('API_KEY') private apikey: string,) {}

```

En caso de que se créen loops, utilizar los global modules, pero no es aconsejable.

## ConfigModule

integrar .env files
en app module,

```
   ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
```

y se importa a un servicio:

```
  constructor(private configService: ConfigService) {}
```

y se usa:

```
  const apiKey = this.configService.get('API_KEY');
  const dbName = this.configService.get('DATABASE_NAME');
  console.log(apiKey, dbName);
```

### Blindar con Typos en configModule: Tipado Seguro

Creamos un archivo config con las constantes:

```
import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DB_NAME,
      port: process.env.DB_PORT,
    },
    apiKey: process.env.API_KEY,
  };
});

```

en APPMODULE:

```
    // load: [config],

    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),

```

Luego desde el servicio lo podemos llamar dentro del constructor

```

 // @Inject(config.KEY) private configService: ConfigType<typeof config>,

 constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}
```

USO dentro de una funcion en ese mismo servicio:

```
    const apiKey = this.configService.apiKey;
    const dbName = this.configService.database.name;
```

### Validar datos en variable de entorno

1- instalamos el joi:

`npm install joi`

2- Añadimos la config a app.module

```
  //    validationSchema: Joi.object({
  //      API_KEY: Joi.string().required(),
  //      DB_NAME: Joi.string().required(),
  //      DB_PORT: Joi.number().required(),
  //    }),


        imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
      }),
    }),
    HttpModule,
    UsersModule,
    ProductsModule,
    DatabaseModule,
  ],
```

# DOCUMENTACION !!! SWAGER!!!!

instalar dependencias
si hay problemas instalando

new -
`npm i @nestjs/swagger`
old- stable
`npm i @nestjs/swagger@4.5.12-next.1`

y instalar:

`npm i swagger-ui-express`

```
// src/main.ts

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  ...
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('PLATZI STORE')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  ...
  await app.listen(3000);
}
bootstrap();
```

```
# nest-cli.json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": ["@nestjs/swagger/plugin"]
  }
}
```

@ApiTags('products')
@ApiOperation({ summary: 'Get a list of the products' })

ATENCION! asegurar que sea ....dto.ts
verificar nest prebuild (limpia cache)

# CORS ALLOW

// main.ts
`app.enableCors();`

# Deploy Heroku

packages JSON, poner version node =>
´´´´
"engines":{
"node": "14.x"
}
´´´´
.Procfile <= archivo heroku
contenido:

```
npm run start:prod
```

Instalar -> Heroku CLI

y seguir pasos
verificar puerto de variables de entorno y actualizar app.listen();
