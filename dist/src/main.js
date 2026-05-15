"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const cookieParser = require('cookie-parser');
    const localConfig = { origin: ['http://localhost:3000'], credentials: true };
    const isLocal = process.env.isLocal;
    app.enableCors(isLocal == 'true' ? localConfig : {});
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Books API')
        .setDescription('sistema para la gestión de libros e inventarios xd')
        .setVersion('1.2')
        .addTag('books')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
    console.log(`Aplicación corriendo en: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map