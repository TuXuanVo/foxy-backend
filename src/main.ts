import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { MongoExceptionFilter } from './mongoose-exception.filter';
import * as cookieParser from 'cookie-parser';

const PORT = +process.env.PORT || 8000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log'],
    });
    app.enableCors();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    app.useGlobalFilters(new MongoExceptionFilter());
    // app.useGlobalFilters(new HttpExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle('FOXY API')
        .setDescription("The Foxy's API description")
        .setVersion('1.0')
        .addBearerAuth(
            {
                description: `[just text field] Please enter token in following format: Bearer <JWT>`,
                name: 'Authorization',
                bearerFormat: 'Bearer',
                scheme: 'Bearer',
                type: 'http',
                in: 'Header',
            },
            'access_token',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT);
    console.log(`[⚡server] Server is running on port http://localhost:${PORT}`);
    console.log(`[⚡server] Swagger on http://localhost:${PORT}/api`);
}
bootstrap();
