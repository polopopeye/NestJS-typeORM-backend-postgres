# notations:

## Controllers

![Arquitectura](https://static.platzi.com/media/user_upload/Captura-072763bb-e6fd-4917-bdc1-797a1768890e.jpg)

los controladores manejan los request a una API,

tienen clases y decoradores,

Validar, permisos, etc.

## Servicios

los controladores manipulan datos se conectan a los servicios y/o estos a su vez se pueden conectar a los data models o data access para modificarlos

@Injectable() => injeccion de dependencias, injectados hacia controladores.

## decoradores

como se debe comportar frente al framework

## Request

get, put, post, delete,

- get: categorias, allproducts, single product
- query: limit, filter, offset

los params de url siempre vienen como string
por eso se utilizan pipes => como parseIntPipe

## Pipe

sirver para parsear y validar datos. por ejemplo en el controlador
getProduct(@Param('id', ParseIntPipe) id: number) {

    Puedes crear tus propios pipes para crear validaciones y transformaciones personalizadas.

con este comando de cli:

    nest g pipe common/parse-int

## DTO (data transfer objects) vs Entitites

Entitites => controllers and services
(src/entitites)

DTO's => DB append
(src/dtos)

no mezclar los dos se crean así

```
export class CreateProductDto {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly image?: string;  // opcional
  readonly currency?: string; //opcional
}
```

### class validator

esto en main.ts
import { ValidationPipe } from '@nestjs/common';
app.useGlobalPipes(new ValidationPipe());

npm i class-validator class-transformer @nestjs/mapped-types

```
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  readonly image: string;

  @IsUrl()
  @IsNotEmpty()
  readonly currency: string;
}
```

isNumber(21) <= OJO! esto no funciona para DTO pero es funcion que puede resultar util

whitelist: true, <= Esto evita que se añadan datos extras
forbidNonWhitelisted: true, <= ademas da error

```
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);

```

# buenas practicas

- siempre en plural

## single responsibility

- crear metodos que solo hagan una cosa

* crear clases que atienda a pocos endpoints
* categories
* products (ejemplo)
  cada metodo tiene que tener una sola responabilidad, esto tambien se puede llevar a las clases, tiene que haber muchas clases.

## Codigos de estados

Informational responses (100–199)
Successful responses (200–299)
Redirection messages (300–399)
Client error responses (400–499)
Server error responses (500–599)

`HttpCode(HttpStatus. `

## Exceptions

Errores primero > errors first

`if(!product) return NotFoundException `
`return product`

BadRequestException
UnauthorizedException
NotFoundException
ForbiddenException
NotAcceptableException
RequestTimeoutException
ConflictException
GoneException
HttpVersionNotSupportedException
PayloadTooLargeException
UnsupportedMediaTypeException
UnprocessableEntityException
InternalServerErrorException
NotImplementedException
ImATeapotException
MethodNotAllowedException
BadGatewayException
ServiceUnavailableException
GatewayTimeoutException
PreconditionFailedException

# CLI

[https://docs.nestjs.com/cli/usages](https://docs.nestjs.com/cli/usages)

como crear controladores desde el terminal...
`nest g controller nombreControlador`
`nest g controller controllers/products --flat` <= MEJOR

## MOCOS - modulo, controlador, servicio

```

nest g mo products
nest g co products
nest g s products

```

como crear servicios

```

```

```

```
