/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(50);
const express = __importStar(__webpack_require__(24));
let cachedExpressApp;
async function bootstrapServer() {
    if (cachedExpressApp) {
        return cachedExpressApp;
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const cookieParser = __webpack_require__(122);
    const localConfig = { origin: ['http://localhost:3000'], credentials: true };
    const isLocal = process.env.isLocal;
    app.enableCors(isLocal == 'true' ? localConfig : {});
    app.use(cookieParser());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
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
    await app.init();
    cachedExpressApp = app.getHttpAdapter().getInstance();
    return cachedExpressApp;
}
if (process.env.isLocal === 'true') {
    async function bootstrapLocal() {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const cookieParser = __webpack_require__(122);
        const localConfig = { origin: ['http://localhost:3000'], credentials: true };
        app.enableCors(localConfig);
        app.use(cookieParser());
        app.use(express.json({ limit: '10mb' }));
        app.use(express.urlencoded({ limit: '10mb', extended: true }));
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        await app.listen(process.env.PORT || 3000, '0.0.0.0');
        console.log(`Aplicación corriendo localmente en: ${await app.getUrl()}`);
    }
    bootstrapLocal();
}
exports["default"] = async (req, res) => {
    const server = await bootstrapServer();
    return server(req, res);
};


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
const user_module_1 = __webpack_require__(27);
const books_module_1 = __webpack_require__(35);
const inventory_module_1 = __webpack_require__(43);
const serve_static_1 = __webpack_require__(53);
const path_1 = __webpack_require__(54);
const platform_express_1 = __webpack_require__(55);
const physical_books_module_1 = __webpack_require__(56);
const category_module_1 = __webpack_require__(61);
const author_module_1 = __webpack_require__(66);
const physical_book_operation_module_1 = __webpack_require__(71);
const item_type_module_1 = __webpack_require__(79);
const inventory_operation_module_1 = __webpack_require__(84);
const logs_module_1 = __webpack_require__(92);
const backup_module_1 = __webpack_require__(98);
const sync_module_1 = __webpack_require__(102);
const ai_books_module_1 = __webpack_require__(107);
const ai_inventory_module_1 = __webpack_require__(114);
const ai_physical_book_module_1 = __webpack_require__(118);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'public'),
                serveRoot: '/public',
            }),
            platform_express_1.MulterModule.register({
                dest: '/public/uploads'
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UsersModule,
            books_module_1.BooksModule,
            inventory_module_1.InventoryModule,
            physical_books_module_1.PhysicalBooksModule,
            category_module_1.CategoryModule,
            author_module_1.AuthorModule,
            physical_book_operation_module_1.PhysicalBookOperationModule,
            item_type_module_1.ItemTypeModule,
            inventory_operation_module_1.InventoryOperationModule,
            logs_module_1.LogsModule,
            backup_module_1.BackupModule,
            sync_module_1.SyncModule,
            ai_books_module_1.AiBooksModule,
            ai_inventory_module_1.AiInventoryModule,
            ai_physical_book_module_1.AiPhysicalBookModule,
        ],
        providers: [],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(6);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(7);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(9);
const auth_controller_1 = __webpack_require__(17);
const user_module_1 = __webpack_require__(27);
const passport_1 = __webpack_require__(26);
const jwt_1 = __webpack_require__(10);
const config_1 = __webpack_require__(4);
const jwt_strategy_1 = __webpack_require__(33);
const mail_module_1 = __webpack_require__(32);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UsersModule,
            mail_module_1.MailModule,
            passport_1.PassportModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '12h' },
                }),
            }),
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(10);
const prisma_service_1 = __webpack_require__(6);
const user_service_1 = __webpack_require__(11);
const mail_service_1 = __webpack_require__(12);
const code_1 = __webpack_require__(14);
const bcrypt = __importStar(__webpack_require__(15));
let AuthService = class AuthService {
    constructor(prisma, jwtService, usersService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.mailService = mailService;
    }
    logout(res) {
        res.clearCookie('jwt');
        return { message: 'Sesión Cerrada', status: 'success' };
    }
    async register(registerDto) {
        await this.usersService.create(registerDto);
        return {
            state: 'success',
            message: 'Usuario registrado. Revisa tu correo para verificar la cuenta.',
        };
    }
    async verifyEmail(email, code) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (user.emailVerified) {
            return { state: 'success', message: 'La cuenta ya está verificada' };
        }
        if (!user.verificationCode || !user.verificationCodeExpires) {
            throw new common_1.BadRequestException('No hay un código de verificación activo');
        }
        if (user.verificationCodeExpires < new Date()) {
            throw new common_1.BadRequestException('El código ha expirado. Solicita uno nuevo.');
        }
        const isMatch = await bcrypt.compare(code, user.verificationCode);
        if (!isMatch)
            throw new common_1.BadRequestException('Código de verificación incorrecto');
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationCode: null,
                verificationCodeExpires: null,
            },
        });
        return { state: 'success', message: 'Cuenta verificada correctamente' };
    }
    async resendVerification(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (user.emailVerified) {
            return { state: 'success', message: 'La cuenta ya está verificada' };
        }
        const code = (0, code_1.generateVerificationCode)();
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                verificationCode: await (0, code_1.hashCode)(code),
                verificationCodeExpires: new Date(Date.now() + code_1.CODE_TTL_MS),
            },
        });
        await this.mailService.sendVerificationCode(email, code);
        return { state: 'success', message: 'Código de verificación reenviado' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user) {
            const code = (0, code_1.generateVerificationCode)();
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    resetCode: await (0, code_1.hashCode)(code),
                    resetCodeExpires: new Date(Date.now() + code_1.CODE_TTL_MS),
                },
            });
            await this.mailService.sendPasswordResetCode(email, code);
        }
        return {
            state: 'success',
            message: 'Si el correo está registrado, recibirás un código para restablecer tu contraseña.',
        };
    }
    async resetPassword(email, code, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (!user.resetCode || !user.resetCodeExpires) {
            throw new common_1.BadRequestException('No hay una solicitud de recuperación activa');
        }
        if (user.resetCodeExpires < new Date()) {
            throw new common_1.BadRequestException('El código ha expirado. Solicita uno nuevo.');
        }
        const isMatch = await bcrypt.compare(code, user.resetCode);
        if (!isMatch)
            throw new common_1.BadRequestException('Código de recuperación incorrecto');
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetCode: null,
                resetCodeExpires: null,
                emailVerified: true,
            },
        });
        return { state: 'success', message: 'Contraseña actualizada correctamente' };
    }
    async login(email, pass, res) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Contraseña incorrecta');
        if (!user.emailVerified) {
            throw new common_1.ForbiddenException('Debes verificar tu correo antes de iniciar sesión');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        res.cookie('jwt', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 12 * 60 * 60 * 1000,
        });
        return {
            state: 'success',
            message: 'Login exitoso',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof user_service_1.UsersService !== "undefined" && user_service_1.UsersService) === "function" ? _c : Object, typeof (_d = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _d : Object])
], AuthService);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(6);
const mail_service_1 = __webpack_require__(12);
const code_1 = __webpack_require__(14);
const bcrypt = __importStar(__webpack_require__(15));
const getPagination_1 = __webpack_require__(16);
let UsersService = class UsersService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async findAll(query) {
        const search = query.search || '';
        const where = {};
        const { take, page, skip } = (0, getPagination_1.getPagination)(query);
        if (query.search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } }
            ];
        }
        const data = await this.prisma.user.findMany({ where, take, skip });
        const totalPages = await this.prisma.user.count({ where });
        return { data, totalPages };
    }
    async blockUser(id) {
        const user = await this.prisma.user.update({ where: { id }, data: { isBlocked: true } });
        return { status: 'success', message: 'Usuario Bloqueado' };
    }
    async unBlockUser(id) {
        const user = await this.prisma.user.update({ where: { id }, data: { isBlocked: false } });
        return { status: 'success', message: 'Usuario Desbloqueado' };
    }
    async create(createUserDto) {
        const { email, password, name } = createUserDto;
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { name: name }
                ]
            }
        });
        if (existingUser) {
            throw new common_1.ConflictException('Las credenciales están registradas');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = (0, code_1.generateVerificationCode)();
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "USER",
                emailVerified: false,
                verificationCode: await (0, code_1.hashCode)(verificationCode),
                verificationCodeExpires: new Date(Date.now() + code_1.CODE_TTL_MS),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        await this.mailService.sendVerificationCode(email, verificationCode);
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async updateRole(id, newRole) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: { role: newRole },
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`No se encontró el usuario con ID ${id}`);
        }
    }
    async getUserRole(id) {
        const role = await this.prisma.user.findUnique({ where: { id } });
        return { role: role.role };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                saves: {
                    include: {
                        book: true,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const { password, ...result } = user;
        return result;
    }
    async updateMe(id, updateDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const dataToUpdate = {};
        if (updateDto.name)
            dataToUpdate.name = updateDto.name;
        if (updateDto.email && updateDto.email !== user.email) {
            const emailExists = await this.prisma.user.findUnique({ where: { email: updateDto.email } });
            if (emailExists)
                throw new common_1.ConflictException('El correo ya se encuentra registrado');
            dataToUpdate.email = updateDto.email;
        }
        if (updateDto.password && updateDto.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.password = await bcrypt.hash(updateDto.password, salt);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: dataToUpdate,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
        return { message: 'Perfil actualizado con éxito', user: updatedUser };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _b : Object])
], UsersService);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const nodemailer = __importStar(__webpack_require__(13));
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.from =
            this.configService.get('MAIL_FROM') || 'UPTALib <no-reply@uptalib.com>';
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: Number(this.configService.get('MAIL_PORT')) || 587,
            secure: this.configService.get('MAIL_SECURE') === 'true',
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASSWORD'),
            },
        });
    }
    async sendVerificationCode(to, code) {
        await this.send(to, 'Verifica tu cuenta de UPTALib', `Tu código de verificación es: ${code}. Expira en 15 minutos.`, 'Verifica tu cuenta');
    }
    async sendPasswordResetCode(to, code) {
        await this.send(to, 'Recuperación de contraseña - UPTALib', `Tu código para restablecer la contraseña es: ${code}. Expira en 15 minutos.`, 'Restablece tu contraseña');
    }
    async send(to, subject, message, heading) {
        try {
            await this.transporter.sendMail({
                from: this.from,
                to,
                subject,
                text: message,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1d4ed8;">${heading}</h2>
            <p>${message}</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #111827;">${message.match(/\d{6}/)?.[0] ?? ''}</p>
            <p style="color: #6b7280; font-size: 12px;">Si no solicitaste este correo, puedes ignorarlo.</p>
          </div>
        `,
            });
        }
        catch (error) {
            this.logger.error(`No se pudo enviar el correo a ${to}`, error);
            throw new common_1.InternalServerErrorException('No se pudo enviar el correo. Inténtalo de nuevo más tarde.');
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], MailService);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashCode = exports.generateVerificationCode = exports.CODE_TTL_MS = void 0;
const bcrypt = __importStar(__webpack_require__(15));
exports.CODE_TTL_MS = 15 * 60 * 1000;
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();
exports.generateVerificationCode = generateVerificationCode;
const hashCode = (code) => bcrypt.hash(code, 10);
exports.hashCode = hashCode;


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPagination = getPagination;
function getPagination(query) {
    const take = parseInt(query.limit) || 10;
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * take;
    return { take, page, skip };
}


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(9);
const login_dto_1 = __webpack_require__(18);
const register_dto_1 = __webpack_require__(20);
const verify_email_dto_1 = __webpack_require__(21);
const forgot_password_dto_1 = __webpack_require__(22);
const reset_password_dto_1 = __webpack_require__(23);
const express_1 = __webpack_require__(24);
const jwt_auth_guard_1 = __webpack_require__(25);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(registerDto) {
        return this.authService.register(registerDto);
    }
    login(loginDto, res) {
        return this.authService.login(loginDto.email, loginDto.password, res);
    }
    verifyEmail(verifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto.email, verifyEmailDto.code);
    }
    resendVerification(forgotPasswordDto) {
        return this.authService.resendVerification(forgotPasswordDto.email);
    }
    forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }
    resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.email, resetPasswordDto.code, resetPasswordDto.password);
    }
    logout(res) {
        return this.authService.logout(res);
    }
    verifySession() {
        return {
            state: 'success',
            message: 'Sesión válida',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _c : Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof verify_email_dto_1.VerifyEmailDto !== "undefined" && verify_email_dto_1.VerifyEmailDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('resend-verification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof forgot_password_dto_1.ForgotPasswordDto !== "undefined" && forgot_password_dto_1.ForgotPasswordDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof forgot_password_dto_1.ForgotPasswordDto !== "undefined" && forgot_password_dto_1.ForgotPasswordDto) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof reset_password_dto_1.ResetPasswordDto !== "undefined" && reset_password_dto_1.ResetPasswordDto) === "function" ? _h : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('verify-session'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifySession", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(19);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const class_validator_1 = __webpack_require__(19);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyEmailDto = void 0;
const class_validator_1 = __webpack_require__(19);
class VerifyEmailDto {
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'El código debe tener 6 dígitos' }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "code", void 0);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordDto = void 0;
const class_validator_1 = __webpack_require__(19);
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = void 0;
const class_validator_1 = __webpack_require__(19);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'El código debe tener 6 dígitos' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(26);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(11);
const user_controller_1 = __webpack_require__(28);
const prisma_module_1 = __webpack_require__(5);
const mail_module_1 = __webpack_require__(32);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, mail_module_1.MailModule],
        controllers: [user_controller_1.UsersController],
        providers: [user_service_1.UsersService],
        exports: [user_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(11);
const user_dto_1 = __webpack_require__(29);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_decorator_1 = __webpack_require__(30);
const get_user_decorator_1 = __webpack_require__(31);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(query) {
        return this.usersService.findAll(query);
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    updateMe(userId, updateDto) {
        return this.usersService.updateMe(userId, updateDto);
    }
    getProfile(userId) {
        return this.usersService.findOne(userId);
    }
    async getUserRole(req) {
        const userId = req.user.userId;
        return this.usersService.getUserRole(userId);
    }
    blockUser(id) {
        return this.usersService.blockUser(id);
    }
    unBlockUser(id) {
        return this.usersService.unBlockUser(id);
    }
    async updateRole(id, role) {
        return this.usersService.updateRole(id, role);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('role'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserRole", null);
__decorate([
    (0, common_1.Patch)('block/:id'),
    (0, roles_decorator_1.Roles)(user_dto_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Patch)('unblock/:id'),
    (0, roles_decorator_1.Roles)(user_dto_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "unBlockUser", null);
__decorate([
    (0, common_1.Patch)('role/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_c = typeof user_dto_1.Role !== "undefined" && user_dto_1.Role) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UsersService !== "undefined" && user_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = exports.Role = void 0;
const class_validator_1 = __webpack_require__(19);
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
    Role["LIBRARIAN"] = "LIBRARIAN";
})(Role || (exports.Role = Role = {}));
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(3);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetUser = void 0;
const common_1 = __webpack_require__(3);
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
        return request.user[data];
    }
    return request.user;
});


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const mail_service_1 = __webpack_require__(12);
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [mail_service_1.MailService],
        exports: [mail_service_1.MailService],
    })
], MailModule);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(26);
const passport_jwt_1 = __webpack_require__(34);
const config_1 = __webpack_require__(4);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    const token = request.cookies?.jwt;
                    if (!token) {
                        return null;
                    }
                    return token;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }
    async validate(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 34 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BooksModule = void 0;
const common_1 = __webpack_require__(3);
const books_service_1 = __webpack_require__(36);
const books_controller_1 = __webpack_require__(37);
const prisma_module_1 = __webpack_require__(5);
const bulk_books_service_1 = __webpack_require__(42);
let BooksModule = class BooksModule {
};
exports.BooksModule = BooksModule;
exports.BooksModule = BooksModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [books_controller_1.BookController],
        exports: [books_service_1.BookService, bulk_books_service_1.BulkBooksService],
        providers: [books_service_1.BookService, bulk_books_service_1.BulkBooksService],
    })
], BooksModule);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(6);
let BookService = class BookService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        return await this.prisma.book.findUnique({
            where: { id },
            include: {
                pnfs: true,
                authors: true
            }
        });
    }
    async findAll(query) {
        const take = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * take;
        const search = query.search;
        const pnf = query.pnf;
        const authorsParam = query.authors;
        const andConditions = [];
        if (pnf && pnf.trim() !== "") {
            andConditions.push({
                pnfs: {
                    some: {
                        pnf: pnf.trim().toUpperCase()
                    }
                }
            });
        }
        if (authorsParam && authorsParam.trim() !== "") {
            const authorIdsArray = authorsParam.split(',').map((id) => id.trim()).filter(Boolean);
            if (authorIdsArray.length > 0) {
                andConditions.push({
                    authors: {
                        some: {
                            id: {
                                in: authorIdsArray
                            }
                        }
                    }
                });
            }
        }
        if (search && search.trim() !== "") {
            andConditions.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    {
                        authors: {
                            some: {
                                name: { contains: search, mode: 'insensitive' }
                            }
                        }
                    }
                ]
            });
        }
        const where = andConditions.length > 0 ? { AND: andConditions } : {};
        const totalCount = await this.prisma.book.count({ where });
        const totalPages = Math.ceil(totalCount / take);
        const data = await this.prisma.book.findMany({
            take,
            skip,
            where,
            include: {
                pnfs: true,
                authors: true
            },
            orderBy: { id: 'desc' }
        });
        return { data, totalPages };
    }
    async create(data, req) {
        const { title, description, routepdf, routeimg, pnfs = [], authorIds = [] } = data;
        const book = await this.prisma.book.create({
            data: {
                title,
                description,
                routepdf,
                routeimg,
                authors: {
                    connect: authorIds.map(id => ({ id }))
                },
                pnfs: {
                    create: pnfs.map(pnfItem => ({ pnf: pnfItem }))
                }
            }
        });
        await this.prisma.operation.create({
            data: {
                userId: req.user.userId,
                ip: req.ip,
                action: `creó el libro Digital ${title}`
            }
        });
        return { message: 'Libro Creado', book };
    }
    async delete(id, req) {
        const book = await this.prisma.book.findFirst({ where: { id } });
        if (!book)
            throw new common_1.NotFoundException('El libro no existe');
        await this.prisma.bookPnf.deleteMany({ where: { bookId: id } });
        await this.prisma.savedBook.deleteMany({ where: { bookId: id } });
        await this.prisma.operation.create({
            data: {
                userId: req.user.userId,
                ip: req.ip,
                action: `Eliminó el libro Digital ${book.title}`
            }
        });
        return {
            book: await this.prisma.book.delete({ where: { id } }),
            message: 'Libro Eliminado'
        };
    }
    async edit(id, data, req) {
        const book = await this.prisma.book.findFirst({ where: { id } });
        if (!book)
            throw new common_1.NotFoundException('El libro no existe');
        const { title, description, routepdf, routeimg, pnfs, authorIds } = data;
        const updateData = {
            title,
            description,
            routepdf,
            routeimg
        };
        if (authorIds) {
            updateData.authors = {
                set: authorIds.map(authId => ({ id: authId }))
            };
        }
        if (pnfs) {
            await this.prisma.bookPnf.deleteMany({ where: { bookId: id } });
            updateData.pnfs = {
                create: pnfs.map(pnfItem => ({ pnf: pnfItem }))
            };
        }
        await this.prisma.operation.create({
            data: {
                userId: req.user.userId,
                ip: req.ip,
                action: `Editó el libro Digital ${title || book.title}`
            }
        });
        return {
            book: await this.prisma.book.update({
                where: { id },
                data: updateData,
                include: { pnfs: true, authors: true }
            }),
            message: 'Libro editado'
        };
    }
    async saveToUser(userId, bookId) {
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('El libro no existe');
        try {
            return {
                message: "Libro Guardado",
                data: await this.prisma.savedBook.create({
                    data: { userId, bookId },
                })
            };
        }
        catch (error) {
            throw new common_1.ConflictException('Ya tienes este libro guardado');
        }
    }
    async removeFromUser(userId, bookId) {
        const savedBook = await this.prisma.savedBook.findMany({
            where: { userId, bookId }
        });
        if (savedBook.length === 0)
            throw new common_1.NotFoundException('El libro no estaba guardado por este usuario');
        await this.prisma.savedBook.delete({
            where: { id: savedBook[0].id, userId }
        });
        return { message: 'Libro eliminado', data: savedBook };
    }
    async getVerifyLike(userId, bookId) {
        const savedBook = await this.prisma.savedBook.findMany({
            where: { userId, bookId }
        });
        return savedBook[0] ? true : false;
    }
    async getSavedBooks(userId, query) {
        const where = { userId };
        const page = parseInt(query.page) || 1;
        const take = parseInt(query.limit) || 10;
        const skip = (page - 1) * take;
        if (query.search) {
            where.OR = [
                { book: { title: { contains: query.search, mode: 'insensitive' } } }
            ];
        }
        const totalCount = await this.prisma.savedBook.count({ where });
        const totalPages = Math.ceil(totalCount / take);
        const data = await this.prisma.savedBook.findMany({
            where,
            take,
            skip,
            include: {
                book: {
                    include: { pnfs: true, authors: true }
                }
            },
        });
        return { data, totalPages };
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], BookService);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookController = void 0;
const common_1 = __webpack_require__(3);
const books_service_1 = __webpack_require__(36);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_guard_1 = __webpack_require__(38);
const roles_decorator_1 = __webpack_require__(30);
const client_1 = __webpack_require__(7);
const deleteFile_1 = __webpack_require__(39);
let BookController = class BookController {
    constructor(bookService) {
        this.bookService = bookService;
    }
    findAll(query) {
        return this.bookService.findAll(query);
    }
    getMyLibrary(req, query) {
        return this.bookService.getSavedBooks(req.user.userId, query);
    }
    findOne(id) {
        return this.bookService.findOne(id);
    }
    async create(data, req) {
        if (!data.routepdf) {
            throw new common_1.NotFoundException('La ruta o enlace del PDF es requerida');
        }
        console.log('Registrando libro multi-autor y multi-pnf en la BD:', data.title);
        return this.bookService.create(data, req);
    }
    async delete(id, req) {
        const book = await this.bookService.findOne(id);
        if (!book) {
            throw new common_1.NotFoundException('El libro no existe');
        }
        const bucketName = 'pdfs';
        if (book.routepdf && book.routepdf.includes(`${bucketName}/`)) {
            const supabasePath = book.routepdf.split(`${bucketName}/`)[1];
            if (supabasePath) {
                try {
                    await (0, deleteFile_1.deleteFile)(supabasePath, 'pdfs');
                }
                catch (error) {
                    console.error('No se pudo borrar el archivo en Supabase:', error);
                }
            }
        }
        return this.bookService.delete(id, req);
    }
    async update(id, data, req) {
        return this.bookService.edit(id, data, req);
    }
    verifyLike(req, bookId) {
        return this.bookService.getVerifyLike(req.user.userId, bookId);
    }
    removeLike(req, bookId) {
        return this.bookService.removeFromUser(req.user.userId, bookId);
    }
    save(req, bookId) {
        return this.bookService.saveToUser(req.user.userId, bookId);
    }
};
exports.BookController = BookController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-library'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "getMyLibrary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('verify-like/:bookId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "verifyLike", null);
__decorate([
    (0, common_1.Post)('remove-like/:bookId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "removeLike", null);
__decorate([
    (0, common_1.Post)('save/:bookId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "save", null);
exports.BookController = BookController = __decorate([
    (0, common_1.Controller)('book'),
    __metadata("design:paramtypes", [typeof (_a = typeof books_service_1.BookService !== "undefined" && books_service_1.BookService) === "function" ? _a : Object])
], BookController);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(3);
const core_1 = __webpack_require__(1);
const roles_decorator_1 = __webpack_require__(30);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('No hay usuario autenticado');
        }
        const userRole = user.role;
        if (!requiredRoles.includes(userRole)) {
            throw new common_1.ForbiddenException(`Se requiere al menos uno de los siguientes roles: ${requiredRoles.join(', ')}. Tu rol actual: ${userRole}`);
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteFile = deleteFile;
const supabase_1 = __webpack_require__(40);
async function deleteFile(supabasePath, bucket) {
    const bucketName = bucket;
    const { data, error } = await supabase_1.supabase.storage
        .from(bucketName)
        .remove([supabasePath]);
    if (error) {
        throw new Error(`Error al eliminar archivo de Supabase: ${error.message}`);
    }
    console.log(`Archivo eliminado con éxito de Supabase: ${supabasePath}`);
}


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.supabase = void 0;
const supabase_js_1 = __webpack_require__(41);
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);


/***/ }),
/* 41 */
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BulkBooksService = void 0;
const common_1 = __webpack_require__(3);
const books_service_1 = __webpack_require__(36);
const prisma_service_1 = __webpack_require__(6);
let BulkBooksService = class BulkBooksService {
    constructor(bookService, prisma) {
        this.bookService = bookService;
        this.prisma = prisma;
    }
    async processBulkOperations(operations, req) {
        const summary = {
            created: 0, updated: 0, deleted: 0, failed: 0,
            errors: [], successLog: []
        };
        for (const op of operations) {
            try {
                let resolvedAuthorIds = [];
                if (op.authors && Array.isArray(op.authors)) {
                    for (const authorName of op.authors) {
                        const cleanedName = authorName.trim();
                        if (!cleanedName)
                            continue;
                        let foundAuthor = await this.prisma.author.findFirst({
                            where: { name: { equals: cleanedName, mode: 'insensitive' } }
                        });
                        if (!foundAuthor) {
                            foundAuthor = await this.prisma.author.create({ data: { name: cleanedName } });
                            summary.successLog.push(`[IA Autocreate] Autor creado en lote: "${cleanedName}"`);
                        }
                        resolvedAuthorIds.push(foundAuthor.id);
                    }
                }
                const resolvedPnfs = Array.isArray(op.pnfs) && op.pnfs.length > 0 ? op.pnfs : ['GENERAL'];
                switch (op.action) {
                    case 'CREATE':
                        if (!op.title)
                            throw new Error('Falta el título para crear el libro.');
                        await this.bookService.create({
                            title: op.title,
                            description: op.description || 'Registrado por lote de IA',
                            routepdf: op.routepdf || 'https://link-pendiente-subida.com',
                            routeimg: op.routeimg || null,
                            pnfs: resolvedPnfs,
                            authorIds: resolvedAuthorIds
                        }, req);
                        summary.created++;
                        summary.successLog.push(`Creado: "${op.title}"`);
                        break;
                    case 'UPDATE':
                        if (!op.searchLookup)
                            throw new Error('No se especificó qué libro editar.');
                        const bookToEdit = await this.prisma.book.findFirst({
                            where: { title: { contains: op.searchLookup, mode: 'insensitive' } }
                        });
                        if (!bookToEdit)
                            throw new common_1.NotFoundException(`No se encontró el libro para editar.`);
                        const updatePayload = {};
                        if (op.title)
                            updatePayload.title = op.title;
                        if (op.description)
                            updatePayload.description = op.description;
                        if (op.routepdf)
                            updatePayload.routepdf = op.routepdf;
                        if (op.routeimg)
                            updatePayload.routeimg = op.routeimg;
                        if (op.pnfs && op.pnfs.length > 0)
                            updatePayload.pnfs = op.pnfs;
                        if (resolvedAuthorIds.length > 0)
                            updatePayload.authorIds = resolvedAuthorIds;
                        await this.bookService.edit(bookToEdit.id, updatePayload, req);
                        summary.updated++;
                        summary.successLog.push(`Editado: "${bookToEdit.title}"`);
                        break;
                    case 'DELETE':
                        if (!op.searchLookup)
                            throw new Error('No se especificó qué libro eliminar.');
                        const bookToDelete = await this.prisma.book.findFirst({
                            where: { title: { contains: op.searchLookup, mode: 'insensitive' } }
                        });
                        if (!bookToDelete)
                            throw new common_1.NotFoundException(`No se encontró el libro para eliminar.`);
                        await this.bookService.delete(bookToDelete.id, req);
                        summary.deleted++;
                        summary.successLog.push(`Eliminado: "${bookToDelete.title}"`);
                        break;
                    default:
                        throw new Error(`Acción desconocida: ${op.action}`);
                }
            }
            catch (err) {
                summary.failed++;
                const target = op.title || op.searchLookup || 'Libro indeterminado';
                summary.errors.push(`Error en [${op.action}] sobre "${target}": ${err.message}`);
            }
        }
        return {
            message: `Lote ejecutado. Creados: ${summary.created}, Editados: ${summary.updated}, Borrados: ${summary.deleted}, Fallidos: ${summary.failed}.`,
            summary
        };
    }
};
exports.BulkBooksService = BulkBooksService;
exports.BulkBooksService = BulkBooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof books_service_1.BookService !== "undefined" && books_service_1.BookService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], BulkBooksService);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryModule = void 0;
const common_1 = __webpack_require__(3);
const inventory_service_1 = __webpack_require__(44);
const inventory_controller_1 = __webpack_require__(48);
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        controllers: [inventory_controller_1.InventoryController],
        providers: [inventory_service_1.InventoryService],
    })
], InventoryModule);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(45);
const getPagination_1 = __webpack_require__(16);
const getDifference_1 = __importDefault(__webpack_require__(46));
const copies_1 = __webpack_require__(47);
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveAuthorIds(tx, ids = [], names = []) {
        const resolved = [];
        for (const id of ids) {
            if (id && !resolved.includes(id))
                resolved.push(id);
        }
        for (const name of names) {
            const cleaned = `${name}`.trim();
            if (!cleaned)
                continue;
            let author = await tx.author.findFirst({
                where: { name: { equals: cleaned, mode: 'insensitive' } }
            });
            if (!author) {
                author = await tx.author.create({ data: { name: cleaned } });
            }
            if (!resolved.includes(author.id))
                resolved.push(author.id);
        }
        return resolved;
    }
    async resolveCategoryIds(tx, ids = [], names = []) {
        const resolved = [];
        for (const id of ids) {
            if (id && !resolved.includes(id))
                resolved.push(id);
        }
        for (const name of names) {
            const cleaned = `${name}`.trim();
            if (!cleaned)
                continue;
            let category = await tx.category.findFirst({
                where: { name: { equals: cleaned, mode: 'insensitive' } }
            });
            if (!category) {
                category = await tx.category.create({ data: { name: cleaned } });
            }
            if (!resolved.includes(category.id))
                resolved.push(category.id);
        }
        return resolved;
    }
    async resolveTypeId(tx, typeId, typeName) {
        let resolvedTypeId = typeId;
        if (!resolvedTypeId && typeName && typeName.trim() !== '') {
            const cleanedTypeName = typeName.trim();
            let itemType = await tx.itemType.findFirst({
                where: { name: { equals: cleanedTypeName, mode: 'insensitive' } }
            });
            if (!itemType) {
                itemType = await tx.itemType.create({ data: { name: cleanedTypeName } });
            }
            resolvedTypeId = itemType.id;
        }
        return resolvedTypeId;
    }
    async createCopies(tx, item, quantity, requestedCodes = [], extra = {}) {
        return (0, copies_1.createItemCopies)(tx, item, quantity, requestedCodes, extra);
    }
    async reconcileCopies(tx, item, targetTotal, requestedCodes = []) {
        const copies = await tx.itemCopy.findMany({
            where: { itemId: item.id },
            orderBy: { createdAt: 'asc' }
        });
        if (copies.length === 0)
            return false;
        const active = copies.filter((c) => c.status !== client_1.CopyStatus.BAJA);
        const diff = targetTotal - active.length;
        if (diff > 0) {
            await this.createCopies(tx, item, diff, requestedCodes);
        }
        else if (diff < 0) {
            const removable = active.filter((c) => c.status !== client_1.CopyStatus.PRESTADO);
            if (Math.abs(diff) > removable.length) {
                throw new common_1.HttpException('Hay préstamos pendientes que impiden que reduzcas tanto el stock', common_1.HttpStatus.BAD_REQUEST);
            }
            const ordered = [
                ...removable.filter((c) => c.status === client_1.CopyStatus.DISPONIBLE),
                ...removable.filter((c) => c.status !== client_1.CopyStatus.DISPONIBLE)
            ];
            for (let i = 0; i < Math.abs(diff); i += 1) {
                await tx.itemCopy.update({
                    where: { id: ordered[i].id },
                    data: { status: client_1.CopyStatus.BAJA }
                });
            }
        }
        return true;
    }
    async create(createInventoryDto) {
        return this.prisma.$transaction(async (tx) => {
            const { typeId, typeName, stock, authorId, authorName, authorIds = [], authorNames = [], categoryId, categoryName, categoryIds = [], categoryNames = [], copyCodes = [], ...restOfDto } = createInventoryDto;
            const resolvedTypeId = await this.resolveTypeId(tx, typeId, typeName);
            const resolvedAuthorIds = await this.resolveAuthorIds(tx, [
                ...(authorId ? [authorId] : []),
                ...authorIds
            ], [
                ...(authorName ? [authorName] : []),
                ...authorNames
            ]);
            const resolvedCategoryIds = await this.resolveCategoryIds(tx, [
                ...(categoryId ? [categoryId] : []),
                ...categoryIds
            ], [
                ...(categoryName ? [categoryName] : []),
                ...categoryNames
            ]);
            const parsedStock = parseInt(stock) || 0;
            const item = await tx.item.create({
                data: {
                    ...restOfDto,
                    typeId: resolvedTypeId || undefined,
                    availableStock: 0,
                    totalStock: 0,
                    status: 'DISPONIBLE',
                    authors: {
                        connect: resolvedAuthorIds.map(id => ({ id }))
                    },
                    categories: {
                        connect: resolvedCategoryIds.map(id => ({ id }))
                    }
                },
                include: {
                    type: true,
                    authors: { select: { id: true, name: true } },
                    categories: { select: { id: true, name: true } }
                }
            });
            await this.createCopies(tx, item, parsedStock, Array.isArray(copyCodes) ? copyCodes : []);
            await (0, copies_1.recalcItemStock)(tx, item.id);
            const withStock = await tx.item.findUnique({
                where: { id: item.id },
                include: {
                    type: true,
                    authors: { select: { id: true, name: true } },
                    categories: { select: { id: true, name: true } },
                    copies: { orderBy: { createdAt: 'asc' } }
                }
            });
            return { item: withStock, message: 'Item añadido exitosamente' };
        });
    }
    async findAll(query) {
        const search = query.search;
        const where = {};
        const { take, page, skip } = (0, getPagination_1.getPagination)(query);
        if (search) {
            where.AND = [
                {
                    name: { contains: search, mode: 'insensitive' },
                },
            ];
        }
        if (query.type) {
            const typeFilter = {
                type: {
                    name: { contains: query.type, mode: 'insensitive' }
                }
            };
            if (!where.AND)
                where.AND = [typeFilter];
            else
                where.AND.push(typeFilter);
        }
        if (query.categoryName) {
            const categoryFilter = {
                categories: {
                    some: {
                        name: { contains: query.categoryName, mode: 'insensitive' }
                    }
                }
            };
            if (!where.AND)
                where.AND = [categoryFilter];
            else
                where.AND.push(categoryFilter);
        }
        if (query.authorName) {
            const authorFilter = {
                authors: {
                    some: {
                        name: { contains: query.authorName, mode: 'insensitive' }
                    }
                }
            };
            if (!where.AND)
                where.AND = [authorFilter];
            else
                where.AND.push(authorFilter);
        }
        const totalPages = Math.ceil(await this.prisma.item.count({ where }) / take);
        const data = await this.prisma.item.findMany({
            where,
            skip,
            take,
            include: {
                type: true,
                authors: { select: { id: true, name: true } },
                categories: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { data, totalPages };
    }
    async findOne(id) {
        const item = await this.prisma.item.findUnique({
            where: { id },
            include: {
                type: true,
                authors: { select: { id: true, name: true } },
                categories: { select: { id: true, name: true } },
                copies: { orderBy: { createdAt: 'asc' } }
            }
        });
        if (!item)
            throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
        return { status: 'success', data: item };
    }
    async edit(id, updateInventoryDto) {
        return this.prisma.$transaction(async (tx) => {
            const existingItem = await tx.item.findUnique({ where: { id } });
            if (!existingItem)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            const { typeId, typeName, stock, authorId, authorName, authorIds, authorNames, categoryId, categoryName, categoryIds, categoryNames, copyCodes, ...restOfDto } = updateInventoryDto;
            const resolvedTypeId = await this.resolveTypeId(tx, typeId, typeName);
            const resolvedAuthorIds = await this.resolveAuthorIds(tx, [
                ...(authorId ? [authorId] : []),
                ...(authorIds ?? [])
            ], [
                ...(authorName ? [authorName] : []),
                ...(authorNames ?? [])
            ]);
            const resolvedCategoryIds = await this.resolveCategoryIds(tx, [
                ...(categoryId ? [categoryId] : []),
                ...(categoryIds ?? [])
            ], [
                ...(categoryName ? [categoryName] : []),
                ...(categoryNames ?? [])
            ]);
            const targetTotal = stock !== undefined ? parseInt(stock) : existingItem.totalStock;
            const hasCopies = await this.reconcileCopies(tx, existingItem, targetTotal, Array.isArray(copyCodes) ? copyCodes : []);
            const updateData = {
                ...restOfDto,
                typeId: resolvedTypeId || undefined,
            };
            if (!hasCopies) {
                const parsedStock = parseInt(stock) || existingItem.totalStock;
                const newValue = (0, getDifference_1.default)({
                    oldAvailableStockValue: existingItem.availableStock,
                    oldCurrentStockValue: existingItem.totalStock,
                    newStockValue: parsedStock
                });
                if (newValue < 0) {
                    throw new common_1.HttpException("Hay préstamos pendientes que impiden que reduzcas tanto el stock", common_1.HttpStatus.BAD_REQUEST);
                }
                updateData.availableStock = parsedStock;
                updateData.totalStock = newValue;
                updateData.status = 'DISPONIBLE';
            }
            if (authorIds !== undefined || authorId !== undefined || authorNames !== undefined || authorName !== undefined) {
                updateData.authors = {
                    set: resolvedAuthorIds.map(id => ({ id }))
                };
            }
            if (categoryIds !== undefined || categoryId !== undefined || categoryNames !== undefined || categoryName !== undefined) {
                updateData.categories = {
                    set: resolvedCategoryIds.map(id => ({ id }))
                };
            }
            let item = await tx.item.update({
                where: { id },
                data: updateData,
                include: {
                    type: true,
                    authors: { select: { id: true, name: true } },
                    categories: { select: { id: true, name: true } }
                }
            });
            if (hasCopies) {
                await (0, copies_1.recalcItemStock)(tx, id);
                item = await tx.item.findUnique({
                    where: { id },
                    include: {
                        type: true,
                        authors: { select: { id: true, name: true } },
                        categories: { select: { id: true, name: true } }
                    }
                });
            }
            return { item, message: 'Item actualizado con éxito' };
        });
    }
    async delete(id) {
        await this.prisma.itemOperation.deleteMany({ where: { itemId: id } });
        const item = await this.prisma.item.delete({ where: { id } });
        return { item, message: 'Item Eliminado correctamente' };
    }
    async addCopies(id, dto) {
        return this.prisma.$transaction(async (tx) => {
            const item = await tx.item.findUnique({ where: { id } });
            if (!item)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            const requestedCodes = Array.isArray(dto.codes) ? dto.codes : [];
            const quantity = dto.quantity !== undefined ? parseInt(dto.quantity) : requestedCodes.length;
            if (!quantity || quantity <= 0) {
                throw new common_1.BadRequestException('Debes indicar al menos un ejemplar');
            }
            await this.createCopies(tx, item, quantity, requestedCodes, {
                location: dto.location,
                observations: dto.observations
            });
            const summary = await (0, copies_1.recalcItemStock)(tx, id);
            const copies = await tx.itemCopy.findMany({
                where: { itemId: id },
                orderBy: { createdAt: 'asc' }
            });
            return { status: 'success', message: 'Ejemplares agregados', data: { copies, summary } };
        });
    }
    async findCopies(id) {
        const item = await this.prisma.item.findUnique({ where: { id } });
        if (!item)
            throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
        const copies = await this.prisma.itemCopy.findMany({
            where: { itemId: id },
            orderBy: { createdAt: 'asc' }
        });
        return { status: 'success', data: copies };
    }
    async updateCopy(copyId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const copy = await tx.itemCopy.findUnique({ where: { id: copyId } });
            if (!copy)
                throw new common_1.HttpException('Ejemplar no encontrado', common_1.HttpStatus.NOT_FOUND);
            const data = {};
            if (dto.code !== undefined && `${dto.code}`.trim())
                data.code = `${dto.code}`.trim();
            if (dto.status !== undefined)
                data.status = dto.status;
            if (dto.location !== undefined)
                data.location = dto.location;
            if (dto.observations !== undefined)
                data.observations = dto.observations;
            let updated;
            try {
                updated = await tx.itemCopy.update({ where: { id: copyId }, data });
            }
            catch (error) {
                if (error?.code === 'P2002') {
                    throw new common_1.HttpException('Ya existe un ejemplar con ese código', common_1.HttpStatus.CONFLICT);
                }
                throw error;
            }
            const summary = await (0, copies_1.recalcItemStock)(tx, copy.itemId);
            return { status: 'success', message: 'Ejemplar actualizado', data: { copy: updated, summary } };
        });
    }
    async removeCopy(copyId) {
        return this.prisma.$transaction(async (tx) => {
            const copy = await tx.itemCopy.findUnique({ where: { id: copyId } });
            if (!copy)
                throw new common_1.HttpException('Ejemplar no encontrado', common_1.HttpStatus.NOT_FOUND);
            if (copy.status === client_1.CopyStatus.PRESTADO) {
                throw new common_1.BadRequestException('No puedes eliminar un ejemplar que está prestado');
            }
            await tx.itemCopy.delete({ where: { id: copyId } });
            const summary = await (0, copies_1.recalcItemStock)(tx, copy.itemId);
            return { status: 'success', message: 'Ejemplar eliminado', data: { summary } };
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InventoryService);


/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("prisma/prisma.service");

/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = getStockDifference;
function getStockDifference({ newStockValue, oldCurrentStockValue, oldAvailableStockValue }) {
    const difference = oldCurrentStockValue - oldAvailableStockValue;
    const newValue = newStockValue - difference;
    return newValue;
}


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bookCopyBase = bookCopyBase;
exports.itemCopyBase = itemCopyBase;
exports.buildCopyCodes = buildCopyCodes;
exports.createBookCopies = createBookCopies;
exports.createItemCopies = createItemCopies;
exports.recalcBookStock = recalcBookStock;
exports.recalcItemStock = recalcItemStock;
const client_1 = __webpack_require__(7);
function sanitize(seed) {
    const clean = `${seed}`.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return clean.slice(0, 8) || 'GEN';
}
function bookCopyBase(book) {
    return `LIB-${sanitize(book.isbn && book.isbn.trim() ? book.isbn : book.id)}`;
}
function itemCopyBase(item) {
    return `ART-${sanitize(item.code && `${item.code}`.trim() ? item.code : item.id)}`;
}
function nextSequentialCode(base, used) {
    let n = 1;
    for (const code of used) {
        if (code.startsWith(`${base}-`)) {
            const parsed = parseInt(code.slice(base.length + 1), 10);
            if (!Number.isNaN(parsed) && parsed >= n)
                n = parsed + 1;
        }
    }
    let candidate;
    do {
        candidate = `${base}-${String(n).padStart(4, '0')}`;
        n += 1;
    } while (used.has(candidate.toUpperCase()));
    return candidate;
}
function uniquify(requested, used) {
    let candidate = requested.trim();
    if (!candidate)
        return candidate;
    let suffix = 1;
    while (used.has(candidate.toUpperCase())) {
        suffix += 1;
        candidate = `${requested.trim()}-${suffix}`;
    }
    return candidate;
}
function buildCopyCodes(base, quantity, existing = [], requestedCodes = []) {
    const used = new Set([...existing].map((c) => c.toUpperCase()));
    const requested = (requestedCodes ?? []).map((c) => `${c}`.trim()).filter(Boolean);
    const codes = [];
    for (let i = 0; i < quantity; i += 1) {
        let code = requested[i];
        code = code ? uniquify(code, used) : nextSequentialCode(base, used);
        codes.push(code);
        used.add(code.toUpperCase());
    }
    return codes;
}
async function createBookCopies(tx, book, quantity, requestedCodes = [], extra = {}) {
    if (quantity <= 0)
        return [];
    const existing = await tx.bookCopy.findMany({
        where: { bookId: book.id },
        select: { code: true },
    });
    const codes = buildCopyCodes(bookCopyBase(book), quantity, existing.map((c) => c.code), requestedCodes);
    const created = [];
    for (const code of codes) {
        created.push(await tx.bookCopy.create({
            data: {
                code,
                bookId: book.id,
                status: client_1.CopyStatus.DISPONIBLE,
                location: extra.location ?? null,
                observations: extra.observations ?? null,
            },
        }));
    }
    return created;
}
async function createItemCopies(tx, item, quantity, requestedCodes = [], extra = {}) {
    if (quantity <= 0)
        return [];
    const existing = await tx.itemCopy.findMany({
        where: { itemId: item.id },
        select: { code: true },
    });
    const codes = buildCopyCodes(itemCopyBase(item), quantity, existing.map((c) => c.code), requestedCodes);
    const created = [];
    for (const code of codes) {
        created.push(await tx.itemCopy.create({
            data: {
                code,
                itemId: item.id,
                status: client_1.CopyStatus.DISPONIBLE,
                location: extra.location ?? null,
                observations: extra.observations ?? null,
            },
        }));
    }
    return created;
}
function summarize(copies) {
    const summary = { total: 0, available: 0, loaned: 0, maintenance: 0 };
    for (const copy of copies) {
        if (copy.status === client_1.CopyStatus.BAJA)
            continue;
        summary.total += 1;
        if (copy.status === client_1.CopyStatus.DISPONIBLE)
            summary.available += 1;
        else if (copy.status === client_1.CopyStatus.PRESTADO)
            summary.loaned += 1;
        else if (copy.status === client_1.CopyStatus.MANTENIMIENTO)
            summary.maintenance += 1;
    }
    return summary;
}
async function recalcBookStock(tx, bookId) {
    const copies = await tx.bookCopy.findMany({ where: { bookId }, select: { status: true } });
    const summary = summarize(copies);
    const status = summary.available > 0
        ? 'DISPONIBLE'
        : summary.maintenance > 0 && summary.loaned === 0
            ? 'MANTENIMIENTO'
            : 'AGOTADO';
    await tx.physicalBook.update({
        where: { id: bookId },
        data: { totalStock: summary.total, availableStock: summary.available, status },
    });
    return { ...summary, status };
}
async function recalcItemStock(tx, itemId) {
    const copies = await tx.itemCopy.findMany({ where: { itemId }, select: { status: true } });
    const summary = summarize(copies);
    const status = summary.available > 0
        ? 'DISPONIBLE'
        : summary.maintenance > 0 && summary.loaned === 0
            ? 'MANTENIMIENTO'
            : 'AGOTADO';
    await tx.item.update({
        where: { id: itemId },
        data: { totalStock: summary.total, availableStock: summary.available, status },
    });
    return { ...summary, status };
}


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryController = void 0;
const common_1 = __webpack_require__(3);
const inventory_service_1 = __webpack_require__(44);
const edit_item_dto_1 = __webpack_require__(49);
const create_inventory_dto_1 = __webpack_require__(51);
const client_1 = __webpack_require__(7);
const roles_guard_1 = __webpack_require__(38);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_decorator_1 = __webpack_require__(30);
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    create(createInventoryDto) {
        return this.inventoryService.create(createInventoryDto);
    }
    findAll(query) {
        return this.inventoryService.findAll(query);
    }
    findCopies(id) {
        return this.inventoryService.findCopies(id);
    }
    addCopies(id, dto) {
        return this.inventoryService.addCopies(id, dto);
    }
    updateCopy(copyId, dto) {
        return this.inventoryService.updateCopy(copyId, dto);
    }
    removeCopy(copyId) {
        return this.inventoryService.removeCopy(copyId);
    }
    findOne(id) {
        return this.inventoryService.findOne(id);
    }
    edit(id, updateInventoryDto) {
        return this.inventoryService.edit(id, updateInventoryDto);
    }
    delete(id) {
        return this.inventoryService.delete(id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_inventory_dto_1.CreateInventoryDto !== "undefined" && create_inventory_dto_1.CreateInventoryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/copies'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findCopies", null);
__decorate([
    (0, common_1.Post)(':id/copies'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "addCopies", null);
__decorate([
    (0, common_1.Patch)('copies/:copyId'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('copyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateCopy", null);
__decorate([
    (0, common_1.Delete)('copies/:copyId'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('copyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "removeCopy", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof edit_item_dto_1.EditItemInventory !== "undefined" && edit_item_dto_1.EditItemInventory) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "edit", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "delete", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [typeof (_a = typeof inventory_service_1.InventoryService !== "undefined" && inventory_service_1.InventoryService) === "function" ? _a : Object])
], InventoryController);


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditItemInventory = void 0;
const swagger_1 = __webpack_require__(50);
const create_inventory_dto_1 = __webpack_require__(51);
class EditItemInventory extends (0, swagger_1.PartialType)(create_inventory_dto_1.CreateInventoryDto) {
}
exports.EditItemInventory = EditItemInventory;


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateInventoryDto = void 0;
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(19);
class CreateInventoryDto {
}
exports.CreateInventoryDto = CreateInventoryDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un número entero' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un número positivo' }),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser texto' }),
    (0, class_validator_1.MaxLength)(20, { message: 'El nombre debe tener un máximo de 20 caracteres' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener mínimo 3 caracteres' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del tipo debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "typeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre del tipo debe ser texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre del tipo debe tener mínimo 2 caracteres' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "typeName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código debe ser cadena de texto' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser texto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200, { message: 'La descripción debe tener un máximo de 200 caracteres' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los autores deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ID de autor debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreateInventoryDto.prototype, "authorIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los autores deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada nombre de autor debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreateInventoryDto.prototype, "authorNames", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre del autor debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre del autor debe tener mínimo 2 caracteres' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "authorName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del autor debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "authorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las categorías deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ID de categoría debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreateInventoryDto.prototype, "categoryIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las categorías deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada nombre de categoría debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreateInventoryDto.prototype, "categoryNames", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre de la categoría debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre de la categoría debe tener mínimo 2 caracteres' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "categoryName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID de la categoría debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "categoryId", void 0);


/***/ }),
/* 52 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 53 */
/***/ ((module) => {

module.exports = require("@nestjs/serve-static");

/***/ }),
/* 54 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 55 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicalBooksModule = void 0;
const common_1 = __webpack_require__(3);
const physical_books_service_1 = __webpack_require__(57);
const physical_books_controller_1 = __webpack_require__(58);
let PhysicalBooksModule = class PhysicalBooksModule {
};
exports.PhysicalBooksModule = PhysicalBooksModule;
exports.PhysicalBooksModule = PhysicalBooksModule = __decorate([
    (0, common_1.Module)({
        controllers: [physical_books_controller_1.PhysicalBooksController],
        providers: [physical_books_service_1.PhysicalBooksService],
    })
], PhysicalBooksModule);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicalBooksService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(45);
const copies_1 = __webpack_require__(47);
let PhysicalBooksService = class PhysicalBooksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveAuthorIds(tx, ids = [], names = []) {
        const resolved = [];
        for (const id of ids) {
            if (id && !resolved.includes(id))
                resolved.push(id);
        }
        for (const name of names) {
            const cleaned = `${name}`.trim();
            if (!cleaned)
                continue;
            let author = await tx.author.findFirst({
                where: { name: { equals: cleaned, mode: 'insensitive' } }
            });
            if (!author) {
                author = await tx.author.create({ data: { name: cleaned } });
            }
            if (!resolved.includes(author.id))
                resolved.push(author.id);
        }
        return resolved;
    }
    async resolveCategoryIds(tx, ids = [], names = []) {
        const resolved = [];
        for (const id of ids) {
            if (id && !resolved.includes(id))
                resolved.push(id);
        }
        for (const name of names) {
            const cleaned = `${name}`.trim();
            if (!cleaned)
                continue;
            let category = await tx.category.findFirst({
                where: { name: { equals: cleaned, mode: 'insensitive' } }
            });
            if (!category) {
                category = await tx.category.create({ data: { name: cleaned } });
            }
            if (!resolved.includes(category.id))
                resolved.push(category.id);
        }
        return resolved;
    }
    async createCopies(tx, book, quantity, requestedCodes = [], extra = {}) {
        return (0, copies_1.createBookCopies)(tx, book, quantity, requestedCodes, extra);
    }
    async reconcileCopies(tx, book, targetTotal, requestedCodes = []) {
        const copies = await tx.bookCopy.findMany({
            where: { bookId: book.id },
            orderBy: { createdAt: 'asc' }
        });
        if (copies.length === 0)
            return false;
        const active = copies.filter((c) => c.status !== client_1.CopyStatus.BAJA);
        const loaned = active.filter((c) => c.status === client_1.CopyStatus.PRESTADO);
        const diff = targetTotal - active.length;
        if (diff > 0) {
            await this.createCopies(tx, book, diff, requestedCodes);
        }
        else if (diff < 0) {
            const removable = active.filter((c) => c.status !== client_1.CopyStatus.PRESTADO);
            if (Math.abs(diff) > removable.length) {
                throw new common_1.HttpException('Cantidad incorrecta, resuelve los préstamos del libro primero', common_1.HttpStatus.BAD_REQUEST);
            }
            const ordered = [
                ...removable.filter((c) => c.status === client_1.CopyStatus.DISPONIBLE),
                ...removable.filter((c) => c.status !== client_1.CopyStatus.DISPONIBLE)
            ];
            for (let i = 0; i < Math.abs(diff); i += 1) {
                await tx.bookCopy.update({
                    where: { id: ordered[i].id },
                    data: { status: client_1.CopyStatus.BAJA }
                });
            }
        }
        return true;
    }
    async create(createPhysicalBookDto) {
        return this.prisma.$transaction(async (tx) => {
            const { authorId, authorName, authorIds = [], authorNames = [], categoryId, categoryName, categoryIds = [], categoryNames = [], copyCodes = [], totalStock, ...restOfDto } = createPhysicalBookDto;
            const resolvedAuthorIds = await this.resolveAuthorIds(tx, [
                ...(authorId ? [authorId] : []),
                ...authorIds
            ], [
                ...(authorName ? [authorName] : []),
                ...authorNames
            ]);
            const resolvedCategoryIds = await this.resolveCategoryIds(tx, [
                ...(categoryId ? [categoryId] : []),
                ...categoryIds
            ], [
                ...(categoryName ? [categoryName] : []),
                ...categoryNames
            ]);
            const parsedTotal = parseInt(totalStock) || 0;
            const physicalBook = await tx.physicalBook.create({
                data: {
                    ...restOfDto,
                    yearOfPublication: parseInt(restOfDto.yearOfPublication) || undefined,
                    totalStock: 0,
                    availableStock: 0,
                    authors: {
                        connect: resolvedAuthorIds.map(id => ({ id }))
                    },
                    categories: {
                        connect: resolvedCategoryIds.map(id => ({ id }))
                    }
                },
                include: {
                    authors: { select: { id: true, name: true } },
                    categories: { select: { id: true, name: true } }
                }
            });
            await this.createCopies(tx, physicalBook, parsedTotal, Array.isArray(copyCodes) ? copyCodes : []);
            await (0, copies_1.recalcBookStock)(tx, physicalBook.id);
            const withStock = await tx.physicalBook.findUnique({
                where: { id: physicalBook.id },
                include: {
                    authors: { select: { id: true, name: true } },
                    categories: { select: { id: true, name: true } },
                    copies: { orderBy: { createdAt: 'asc' } }
                }
            });
            return {
                status: 'success',
                message: 'Libro físico creado exitosamente',
                data: { ...withStock }
            };
        });
    }
    async update(id, updatePhysicalBookDto) {
        return await this.prisma.$transaction(async (tx) => {
            const currentBook = await tx.physicalBook.findUnique({ where: { id } });
            if (!currentBook)
                throw new common_1.HttpException('Libro físico no encontrado', common_1.HttpStatus.NOT_FOUND);
            const { authorId, authorName, authorIds, authorNames, categoryId, categoryName, categoryIds, categoryNames, copyCodes, totalStock, ...restOfDto } = updatePhysicalBookDto;
            const resolvedAuthorIds = await this.resolveAuthorIds(tx, [
                ...(authorId ? [authorId] : []),
                ...(authorIds ?? [])
            ], [
                ...(authorName ? [authorName] : []),
                ...(authorNames ?? [])
            ]);
            const resolvedCategoryIds = await this.resolveCategoryIds(tx, [
                ...(categoryId ? [categoryId] : []),
                ...(categoryIds ?? [])
            ], [
                ...(categoryName ? [categoryName] : []),
                ...(categoryNames ?? [])
            ]);
            const targetTotal = totalStock !== undefined ? parseInt(totalStock) : currentBook.totalStock;
            const hasCopies = await this.reconcileCopies(tx, currentBook, targetTotal, Array.isArray(copyCodes) ? copyCodes : []);
            const updateData = {
                ...restOfDto,
                yearOfPublication: restOfDto.yearOfPublication !== undefined
                    ? parseInt(restOfDto.yearOfPublication)
                    : currentBook.yearOfPublication,
            };
            if (!hasCopies) {
                const currentDifference = currentBook.totalStock - currentBook.availableStock;
                const parsedTotalStock = parseInt(totalStock) || currentBook.totalStock;
                const newAvailableStock = parsedTotalStock - currentDifference;
                if (newAvailableStock < 0) {
                    throw new common_1.HttpException('Cantidad incorrecta, resuelve los préstamos del libro primero', common_1.HttpStatus.BAD_REQUEST);
                }
                updateData.totalStock = parsedTotalStock;
                updateData.availableStock = newAvailableStock;
            }
            if (authorIds !== undefined || authorId !== undefined || authorNames !== undefined || authorName !== undefined) {
                updateData.authors = {
                    set: resolvedAuthorIds.map(id => ({ id }))
                };
            }
            if (categoryIds !== undefined || categoryId !== undefined || categoryNames !== undefined || categoryName !== undefined) {
                updateData.categories = {
                    set: resolvedCategoryIds.map(id => ({ id }))
                };
            }
            let physicalBook = await tx.physicalBook.update({
                where: { id },
                data: updateData,
                include: {
                    authors: { select: { id: true, name: true } },
                    categories: { select: { id: true, name: true } }
                }
            });
            if (hasCopies) {
                await (0, copies_1.recalcBookStock)(tx, id);
                physicalBook = await tx.physicalBook.findUnique({
                    where: { id },
                    include: {
                        authors: { select: { id: true, name: true } },
                        categories: { select: { id: true, name: true } }
                    }
                });
            }
            return {
                status: 'success',
                message: 'Libro físico actualizado exitosamente',
                data: { ...physicalBook }
            };
        });
    }
    async findOne(id) {
        const physicalBook = await this.prisma.physicalBook.findUnique({
            where: { id },
            include: {
                authors: { select: { id: true, name: true } },
                categories: { select: { id: true, name: true } },
                copies: { orderBy: { createdAt: 'asc' } }
            }
        });
        if (!physicalBook)
            throw new common_1.HttpException('Libro físico no encontrado', common_1.HttpStatus.NOT_FOUND);
        return { status: 'success', data: physicalBook };
    }
    async addCopies(id, dto) {
        return this.prisma.$transaction(async (tx) => {
            const book = await tx.physicalBook.findUnique({ where: { id } });
            if (!book)
                throw new common_1.HttpException('Libro físico no encontrado', common_1.HttpStatus.NOT_FOUND);
            const requestedCodes = Array.isArray(dto.codes) ? dto.codes : [];
            const quantity = dto.quantity !== undefined ? parseInt(dto.quantity) : requestedCodes.length;
            if (!quantity || quantity <= 0) {
                throw new common_1.BadRequestException('Debes indicar al menos un ejemplar');
            }
            await this.createCopies(tx, book, quantity, requestedCodes, {
                location: dto.location,
                observations: dto.observations
            });
            const summary = await (0, copies_1.recalcBookStock)(tx, id);
            const copies = await tx.bookCopy.findMany({
                where: { bookId: id },
                orderBy: { createdAt: 'asc' }
            });
            return { status: 'success', message: 'Ejemplares agregados', data: { copies, summary } };
        });
    }
    async findCopies(id) {
        const book = await this.prisma.physicalBook.findUnique({ where: { id } });
        if (!book)
            throw new common_1.HttpException('Libro físico no encontrado', common_1.HttpStatus.NOT_FOUND);
        const copies = await this.prisma.bookCopy.findMany({
            where: { bookId: id },
            orderBy: { createdAt: 'asc' }
        });
        return { status: 'success', data: copies };
    }
    async updateCopy(copyId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const copy = await tx.bookCopy.findUnique({ where: { id: copyId } });
            if (!copy)
                throw new common_1.HttpException('Ejemplar no encontrado', common_1.HttpStatus.NOT_FOUND);
            const data = {};
            if (dto.code !== undefined && `${dto.code}`.trim())
                data.code = `${dto.code}`.trim();
            if (dto.status !== undefined)
                data.status = dto.status;
            if (dto.location !== undefined)
                data.location = dto.location;
            if (dto.observations !== undefined)
                data.observations = dto.observations;
            let updated;
            try {
                updated = await tx.bookCopy.update({ where: { id: copyId }, data });
            }
            catch (error) {
                if (error?.code === 'P2002') {
                    throw new common_1.HttpException('Ya existe un ejemplar con ese código', common_1.HttpStatus.CONFLICT);
                }
                throw error;
            }
            const summary = await (0, copies_1.recalcBookStock)(tx, copy.bookId);
            return { status: 'success', message: 'Ejemplar actualizado', data: { copy: updated, summary } };
        });
    }
    async removeCopy(copyId) {
        return this.prisma.$transaction(async (tx) => {
            const copy = await tx.bookCopy.findUnique({ where: { id: copyId } });
            if (!copy)
                throw new common_1.HttpException('Ejemplar no encontrado', common_1.HttpStatus.NOT_FOUND);
            if (copy.status === client_1.CopyStatus.PRESTADO) {
                throw new common_1.BadRequestException('No puedes eliminar un ejemplar que está prestado');
            }
            await tx.bookCopy.delete({ where: { id: copyId } });
            const summary = await (0, copies_1.recalcBookStock)(tx, copy.bookId);
            return { status: 'success', message: 'Ejemplar eliminado', data: { summary } };
        });
    }
    async findAll(query) {
        const take = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * take;
        const search = query.search;
        const where = {};
        query.pnf = query.pnf == 'undefined' || query.pnf == '' ? 'todos' : query.pnf;
        query.genre = query.genre == 'undefined' ? '' : query.genre;
        if (search) {
            where.AND = [{ title: { contains: search, mode: 'insensitive' } }];
        }
        if (query.genre) {
            const genreFilter = {
                categories: {
                    some: {
                        name: {
                            contains: query.genre,
                            mode: 'insensitive'
                        }
                    }
                }
            };
            where.AND ? where.AND.push(genreFilter) : where.AND = [genreFilter];
        }
        if (query.authorName) {
            const authorFilter = {
                authors: {
                    some: {
                        name: { contains: query.authorName, mode: 'insensitive' }
                    }
                }
            };
            where.AND ? where.AND.push(authorFilter) : where.AND = [authorFilter];
        }
        if (query.pnf != 'todos') {
            const pnfFilter = { pnf: query.pnf };
            where.AND ? where.AND.push(pnfFilter) : where.AND = [pnfFilter];
        }
        const totalPages = await this.prisma.physicalBook.count({ where });
        const data = await this.prisma.physicalBook.findMany({
            where, take, skip, include: {
                authors: { select: { id: true, name: true } },
                categories: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { data, totalPages };
    }
    async remove(id) {
        await this.prisma.bookOperation.deleteMany({ where: { bookId: id } });
        await this.prisma.physicalBook.delete({ where: { id } });
        return { status: 'success', message: 'Libro físico eliminado' };
    }
};
exports.PhysicalBooksService = PhysicalBooksService;
exports.PhysicalBooksService = PhysicalBooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PhysicalBooksService);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicalBooksController = void 0;
const common_1 = __webpack_require__(3);
const physical_books_service_1 = __webpack_require__(57);
const create_physical_book_dto_1 = __webpack_require__(59);
const update_physical_book_dto_1 = __webpack_require__(60);
const client_1 = __webpack_require__(7);
const roles_guard_1 = __webpack_require__(38);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_decorator_1 = __webpack_require__(30);
let PhysicalBooksController = class PhysicalBooksController {
    constructor(physicalBooksService) {
        this.physicalBooksService = physicalBooksService;
    }
    create(createPhysicalBookDto) {
        return this.physicalBooksService.create(createPhysicalBookDto);
    }
    findAll(query) {
        return this.physicalBooksService.findAll(query);
    }
    findCopies(id) {
        return this.physicalBooksService.findCopies(id);
    }
    addCopies(id, dto) {
        return this.physicalBooksService.addCopies(id, dto);
    }
    updateCopy(copyId, dto) {
        return this.physicalBooksService.updateCopy(copyId, dto);
    }
    removeCopy(copyId) {
        return this.physicalBooksService.removeCopy(copyId);
    }
    findOne(id) {
        return this.physicalBooksService.findOne(id);
    }
    update(id, updatePhysicalBookDto) {
        return this.physicalBooksService.update(id, updatePhysicalBookDto);
    }
    remove(id) {
        return this.physicalBooksService.remove(id);
    }
};
exports.PhysicalBooksController = PhysicalBooksController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_physical_book_dto_1.CreatePhysicalBookDto !== "undefined" && create_physical_book_dto_1.CreatePhysicalBookDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/copies'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "findCopies", null);
__decorate([
    (0, common_1.Post)(':id/copies'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "addCopies", null);
__decorate([
    (0, common_1.Patch)('copies/:copyId'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('copyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "updateCopy", null);
__decorate([
    (0, common_1.Delete)('copies/:copyId'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('copyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "removeCopy", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_physical_book_dto_1.UpdatePhysicalBookDto !== "undefined" && update_physical_book_dto_1.UpdatePhysicalBookDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "remove", null);
exports.PhysicalBooksController = PhysicalBooksController = __decorate([
    (0, common_1.Controller)('physical-book'),
    __metadata("design:paramtypes", [typeof (_a = typeof physical_books_service_1.PhysicalBooksService !== "undefined" && physical_books_service_1.PhysicalBooksService) === "function" ? _a : Object])
], PhysicalBooksController);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePhysicalBookDto = void 0;
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(19);
const client_1 = __webpack_require__(7);
class CreatePhysicalBookDto {
}
exports.CreatePhysicalBookDto = CreatePhysicalBookDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'El título del libro debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre del libro debe tener mínimo 3 caracteres' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código ISBN debe ser cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "isbn", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)({ message: 'El año de publicación debe ser un número entero' }),
    (0, class_validator_1.IsPositive)({ message: 'El año de publicación debe ser un número positivo' }),
    __metadata("design:type", Number)
], CreatePhysicalBookDto.prototype, "yearOfPublication", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los autores deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ID de autor debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreatePhysicalBookDto.prototype, "authorIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los autores deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada nombre de autor debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreatePhysicalBookDto.prototype, "authorNames", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre del autor debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre del autor debe tener mínimo 2 caracteres' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "authorName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del autor debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "authorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las categorías deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ID de categoría debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreatePhysicalBookDto.prototype, "categoryIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las categorías deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada nombre de categoría debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreatePhysicalBookDto.prototype, "categoryNames", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre de la categoría debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El género literario debe tener mínimo 2 caracteres' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "categoryName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID de la categoría debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un PNF' }),
    __metadata("design:type", typeof (_a = typeof client_1.Pnf !== "undefined" && client_1.Pnf) === "function" ? _a : Object)
], CreatePhysicalBookDto.prototype, "pnf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'La editorial debe tener un mínimo de 3 caracteres' }),
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir una editorial' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "editorial", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)({ message: 'El stock debe ser un número positivo' }),
    __metadata("design:type", Number)
], CreatePhysicalBookDto.prototype, "totalStock", void 0);


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePhysicalBookDto = void 0;
const swagger_1 = __webpack_require__(50);
const create_physical_book_dto_1 = __webpack_require__(59);
class UpdatePhysicalBookDto extends (0, swagger_1.PartialType)(create_physical_book_dto_1.CreatePhysicalBookDto) {
}
exports.UpdatePhysicalBookDto = UpdatePhysicalBookDto;


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryModule = void 0;
const common_1 = __webpack_require__(3);
const category_service_1 = __webpack_require__(62);
const category_controller_1 = __webpack_require__(63);
let CategoryModule = class CategoryModule {
};
exports.CategoryModule = CategoryModule;
exports.CategoryModule = CategoryModule = __decorate([
    (0, common_1.Module)({
        controllers: [category_controller_1.CategoryController],
        providers: [category_service_1.CategoryService],
    })
], CategoryModule);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(45);
let CategoryService = class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const category = await this.prisma.category.create({ data: { name: createCategoryDto.name } });
        return { status: 'success', message: 'Categoria creada', data: category };
    }
    findAll(query) {
        const take = parseInt(query.limit) || 4;
        const search = query.search;
        const where = {};
        if (search) {
            where.OR = [
                {
                    name: { contains: search },
                },
            ];
        }
        return this.prisma.category.findMany({
            take,
            where,
        });
    }
    findOne(id) {
        return `This action returns a #${id} category`;
    }
    async update(id, updateCategoryDto) {
        const category = await this.prisma.category.update({
            where: { id: id.toString() }, data: {
                name: updateCategoryDto.name
            }
        });
        return { status: 'success', message: `Se ha actualizado a ${updateCategoryDto.name}` };
    }
    async remove(id) {
        const category = await this.prisma.category.delete({
            where: { id: id.toString() }
        });
        return { status: 'success', message: 'Se ha eliminado la categoria' };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], CategoryService);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryController = void 0;
const common_1 = __webpack_require__(3);
const category_service_1 = __webpack_require__(62);
const create_category_dto_1 = __webpack_require__(64);
const update_category_dto_1 = __webpack_require__(65);
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    create(createCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }
    findAll(query) {
        return this.categoryService.findAll(query);
    }
    findOne(id) {
        return this.categoryService.findOne(+id);
    }
    update(id, updateCategoryDto) {
        return this.categoryService.update(+id, updateCategoryDto);
    }
    remove(id) {
        return this.categoryService.remove(id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_category_dto_1.CreateCategoryDto !== "undefined" && create_category_dto_1.CreateCategoryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_category_dto_1.UpdateCategoryDto !== "undefined" && update_category_dto_1.UpdateCategoryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "remove", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [typeof (_a = typeof category_service_1.CategoryService !== "undefined" && category_service_1.CategoryService) === "function" ? _a : Object])
], CategoryController);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCategoryDto = void 0;
const class_validator_1 = __webpack_require__(19);
class CreateCategoryDto {
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'La categoría debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre de la categoría debe tener como mínimo 3 carácteres' }),
    (0, class_validator_1.MaxLength)(20, { message: 'El nombre de la categoría debe tener un máximo de 20 carácteres' }),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCategoryDto = void 0;
const swagger_1 = __webpack_require__(50);
const create_category_dto_1 = __webpack_require__(64);
class UpdateCategoryDto extends (0, swagger_1.PartialType)(create_category_dto_1.CreateCategoryDto) {
}
exports.UpdateCategoryDto = UpdateCategoryDto;


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthorModule = void 0;
const common_1 = __webpack_require__(3);
const author_service_1 = __webpack_require__(67);
const author_controller_1 = __webpack_require__(68);
let AuthorModule = class AuthorModule {
};
exports.AuthorModule = AuthorModule;
exports.AuthorModule = AuthorModule = __decorate([
    (0, common_1.Module)({
        controllers: [author_controller_1.AuthorController],
        providers: [author_service_1.AuthorService],
    })
], AuthorModule);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthorService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(45);
let AuthorService = class AuthorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAuthorDto) {
        const author = await this.prisma.author.create({
            data: {
                name: createAuthorDto.name
            }
        });
        if (!author)
            return new common_1.HttpException('error al crear autor', common_1.HttpStatus.BAD_REQUEST);
        return { status: 'success', data: author };
    }
    async findAll(query) {
        const take = parseInt(query.limit) || 4;
        const search = query.search;
        const where = {};
        if (search) {
            where.OR = [
                {
                    name: { contains: search },
                },
            ];
        }
        return this.prisma.author.findMany({
            take,
            where,
        });
    }
    findOne(id) {
        return `This action returns a #${id} author`;
    }
    async update(id, updateAuthorDto) {
        const author = await this.prisma.author.update({
            where: { id: id.toString() }, data: {
                name: updateAuthorDto.name
            }
        });
        return { status: 'success', message: `Se ha actualizado a${updateAuthorDto.name}`, data: author };
    }
    async remove(id) {
        const author = await this.prisma.author.delete({
            where: { id }
        });
        return { status: 'success', message: `Se ha eliminado al autor`, data: author };
    }
};
exports.AuthorService = AuthorService;
exports.AuthorService = AuthorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AuthorService);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthorController = void 0;
const common_1 = __webpack_require__(3);
const author_service_1 = __webpack_require__(67);
const create_author_dto_1 = __webpack_require__(69);
const update_author_dto_1 = __webpack_require__(70);
let AuthorController = class AuthorController {
    constructor(authorService) {
        this.authorService = authorService;
    }
    create(createAuthorDto) {
        return this.authorService.create(createAuthorDto);
    }
    findAll({ search, limit }) {
        return this.authorService.findAll({ search, limit });
    }
    findOne(id) {
        return this.authorService.findOne(+id);
    }
    update(id, updateAuthorDto) {
        return this.authorService.update(+id, updateAuthorDto);
    }
    remove(id) {
        return this.authorService.remove(id);
    }
};
exports.AuthorController = AuthorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_author_dto_1.CreateAuthorDto !== "undefined" && create_author_dto_1.CreateAuthorDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AuthorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_author_dto_1.UpdateAuthorDto !== "undefined" && update_author_dto_1.UpdateAuthorDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AuthorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthorController.prototype, "remove", null);
exports.AuthorController = AuthorController = __decorate([
    (0, common_1.Controller)('author'),
    __metadata("design:paramtypes", [typeof (_a = typeof author_service_1.AuthorService !== "undefined" && author_service_1.AuthorService) === "function" ? _a : Object])
], AuthorController);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAuthorDto = void 0;
const class_validator_1 = __webpack_require__(19);
class CreateAuthorDto {
}
exports.CreateAuthorDto = CreateAuthorDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateAuthorDto.prototype, "name", void 0);


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAuthorDto = void 0;
const swagger_1 = __webpack_require__(50);
const create_author_dto_1 = __webpack_require__(69);
class UpdateAuthorDto extends (0, swagger_1.PartialType)(create_author_dto_1.CreateAuthorDto) {
}
exports.UpdateAuthorDto = UpdateAuthorDto;


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicalBookOperationModule = void 0;
const common_1 = __webpack_require__(3);
const physical_book_operation_service_1 = __webpack_require__(72);
const physical_book_operation_controller_1 = __webpack_require__(73);
let PhysicalBookOperationModule = class PhysicalBookOperationModule {
};
exports.PhysicalBookOperationModule = PhysicalBookOperationModule;
exports.PhysicalBookOperationModule = PhysicalBookOperationModule = __decorate([
    (0, common_1.Module)({
        controllers: [physical_book_operation_controller_1.PhysicalBookOperationController],
        providers: [physical_book_operation_service_1.PhysicalBookOperationService],
    })
], PhysicalBookOperationModule);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicalBookOperationService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(45);
const copies_1 = __webpack_require__(47);
let PhysicalBookOperationService = class PhysicalBookOperationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllOperations(query) {
        let QUERY = {};
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        if (query.search != '') {
            QUERY.where = { OR: [{ book: { title: { contains: query.search } } }] };
        }
        const totalPages = await this.prisma.bookOperation.count({
            where: QUERY.where
        });
        const data = await this.prisma.bookOperation.findMany({
            ...QUERY, take: limit, skip, orderBy: {
                createdAt: 'desc'
            }, include: {
                book: {
                    select: {
                        title: true,
                        isbn: true
                    }
                },
                copy: {
                    select: {
                        code: true
                    }
                }
            }
        });
        return { totalPages, data };
    }
    async addDrops(entriesDto) {
        return this.prisma.$transaction(async (tx) => {
            const existingBook = await tx.physicalBook.findUnique({ where: { id: entriesDto.bookId } });
            if (!existingBook)
                throw new common_1.HttpException('Libro físico no encontrado', common_1.HttpStatus.NOT_FOUND);
            const copies = await tx.bookCopy.findMany({
                where: { bookId: entriesDto.bookId },
                orderBy: { createdAt: 'asc' }
            });
            if (copies.length > 0) {
                const removable = copies.filter((c) => c.status !== client_1.CopyStatus.PRESTADO);
                if (removable.length < entriesDto.quantity) {
                    throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
                }
                const ordered = [
                    ...removable.filter((c) => c.status === client_1.CopyStatus.DISPONIBLE),
                    ...removable.filter((c) => c.status !== client_1.CopyStatus.DISPONIBLE)
                ];
                for (let i = 0; i < entriesDto.quantity; i += 1) {
                    await tx.bookCopy.update({ where: { id: ordered[i].id }, data: { status: client_1.CopyStatus.BAJA } });
                }
                await (0, copies_1.recalcBookStock)(tx, entriesDto.bookId);
            }
            else {
                const difference = existingBook.totalStock - existingBook.availableStock;
                const newValue = existingBook.totalStock - entriesDto.quantity - difference;
                if (newValue < 0)
                    throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
                await tx.physicalBook.update({
                    where: { id: entriesDto.bookId }, data: {
                        availableStock: { decrement: entriesDto.quantity },
                        totalStock: { decrement: entriesDto.quantity }
                    }
                });
            }
            await tx.bookOperation.create({
                data: {
                    bookId: entriesDto.bookId,
                    quantity: entriesDto.quantity,
                    type: 'BAJA',
                    personNames: entriesDto.personNames,
                    personSurNames: entriesDto.personSurNames
                }
            });
            return { status: 'success', message: 'Bajas añadidas' };
        });
    }
    async addEntries(entriesDto) {
        return this.prisma.$transaction(async (tx) => {
            const book = await tx.physicalBook.findUnique({ where: { id: entriesDto.bookId } });
            if (!book)
                throw new common_1.HttpException('Libro físico no encontrado', common_1.HttpStatus.NOT_FOUND);
            await (0, copies_1.createBookCopies)(tx, book, entriesDto.quantity, Array.isArray(entriesDto.codes) ? entriesDto.codes : []);
            await (0, copies_1.recalcBookStock)(tx, entriesDto.bookId);
            await tx.bookOperation.create({
                data: {
                    bookId: entriesDto.bookId,
                    quantity: entriesDto.quantity,
                    type: 'ENTRADA',
                    personNames: entriesDto.personNames,
                    personSurNames: entriesDto.personSurNames
                }
            });
            return { status: 'success', message: 'Entradas añadidas' };
        });
    }
    async findAllLoans(query) {
        const QUERY = {};
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        if (query.search) {
            QUERY.where = { type: 'PRESTAMO', OR: [{ book: { title: { contains: query.search } } }] };
        }
        QUERY.take = parseInt(limit);
        QUERY.skip = parseInt(skip);
        const data = await this.prisma.bookOperation.findMany({
            ...QUERY, where: { ...QUERY.where, wasSettled: false, type: 'PRESTAMO' }, orderBy: { createdAt: 'desc' }, include: {
                book: {
                    select: {
                        title: true
                    }
                },
                copy: {
                    select: {
                        code: true
                    }
                }
            }
        });
        const totalPages = await this.prisma.bookOperation.count({
            where: { ...QUERY.where, type: 'PRESTAMO', wasSettled: false }
        });
        return { data, totalPages };
    }
    async settle(id) {
        return this.prisma.$transaction(async (tx) => {
            const existingLoan = await tx.bookOperation.findUnique({ where: { id } });
            if (!existingLoan)
                throw new common_1.HttpException('Préstamo no encontrado', common_1.HttpStatus.NOT_FOUND);
            await tx.bookOperation.create({
                data: {
                    bookId: existingLoan.bookId,
                    copyId: existingLoan.copyId,
                    quantity: existingLoan.quantity,
                    observations: existingLoan.observations,
                    personId: existingLoan.personId,
                    personNames: existingLoan.personNames,
                    personSurNames: existingLoan.personSurNames,
                    type: 'DEVOLUCION'
                }
            });
            await tx.bookOperation.update({
                where: { id }, data: { wasSettled: true }
            });
            if (existingLoan.copyId) {
                await tx.bookCopy.update({ where: { id: existingLoan.copyId }, data: { status: client_1.CopyStatus.DISPONIBLE } });
                await (0, copies_1.recalcBookStock)(tx, existingLoan.bookId);
            }
            else {
                await tx.physicalBook.update({
                    where: { id: existingLoan.bookId }, data: {
                        availableStock: { increment: existingLoan.quantity }
                    }
                });
            }
            return { state: 'success', message: 'El libro ha sido devuelto' };
        });
    }
    async loan(makeLoanDto) {
        return await this.prisma.$transaction(async (tx) => {
            const copyIds = Array.isArray(makeLoanDto.copyIds) ? makeLoanDto.copyIds : [];
            if (copyIds.length > 0) {
                const copies = await tx.bookCopy.findMany({ where: { id: { in: copyIds } } });
                if (copies.length !== copyIds.length) {
                    throw new common_1.HttpException('Uno o más ejemplares no existen', common_1.HttpStatus.NOT_FOUND);
                }
                const bookId = makeLoanDto.bookId || copies[0].bookId;
                const loans = [];
                for (const copy of copies) {
                    if (copy.bookId !== bookId)
                        throw new common_1.BadRequestException('El ejemplar no pertenece al libro indicado');
                    if (copy.status !== client_1.CopyStatus.DISPONIBLE)
                        throw new common_1.BadRequestException(`El ejemplar ${copy.code} no está disponible`);
                    const loan = await tx.bookOperation.create({
                        data: {
                            bookId,
                            copyId: copy.id,
                            quantity: 1,
                            observations: makeLoanDto.observations,
                            personId: makeLoanDto.personId,
                            personNames: makeLoanDto.personNames,
                            personSurNames: makeLoanDto.personSurNames,
                            type: 'PRESTAMO'
                        }
                    });
                    await tx.bookCopy.update({ where: { id: copy.id }, data: { status: client_1.CopyStatus.PRESTADO } });
                    loans.push(loan);
                }
                await (0, copies_1.recalcBookStock)(tx, bookId);
                return { state: 'success', message: 'Prestamo hecho', loan: loans[0], loans };
            }
            const quantity = makeLoanDto.quantity ?? 1;
            const available = await tx.bookCopy.findMany({
                where: { bookId: makeLoanDto.bookId, status: client_1.CopyStatus.DISPONIBLE },
                orderBy: { createdAt: 'asc' }
            });
            if (available.length > 0) {
                if (available.length < quantity)
                    throw new common_1.BadRequestException('La cantidad supera el stock');
                const loans = [];
                for (let i = 0; i < quantity; i += 1) {
                    const copy = available[i];
                    const loan = await tx.bookOperation.create({
                        data: {
                            bookId: makeLoanDto.bookId,
                            copyId: copy.id,
                            quantity: 1,
                            observations: makeLoanDto.observations,
                            personId: makeLoanDto.personId,
                            personNames: makeLoanDto.personNames,
                            personSurNames: makeLoanDto.personSurNames,
                            type: 'PRESTAMO'
                        }
                    });
                    await tx.bookCopy.update({ where: { id: copy.id }, data: { status: client_1.CopyStatus.PRESTADO } });
                    loans.push(loan);
                }
                await (0, copies_1.recalcBookStock)(tx, makeLoanDto.bookId);
                return { state: 'success', message: 'Prestamo hecho', loan: loans[0], loans };
            }
            const physicalBook = await tx.physicalBook.findUnique({ where: { id: makeLoanDto.bookId } });
            if (!physicalBook)
                throw new common_1.HttpException('Libro físico no encontrado', common_1.HttpStatus.NOT_FOUND);
            if (physicalBook.availableStock - quantity < 0) {
                throw new common_1.BadRequestException('La cantidad supera el stock');
            }
            const loan = await tx.bookOperation.create({
                data: {
                    bookId: makeLoanDto.bookId,
                    quantity,
                    observations: makeLoanDto.observations,
                    personId: makeLoanDto.personId,
                    personNames: makeLoanDto.personNames,
                    personSurNames: makeLoanDto.personSurNames,
                    type: 'PRESTAMO'
                }
            });
            await tx.physicalBook.update({ where: { id: makeLoanDto.bookId }, data: { availableStock: { decrement: quantity } } });
            if (physicalBook.availableStock - quantity == 0) {
                await tx.physicalBook.update({ where: { id: makeLoanDto.bookId }, data: { status: 'AGOTADO' } });
            }
            return { state: 'success', message: 'Prestamo hecho', loan };
        });
    }
    create(createPhysicalBookOperationDto) {
        return 'This action adds a new physicalBookOperation';
    }
    findAll() {
        return `This action returns all physicalBookOperation`;
    }
    findOne(id) {
        return `This action returns a #${id} physicalBookOperation`;
    }
    update(id, updatePhysicalBookOperationDto) {
        return `This action updates a #${id} physicalBookOperation`;
    }
    remove(id) {
        return `This action removes a #${id} physicalBookOperation`;
    }
};
exports.PhysicalBookOperationService = PhysicalBookOperationService;
exports.PhysicalBookOperationService = PhysicalBookOperationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PhysicalBookOperationService);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicalBookOperationController = void 0;
const common_1 = __webpack_require__(3);
const physical_book_operation_service_1 = __webpack_require__(72);
const update_physical_book_operation_dto_1 = __webpack_require__(74);
const entrie_dto_1 = __webpack_require__(76);
const drop_dto_1 = __webpack_require__(77);
const loan_dto_1 = __webpack_require__(78);
const roles_decorator_1 = __webpack_require__(30);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_guard_1 = __webpack_require__(38);
let PhysicalBookOperationController = class PhysicalBookOperationController {
    constructor(physicalBookOperationService) {
        this.physicalBookOperationService = physicalBookOperationService;
    }
    findAll(quer) {
        return this.physicalBookOperationService.findAllOperations(quer);
    }
    addEntries(entriesDto) {
        return this.physicalBookOperationService.addEntries(entriesDto);
    }
    addDrops(entriesDto) {
        return this.physicalBookOperationService.addDrops(entriesDto);
    }
    loan(makeLoanDto) {
        return this.physicalBookOperationService.loan(makeLoanDto);
    }
    settle(id) {
        console.log(id);
        return this.physicalBookOperationService.settle(id);
    }
    findAllLoans(query) {
        return this.physicalBookOperationService.findAllLoans(query);
    }
    findOne(id) {
        return this.physicalBookOperationService.findOne(+id);
    }
    update(id, updatePhysicalBookOperationDto) {
        return this.physicalBookOperationService.update(+id, updatePhysicalBookOperationDto);
    }
    remove(id) {
        return this.physicalBookOperationService.remove(+id);
    }
};
exports.PhysicalBookOperationController = PhysicalBookOperationController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('entries'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof entrie_dto_1.EntrieDto !== "undefined" && entrie_dto_1.EntrieDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "addEntries", null);
__decorate([
    (0, common_1.Patch)('drops'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof drop_dto_1.DropDto !== "undefined" && drop_dto_1.DropDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "addDrops", null);
__decorate([
    (0, common_1.Post)('loan'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof loan_dto_1.LoanDto !== "undefined" && loan_dto_1.LoanDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "loan", null);
__decorate([
    (0, common_1.Patch)('settle/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "settle", null);
__decorate([
    (0, common_1.Get)('loan'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "findAllLoans", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof update_physical_book_operation_dto_1.UpdatePhysicalBookOperationDto !== "undefined" && update_physical_book_operation_dto_1.UpdatePhysicalBookOperationDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "remove", null);
exports.PhysicalBookOperationController = PhysicalBookOperationController = __decorate([
    (0, common_1.Controller)('physical-book-operation'),
    __metadata("design:paramtypes", [typeof (_a = typeof physical_book_operation_service_1.PhysicalBookOperationService !== "undefined" && physical_book_operation_service_1.PhysicalBookOperationService) === "function" ? _a : Object])
], PhysicalBookOperationController);


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePhysicalBookOperationDto = void 0;
const swagger_1 = __webpack_require__(50);
const create_physical_book_operation_dto_1 = __webpack_require__(75);
class UpdatePhysicalBookOperationDto extends (0, swagger_1.PartialType)(create_physical_book_operation_dto_1.CreatePhysicalBookOperationDto) {
}
exports.UpdatePhysicalBookOperationDto = UpdatePhysicalBookOperationDto;


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePhysicalBookOperationDto = void 0;
class CreatePhysicalBookOperationDto {
}
exports.CreatePhysicalBookOperationDto = CreatePhysicalBookOperationDto;


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntrieDto = void 0;
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(19);
class EntrieDto {
}
exports.EntrieDto = EntrieDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un numero entero' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un numero positivo' }),
    __metadata("design:type", Number)
], EntrieDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un Item para dar entradas' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "bookId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los códigos deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada código debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], EntrieDto.prototype, "codes", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Los nombres deben ser texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'Los nombres deben tener minimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(40, { message: 'Los nombres deben tener maximo 40 caracteres' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "personNames", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Los apellidos deben ser texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'Los apellidos deben tener minimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(40, { message: 'Los apellidos deben tener maximo 40 caracteres' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "personSurNames", void 0);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DropDto = void 0;
const swagger_1 = __webpack_require__(50);
const entrie_dto_1 = __webpack_require__(76);
const class_validator_1 = __webpack_require__(19);
class DropDto extends (0, swagger_1.PartialType)(entrie_dto_1.EntrieDto) {
}
exports.DropDto = DropDto;
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un libro para dar bajas' }),
    __metadata("design:type", String)
], DropDto.prototype, "bookId", void 0);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoanDto = void 0;
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(19);
class LoanDto {
}
exports.LoanDto = LoanDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un numero entero' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un numero positivo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LoanDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los ejemplares deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ejemplar debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], LoanDto.prototype, "copyIds", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un libro a prestar' }),
    __metadata("design:type", String)
], LoanDto.prototype, "bookId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Las observaciones deben ser una cadena de texto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Las observaciones deben tener un máximo de 200 caracteres' }),
    __metadata("design:type", String)
], LoanDto.prototype, "observations", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La cedula debe ser una cadena de texto' }),
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir Una cedula' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo cedula no puede estar vacío' }),
    __metadata("design:type", String)
], LoanDto.prototype, "personId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Los nombres deben ser texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'Los nombres deben tener minimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(40, { message: 'Los nombres deben tener maximo 40 caracteres' }),
    __metadata("design:type", String)
], LoanDto.prototype, "personNames", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Los apellidos deben ser texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'Los apellidos deben tener minimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(40, { message: 'Los apellidos deben tener maximo 40 caracteres' }),
    __metadata("design:type", String)
], LoanDto.prototype, "personSurNames", void 0);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTypeModule = void 0;
const common_1 = __webpack_require__(3);
const item_type_service_1 = __webpack_require__(80);
const item_type_controller_1 = __webpack_require__(81);
let ItemTypeModule = class ItemTypeModule {
};
exports.ItemTypeModule = ItemTypeModule;
exports.ItemTypeModule = ItemTypeModule = __decorate([
    (0, common_1.Module)({
        controllers: [item_type_controller_1.ItemTypeController],
        providers: [item_type_service_1.ItemTypeService],
    })
], ItemTypeModule);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTypeService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(45);
let ItemTypeService = class ItemTypeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createItemTypeDto) {
        return { message: 'Tipo Creado', status: 'success', data: await this.prisma.itemType.create({ data: createItemTypeDto }) };
    }
    async findAll(query) {
        const where = {};
        if (query.search) {
            where.OR = [
                { name: { contains: query.search } }
            ];
        }
        return await this.prisma.itemType.findMany({ where, take: 10 });
    }
    findOne(id) {
        return `This action returns a #${id} itemType`;
    }
    async update(id, updateItemTypeDto) {
        return { message: 'Tipo Actualizado', status: 'success', data: await this.prisma.itemType.update({ where: { id }, data: updateItemTypeDto }) };
    }
    async remove(id) {
        return { message: 'Tipo Eliminado', status: 'success', data: await this.prisma.itemType.delete({ where: { id } }) };
    }
};
exports.ItemTypeService = ItemTypeService;
exports.ItemTypeService = ItemTypeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ItemTypeService);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTypeController = void 0;
const common_1 = __webpack_require__(3);
const item_type_service_1 = __webpack_require__(80);
const create_item_type_dto_1 = __webpack_require__(82);
const update_item_type_dto_1 = __webpack_require__(83);
let ItemTypeController = class ItemTypeController {
    constructor(itemTypeService) {
        this.itemTypeService = itemTypeService;
    }
    create(createItemTypeDto) {
        return this.itemTypeService.create(createItemTypeDto);
    }
    findAll(query) {
        return this.itemTypeService.findAll(query);
    }
    findOne(id) {
        return this.itemTypeService.findOne(id);
    }
    update(id, updateItemTypeDto) {
        return this.itemTypeService.update(id, updateItemTypeDto);
    }
    remove(id) {
        return this.itemTypeService.remove(id);
    }
};
exports.ItemTypeController = ItemTypeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_item_type_dto_1.CreateItemTypeDto !== "undefined" && create_item_type_dto_1.CreateItemTypeDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ItemTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ItemTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ItemTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_item_type_dto_1.UpdateItemTypeDto !== "undefined" && update_item_type_dto_1.UpdateItemTypeDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ItemTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ItemTypeController.prototype, "remove", null);
exports.ItemTypeController = ItemTypeController = __decorate([
    (0, common_1.Controller)('item-type'),
    __metadata("design:paramtypes", [typeof (_a = typeof item_type_service_1.ItemTypeService !== "undefined" && item_type_service_1.ItemTypeService) === "function" ? _a : Object])
], ItemTypeController);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateItemTypeDto = void 0;
const class_validator_1 = __webpack_require__(19);
class CreateItemTypeDto {
}
exports.CreateItemTypeDto = CreateItemTypeDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'El tipo debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El tipo debe tener como minimo 3 caracteres de longitud' }),
    __metadata("design:type", String)
], CreateItemTypeDto.prototype, "name", void 0);


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateItemTypeDto = void 0;
const swagger_1 = __webpack_require__(50);
const create_item_type_dto_1 = __webpack_require__(82);
class UpdateItemTypeDto extends (0, swagger_1.PartialType)(create_item_type_dto_1.CreateItemTypeDto) {
}
exports.UpdateItemTypeDto = UpdateItemTypeDto;


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryOperationModule = void 0;
const common_1 = __webpack_require__(3);
const inventory_operation_service_1 = __webpack_require__(85);
const inventory_operation_controller_1 = __webpack_require__(86);
let InventoryOperationModule = class InventoryOperationModule {
};
exports.InventoryOperationModule = InventoryOperationModule;
exports.InventoryOperationModule = InventoryOperationModule = __decorate([
    (0, common_1.Module)({
        controllers: [inventory_operation_controller_1.InventoryOperationController],
        providers: [inventory_operation_service_1.InventoryOperationService],
    })
], InventoryOperationModule);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryOperationService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(45);
const copies_1 = __webpack_require__(47);
let InventoryOperationService = class InventoryOperationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createInventoryOperationDto) {
        return 'This action adds a new inventoryOperation';
    }
    async addDrops(entriesDto) {
        return this.prisma.$transaction(async (tx) => {
            const existingItem = await tx.item.findUnique({ where: { id: entriesDto.itemId } });
            if (!existingItem)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            const copies = await tx.itemCopy.findMany({
                where: { itemId: entriesDto.itemId },
                orderBy: { createdAt: 'asc' }
            });
            if (copies.length > 0) {
                const removable = copies.filter((c) => c.status !== client_1.CopyStatus.PRESTADO);
                if (removable.length < entriesDto.quantity) {
                    throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
                }
                const ordered = [
                    ...removable.filter((c) => c.status === client_1.CopyStatus.DISPONIBLE),
                    ...removable.filter((c) => c.status !== client_1.CopyStatus.DISPONIBLE)
                ];
                for (let i = 0; i < entriesDto.quantity; i += 1) {
                    await tx.itemCopy.update({ where: { id: ordered[i].id }, data: { status: client_1.CopyStatus.BAJA } });
                }
                await (0, copies_1.recalcItemStock)(tx, entriesDto.itemId);
            }
            else {
                const difference = existingItem.totalStock - existingItem.availableStock;
                const newValue = existingItem.totalStock - entriesDto.quantity - difference;
                if (newValue < 0)
                    throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
                await tx.item.update({
                    where: { id: entriesDto.itemId }, data: {
                        availableStock: { decrement: entriesDto.quantity },
                        totalStock: { decrement: entriesDto.quantity }
                    }
                });
            }
            await tx.itemOperation.create({
                data: {
                    itemId: entriesDto.itemId,
                    quantity: entriesDto.quantity,
                    type: 'BAJA',
                    personNames: entriesDto.personNames,
                    personSurNames: entriesDto.personSurNames
                }
            });
            return { status: 'success', message: 'Bajas añadidas' };
        });
    }
    async addEntries(entriesDto) {
        return this.prisma.$transaction(async (tx) => {
            const existingItem = await tx.item.findUnique({ where: { id: entriesDto.itemId } });
            if (!existingItem)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            await (0, copies_1.createItemCopies)(tx, existingItem, entriesDto.quantity, Array.isArray(entriesDto.codes) ? entriesDto.codes : []);
            await (0, copies_1.recalcItemStock)(tx, entriesDto.itemId);
            await tx.itemOperation.create({
                data: {
                    itemId: entriesDto.itemId,
                    quantity: entriesDto.quantity,
                    type: 'ENTRADA',
                    personNames: entriesDto.personNames,
                    personSurNames: entriesDto.personSurNames
                }
            });
            return { status: 'success', message: 'Entradas añadidas' };
        });
    }
    async loan(itemLoan) {
        return this.prisma.$transaction(async (tx) => {
            const copyIds = Array.isArray(itemLoan.copyIds) ? itemLoan.copyIds : [];
            if (copyIds.length > 0) {
                const copies = await tx.itemCopy.findMany({ where: { id: { in: copyIds } } });
                if (copies.length !== copyIds.length) {
                    throw new common_1.HttpException('Uno o más ejemplares no existen', common_1.HttpStatus.NOT_FOUND);
                }
                const itemId = itemLoan.itemId || copies[0].itemId;
                const loans = [];
                for (const copy of copies) {
                    if (copy.itemId !== itemId)
                        throw new common_1.BadRequestException('El ejemplar no pertenece al artículo indicado');
                    if (copy.status !== client_1.CopyStatus.DISPONIBLE)
                        throw new common_1.BadRequestException(`El ejemplar ${copy.code} no está disponible`);
                    const loan = await tx.itemOperation.create({
                        data: {
                            itemId,
                            copyId: copy.id,
                            quantity: 1,
                            personId: itemLoan.personId,
                            personNames: itemLoan.personNames,
                            personSurNames: itemLoan.personSurNames,
                            type: 'PRESTAMO'
                        }
                    });
                    await tx.itemCopy.update({ where: { id: copy.id }, data: { status: client_1.CopyStatus.PRESTADO } });
                    loans.push(loan);
                }
                await (0, copies_1.recalcItemStock)(tx, itemId);
                return { status: 'success', message: 'Prestamo Registrado', loan: loans[0], loans };
            }
            const quantity = itemLoan.quantity ?? 1;
            const available = await tx.itemCopy.findMany({
                where: { itemId: itemLoan.itemId, status: client_1.CopyStatus.DISPONIBLE },
                orderBy: { createdAt: 'asc' }
            });
            if (available.length > 0) {
                if (available.length < quantity)
                    throw new common_1.BadRequestException('No hay suficientes items para hacer el prestamo');
                const loans = [];
                for (let i = 0; i < quantity; i += 1) {
                    const copy = available[i];
                    const loan = await tx.itemOperation.create({
                        data: {
                            itemId: itemLoan.itemId,
                            copyId: copy.id,
                            quantity: 1,
                            personId: itemLoan.personId,
                            personNames: itemLoan.personNames,
                            personSurNames: itemLoan.personSurNames,
                            type: 'PRESTAMO'
                        }
                    });
                    await tx.itemCopy.update({ where: { id: copy.id }, data: { status: client_1.CopyStatus.PRESTADO } });
                    loans.push(loan);
                }
                await (0, copies_1.recalcItemStock)(tx, itemLoan.itemId);
                return { status: 'success', message: 'Prestamo Registrado', loan: loans[0], loans };
            }
            const existingItem = await tx.item.findUnique({ where: { id: itemLoan.itemId } });
            if (!existingItem)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            if (existingItem.availableStock - quantity < 0)
                throw new common_1.BadRequestException('No hay suficientes items para hacer el prestamo');
            const loan = await tx.itemOperation.create({
                data: {
                    type: 'PRESTAMO',
                    quantity,
                    itemId: itemLoan.itemId,
                    personId: itemLoan.personId,
                    personNames: itemLoan.personNames,
                    personSurNames: itemLoan.personSurNames
                }
            });
            await tx.item.update({
                where: { id: itemLoan.itemId }, data: {
                    availableStock: { decrement: quantity }
                }
            });
            return { status: 'success', message: 'Prestamo Registrado', loan };
        });
    }
    async settle(id) {
        return this.prisma.$transaction(async (tx) => {
            const existingLoan = await tx.itemOperation.findUnique({ where: { id } });
            if (!existingLoan)
                throw new common_1.HttpException('Préstamo no encontrado', common_1.HttpStatus.NOT_FOUND);
            await tx.itemOperation.create({
                data: {
                    type: 'DEVOLUCION',
                    quantity: existingLoan.quantity,
                    itemId: existingLoan.itemId,
                    copyId: existingLoan.copyId,
                    personId: existingLoan.personId,
                    personNames: existingLoan.personNames,
                    personSurNames: existingLoan.personSurNames
                }
            });
            await tx.itemOperation.update({
                where: { id }, data: { wasSettled: true }
            });
            if (existingLoan.copyId) {
                await tx.itemCopy.update({ where: { id: existingLoan.copyId }, data: { status: client_1.CopyStatus.DISPONIBLE } });
                await (0, copies_1.recalcItemStock)(tx, existingLoan.itemId);
            }
            else {
                await tx.item.update({
                    where: { id: existingLoan.itemId }, data: {
                        availableStock: { increment: existingLoan.quantity }
                    }
                });
            }
            return { status: 'success', message: 'Item Devuelto' };
        });
    }
    async findAllLoans(query) {
        const where = {};
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        if (query.search) {
            where.OR = [
                { item: { name: { contains: query.search } } }
            ];
        }
        const data = await this.prisma.itemOperation.findMany({
            where: { ...where, type: 'PRESTAMO', wasSettled: false },
            include: {
                item: true,
                copy: { select: { code: true } }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        const totalPages = Math.ceil(await this.prisma.itemOperation.count({ where: { ...where, type: 'PRESTAMO', wasSettled: false } }) / limit);
        return { data, totalPages };
    }
    async findAll(query) {
        const where = {};
        const page = parseInt(query.page) || 1;
        const take = parseInt(query.limit) || 10;
        const skip = (page - 1) * take;
        if (query.search) {
            where.AND = [
                { item: { name: { contains: query.search } } }
            ];
        }
        const totalPages = await this.prisma.itemOperation.count({
            where
        });
        const data = await this.prisma.itemOperation.findMany({
            where, take, skip, orderBy: { createdAt: 'desc' }, include: {
                item: true,
                copy: { select: { code: true } }
            }
        });
        return { data, totalPages };
    }
    findOne(id) {
        return `This action returns a #${id} inventoryOperation`;
    }
    update(id, updateInventoryOperationDto) {
        return `This action updates a #${id} inventoryOperation`;
    }
    remove(id) {
        return `This action removes a #${id} inventoryOperation`;
    }
};
exports.InventoryOperationService = InventoryOperationService;
exports.InventoryOperationService = InventoryOperationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InventoryOperationService);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryOperationController = void 0;
const common_1 = __webpack_require__(3);
const inventory_operation_service_1 = __webpack_require__(85);
const create_inventory_operation_dto_1 = __webpack_require__(87);
const update_inventory_operation_dto_1 = __webpack_require__(88);
const entrie_dto_1 = __webpack_require__(89);
const drop_dto_1 = __webpack_require__(90);
const loan_dto_1 = __webpack_require__(91);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_decorator_1 = __webpack_require__(30);
const roles_guard_1 = __webpack_require__(38);
let InventoryOperationController = class InventoryOperationController {
    constructor(inventoryOperationService) {
        this.inventoryOperationService = inventoryOperationService;
    }
    addEntries(entriesDto) {
        return this.inventoryOperationService.addEntries(entriesDto);
    }
    addDrops(entriesDto) {
        return this.inventoryOperationService.addDrops(entriesDto);
    }
    findAllLoans(query) {
        return this.inventoryOperationService.findAllLoans(query);
    }
    loan(itemLoan) {
        return this.inventoryOperationService.loan(itemLoan);
    }
    settle(id) {
        return this.inventoryOperationService.settle(id);
    }
    create(createInventoryOperationDto) {
        return this.inventoryOperationService.create(createInventoryOperationDto);
    }
    findAll(query) {
        return this.inventoryOperationService.findAll(query);
    }
    findOne(id) {
        return this.inventoryOperationService.findOne(+id);
    }
    update(id, updateInventoryOperationDto) {
        return this.inventoryOperationService.update(+id, updateInventoryOperationDto);
    }
    remove(id) {
        return this.inventoryOperationService.remove(+id);
    }
};
exports.InventoryOperationController = InventoryOperationController;
__decorate([
    (0, common_1.Patch)('entries'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof entrie_dto_1.EntrieDto !== "undefined" && entrie_dto_1.EntrieDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "addEntries", null);
__decorate([
    (0, common_1.Patch)('drops'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof drop_dto_1.DropDto !== "undefined" && drop_dto_1.DropDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "addDrops", null);
__decorate([
    (0, common_1.Get)('loan'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "findAllLoans", null);
__decorate([
    (0, common_1.Post)('loan'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof loan_dto_1.LoanDto !== "undefined" && loan_dto_1.LoanDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "loan", null);
__decorate([
    (0, common_1.Patch)('settle/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "settle", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof create_inventory_operation_dto_1.CreateInventoryOperationDto !== "undefined" && create_inventory_operation_dto_1.CreateInventoryOperationDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_inventory_operation_dto_1.UpdateInventoryOperationDto !== "undefined" && update_inventory_operation_dto_1.UpdateInventoryOperationDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "remove", null);
exports.InventoryOperationController = InventoryOperationController = __decorate([
    (0, common_1.Controller)('inventory-operation'),
    __metadata("design:paramtypes", [typeof (_a = typeof inventory_operation_service_1.InventoryOperationService !== "undefined" && inventory_operation_service_1.InventoryOperationService) === "function" ? _a : Object])
], InventoryOperationController);


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateInventoryOperationDto = void 0;
class CreateInventoryOperationDto {
}
exports.CreateInventoryOperationDto = CreateInventoryOperationDto;


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateInventoryOperationDto = void 0;
const swagger_1 = __webpack_require__(50);
const create_inventory_operation_dto_1 = __webpack_require__(87);
class UpdateInventoryOperationDto extends (0, swagger_1.PartialType)(create_inventory_operation_dto_1.CreateInventoryOperationDto) {
}
exports.UpdateInventoryOperationDto = UpdateInventoryOperationDto;


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntrieDto = void 0;
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(19);
class EntrieDto {
}
exports.EntrieDto = EntrieDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un numero entero' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un numero positivo' }),
    __metadata("design:type", Number)
], EntrieDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un Item para dar entradas' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los códigos deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada código debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], EntrieDto.prototype, "codes", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Los nombres deben ser texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'Los nombres deben tener minimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(40, { message: 'Los nombres deben tener maximo 40 caracteres' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "personNames", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Los apellidos deben ser texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'Los apellidos deben tener minimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(40, { message: 'Los apellidos deben tener maximo 40 caracteres' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "personSurNames", void 0);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DropDto = void 0;
const swagger_1 = __webpack_require__(50);
const entrie_dto_1 = __webpack_require__(89);
const class_validator_1 = __webpack_require__(19);
class DropDto extends (0, swagger_1.PartialType)(entrie_dto_1.EntrieDto) {
}
exports.DropDto = DropDto;
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un Item para dar bajas' }),
    __metadata("design:type", String)
], DropDto.prototype, "itemId", void 0);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoanDto = void 0;
const class_transformer_1 = __webpack_require__(52);
const class_validator_1 = __webpack_require__(19);
class LoanDto {
}
exports.LoanDto = LoanDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un numero entero' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un numero positivo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LoanDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los ejemplares deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ejemplar debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], LoanDto.prototype, "copyIds", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un Item a prestar' }),
    __metadata("design:type", String)
], LoanDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Las observaciones deben ser una cadena de texto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Las observaciones deben tener un máximo de 200 caracteres' }),
    __metadata("design:type", String)
], LoanDto.prototype, "observations", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La cedula debe ser una cadena de texto' }),
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir Una cedula' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El campo cedula no puede estar vacío' }),
    __metadata("design:type", String)
], LoanDto.prototype, "personId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Los nombres deben ser texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'Los nombres deben tener minimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(40, { message: 'Los nombres deben tener maximo 40 caracteres' }),
    __metadata("design:type", String)
], LoanDto.prototype, "personNames", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Los apellidos deben ser texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'Los apellidos deben tener minimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(40, { message: 'Los apellidos deben tener maximo 40 caracteres' }),
    __metadata("design:type", String)
], LoanDto.prototype, "personSurNames", void 0);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsModule = void 0;
const common_1 = __webpack_require__(3);
const logs_service_1 = __webpack_require__(93);
const logs_controller_1 = __webpack_require__(94);
const prisma_module_1 = __webpack_require__(97);
let LogsModule = class LogsModule {
};
exports.LogsModule = LogsModule;
exports.LogsModule = LogsModule = __decorate([
    (0, common_1.Module)({
        controllers: [logs_controller_1.LogsController],
        providers: [logs_service_1.LogsService],
        imports: [prisma_module_1.PrismaModule]
    })
], LogsModule);


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsService = void 0;
const common_1 = __webpack_require__(3);
const getPagination_1 = __webpack_require__(16);
const prisma_service_1 = __webpack_require__(45);
let LogsService = class LogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createLogDto) {
        return 'This action adds a new log';
    }
    async findAll(query) {
        const search = query.search;
        const where = {};
        const { take, page, skip } = (0, getPagination_1.getPagination)(query);
        if (search) {
            where.OR = [{ action: { contains: search } }];
        }
        const data = await this.prisma.operation.findMany({ where, take, skip, orderBy: { createdAt: 'desc' }, include: { user: true } });
        const totalPages = await this.prisma.operation.count({ where });
        return { data, totalPages };
    }
    findOne(id) {
        return `This action returns a #${id} log`;
    }
    update(id, updateLogDto) {
        return `This action updates a #${id} log`;
    }
    remove(id) {
        return `This action removes a #${id} log`;
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], LogsService);


/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsController = void 0;
const common_1 = __webpack_require__(3);
const logs_service_1 = __webpack_require__(93);
const create_log_dto_1 = __webpack_require__(95);
const update_log_dto_1 = __webpack_require__(96);
let LogsController = class LogsController {
    constructor(logsService) {
        this.logsService = logsService;
    }
    create(createLogDto) {
        return this.logsService.create(createLogDto);
    }
    findAll(query) {
        return this.logsService.findAll(query);
    }
    findOne(id) {
        return this.logsService.findOne(+id);
    }
    update(id, updateLogDto) {
        return this.logsService.update(+id, updateLogDto);
    }
    remove(id) {
        return this.logsService.remove(+id);
    }
};
exports.LogsController = LogsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_log_dto_1.CreateLogDto !== "undefined" && create_log_dto_1.CreateLogDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_log_dto_1.UpdateLogDto !== "undefined" && update_log_dto_1.UpdateLogDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "remove", null);
exports.LogsController = LogsController = __decorate([
    (0, common_1.Controller)('logs'),
    __metadata("design:paramtypes", [typeof (_a = typeof logs_service_1.LogsService !== "undefined" && logs_service_1.LogsService) === "function" ? _a : Object])
], LogsController);


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateLogDto = void 0;
class CreateLogDto {
}
exports.CreateLogDto = CreateLogDto;


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateLogDto = void 0;
const swagger_1 = __webpack_require__(50);
const create_log_dto_1 = __webpack_require__(95);
class UpdateLogDto extends (0, swagger_1.PartialType)(create_log_dto_1.CreateLogDto) {
}
exports.UpdateLogDto = UpdateLogDto;


/***/ }),
/* 97 */
/***/ ((module) => {

module.exports = require("prisma/prisma.module");

/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BackupModule = void 0;
const common_1 = __webpack_require__(3);
const backup_service_1 = __webpack_require__(99);
const backup_controller_1 = __webpack_require__(101);
let BackupModule = class BackupModule {
};
exports.BackupModule = BackupModule;
exports.BackupModule = BackupModule = __decorate([
    (0, common_1.Module)({
        providers: [backup_service_1.BackupService],
        controllers: [backup_controller_1.BackupController]
    })
], BackupModule);


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BackupService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(6);
const zlib = __importStar(__webpack_require__(100));
let BackupService = class BackupService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateBackup() {
        const backup = {
            generatedAt: new Date().toISOString(),
            _prisma_migrations: await this.prisma.$queryRawUnsafe(`SELECT * FROM "_prisma_migrations"`),
            Author: await this.prisma.author.findMany(),
            Book: await this.prisma.book.findMany(),
            BookOperation: await this.prisma.bookOperation.findMany(),
            Category: await this.prisma.category.findMany(),
            Item: await this.prisma.item.findMany(),
            ItemOperation: await this.prisma.itemOperation.findMany(),
            ItemType: await this.prisma.itemType.findMany(),
            Operation: await this.prisma.operation.findMany(),
            PhysicalBook: await this.prisma.physicalBook.findMany(),
            SavedBook: await this.prisma.savedBook.findMany(),
            User: await this.prisma.user.findMany(),
        };
        const json = JSON.stringify(backup, null, 2);
        const gzipped = zlib.gzipSync(json);
        return gzipped;
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], BackupService);


/***/ }),
/* 100 */
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BackupController = void 0;
const common_1 = __webpack_require__(3);
const express_1 = __webpack_require__(24);
const backup_service_1 = __webpack_require__(99);
let BackupController = class BackupController {
    constructor(backupService) {
        this.backupService = backupService;
    }
    async downloadBackup(res) {
        const file = await this.backupService.generateBackup();
        const filename = `backup-${new Date().toISOString()}.json.gz`;
        res.set({
            'Content-Type': 'application/gzip',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': file.length,
        });
        res.end(file);
    }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "downloadBackup", null);
exports.BackupController = BackupController = __decorate([
    (0, common_1.Controller)('backup'),
    __metadata("design:paramtypes", [typeof (_a = typeof backup_service_1.BackupService !== "undefined" && backup_service_1.BackupService) === "function" ? _a : Object])
], BackupController);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncModule = void 0;
const common_1 = __webpack_require__(3);
const sync_service_1 = __webpack_require__(103);
const sync_controller_1 = __webpack_require__(104);
let SyncModule = class SyncModule {
};
exports.SyncModule = SyncModule;
exports.SyncModule = SyncModule = __decorate([
    (0, common_1.Module)({
        controllers: [sync_controller_1.SyncController],
        providers: [sync_service_1.SyncService],
    })
], SyncModule);


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(6);
const SCALARS = {
    category: ['name'],
    author: ['name'],
    itemType: ['name'],
    physicalBook: [
        'isbn',
        'title',
        'pnf',
        'yearOfPublication',
        'editorial',
        'totalStock',
        'availableStock',
        'status',
    ],
    bookCopy: ['code', 'status', 'location', 'observations', 'bookId'],
    bookOperation: [
        'bookId',
        'copyId',
        'type',
        'quantity',
        'observations',
        'personId',
        'wasSettled',
        'personNames',
        'personSurNames',
    ],
    item: [
        'name',
        'code',
        'description',
        'totalStock',
        'availableStock',
        'typeId',
        'status',
    ],
    itemCopy: ['code', 'status', 'location', 'observations', 'itemId'],
    itemOperation: [
        'itemId',
        'copyId',
        'type',
        'quantity',
        'observations',
        'personId',
        'wasSettled',
        'personNames',
        'personSurNames',
    ],
};
let SyncService = class SyncService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger('SyncService');
    }
    isNewer(incoming, existing) {
        if (!incoming || incoming.updatedAt === undefined || incoming.updatedAt === null) {
            return false;
        }
        const a = new Date(incoming.updatedAt).getTime();
        const b = new Date(existing?.updatedAt ?? 0).getTime();
        if (Number.isNaN(a))
            return false;
        if (Number.isNaN(b))
            return true;
        return a > b;
    }
    pick(model, row, includeId = true) {
        const fields = SCALARS[model] ?? [];
        const data = {};
        if (includeId && row.id !== undefined)
            data.id = row.id;
        for (const field of fields) {
            if (row[field] !== undefined)
                data[field] = row[field];
        }
        return data;
    }
    async upsertScalars(tx, model, rows, counters) {
        for (const row of rows ?? []) {
            if (!row || typeof row.id !== 'string')
                continue;
            const existing = await tx[model].findUnique({ where: { id: row.id } });
            if (!existing) {
                await tx[model].create({ data: this.pick(model, row) });
                counters.created += 1;
            }
            else if (this.isNewer(row, existing)) {
                await tx[model].update({ where: { id: row.id }, data: this.pick(model, row, false) });
                counters.updated += 1;
            }
            else {
                counters.skipped += 1;
            }
        }
    }
    async exportAll() {
        const [categories, authors, itemTypes, physicalBooks, bookCopies, bookOperations, items, itemCopies, itemOperations,] = await Promise.all([
            this.prisma.category.findMany(),
            this.prisma.author.findMany(),
            this.prisma.itemType.findMany(),
            this.prisma.physicalBook.findMany({
                include: { authors: { select: { id: true } }, categories: { select: { id: true } } },
            }),
            this.prisma.bookCopy.findMany(),
            this.prisma.bookOperation.findMany(),
            this.prisma.item.findMany({
                include: { authors: { select: { id: true } }, categories: { select: { id: true } } },
            }),
            this.prisma.itemCopy.findMany(),
            this.prisma.itemOperation.findMany(),
        ]);
        return {
            serverTime: new Date().toISOString(),
            data: {
                categories,
                authors,
                itemTypes,
                physicalBooks: physicalBooks.map((b) => ({
                    ...b,
                    authorIds: b.authors.map((a) => a.id),
                    categoryIds: b.categories.map((c) => c.id),
                    authors: undefined,
                    categories: undefined,
                })),
                bookCopies,
                bookOperations,
                items: items.map((i) => ({
                    ...i,
                    authorIds: i.authors.map((a) => a.id),
                    categoryIds: i.categories.map((c) => c.id),
                    authors: undefined,
                    categories: undefined,
                })),
                itemCopies,
                itemOperations,
            },
        };
    }
    async merge(payload) {
        const data = payload?.data ?? {};
        const counters = { created: 0, updated: 0, skipped: 0 };
        await this.prisma.$transaction(async (tx) => {
            await this.upsertScalars(tx, 'category', data.categories ?? [], counters);
            await this.upsertScalars(tx, 'author', data.authors ?? [], counters);
            await this.upsertScalars(tx, 'itemType', data.itemTypes ?? [], counters);
            const authorIds = new Set((await tx.author.findMany({ select: { id: true } })).map((a) => a.id));
            const categoryIds = new Set((await tx.category.findMany({ select: { id: true } })).map((c) => c.id));
            const itemTypeIds = new Set((await tx.itemType.findMany({ select: { id: true } })).map((t) => t.id));
            for (const row of data.physicalBooks ?? []) {
                if (!row || typeof row.id !== 'string')
                    continue;
                const existing = await tx.physicalBook.findUnique({ where: { id: row.id } });
                const base = this.pick('physicalBook', row);
                if (!existing) {
                    await tx.physicalBook.create({ data: base });
                    counters.created += 1;
                }
                else if (this.isNewer(row, existing)) {
                    await tx.physicalBook.update({ where: { id: row.id }, data: this.pick('physicalBook', row, false) });
                    counters.updated += 1;
                }
                else {
                    counters.skipped += 1;
                    continue;
                }
                if (Array.isArray(row.authorIds)) {
                    await tx.physicalBook.update({
                        where: { id: row.id },
                        data: {
                            authors: {
                                set: row.authorIds
                                    .filter((id) => authorIds.has(id))
                                    .map((id) => ({ id })),
                            },
                        },
                    });
                }
                if (Array.isArray(row.categoryIds)) {
                    await tx.physicalBook.update({
                        where: { id: row.id },
                        data: {
                            categories: {
                                set: row.categoryIds
                                    .filter((id) => categoryIds.has(id))
                                    .map((id) => ({ id })),
                            },
                        },
                    });
                }
            }
            for (const row of data.items ?? []) {
                if (!row || typeof row.id !== 'string')
                    continue;
                if (row.typeId && !itemTypeIds.has(row.typeId)) {
                    counters.skipped += 1;
                    continue;
                }
                const existing = await tx.item.findUnique({ where: { id: row.id } });
                if (!existing) {
                    await tx.item.create({ data: this.pick('item', row) });
                    counters.created += 1;
                }
                else if (this.isNewer(row, existing)) {
                    await tx.item.update({ where: { id: row.id }, data: this.pick('item', row, false) });
                    counters.updated += 1;
                }
                else {
                    counters.skipped += 1;
                    continue;
                }
                if (Array.isArray(row.authorIds)) {
                    await tx.item.update({
                        where: { id: row.id },
                        data: {
                            authors: {
                                set: row.authorIds
                                    .filter((id) => authorIds.has(id))
                                    .map((id) => ({ id })),
                            },
                        },
                    });
                }
                if (Array.isArray(row.categoryIds)) {
                    await tx.item.update({
                        where: { id: row.id },
                        data: {
                            categories: {
                                set: row.categoryIds
                                    .filter((id) => categoryIds.has(id))
                                    .map((id) => ({ id })),
                            },
                        },
                    });
                }
            }
            await this.upsertScalars(tx, 'bookCopy', data.bookCopies ?? [], counters);
            await this.upsertScalars(tx, 'itemCopy', data.itemCopies ?? [], counters);
            await this.upsertScalars(tx, 'bookOperation', data.bookOperations ?? [], counters);
            await this.upsertScalars(tx, 'itemOperation', data.itemOperations ?? [], counters);
        }, { timeout: 120000, maxWait: 20000 });
        const snapshot = await this.exportAll();
        this.logger.log(`Sync merge -> created=${counters.created} updated=${counters.updated} skipped=${counters.skipped}`);
        return { ...snapshot, summary: counters };
    }
    async info() {
        const [categories, authors, itemTypes, physicalBooks, items, bookCopies, itemCopies] = await Promise.all([
            this.prisma.category.count(),
            this.prisma.author.count(),
            this.prisma.itemType.count(),
            this.prisma.physicalBook.count(),
            this.prisma.item.count(),
            this.prisma.bookCopy.count(),
            this.prisma.itemCopy.count(),
        ]);
        return {
            serverTime: new Date().toISOString(),
            counts: {
                categories,
                authors,
                itemTypes,
                physicalBooks,
                items,
                bookCopies,
                itemCopies,
            },
        };
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SyncService);


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncController = void 0;
const common_1 = __webpack_require__(3);
const sync_service_1 = __webpack_require__(103);
const sync_token_guard_1 = __webpack_require__(105);
let SyncController = class SyncController {
    constructor(syncService) {
        this.syncService = syncService;
    }
    info() {
        return this.syncService.info();
    }
    export() {
        return this.syncService.exportAll();
    }
    merge(payload) {
        return this.syncService.merge(payload);
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Get)('info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "info", null);
__decorate([
    (0, common_1.Get)('export'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "export", null);
__decorate([
    (0, common_1.Post)('merge'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SyncController.prototype, "merge", null);
exports.SyncController = SyncController = __decorate([
    (0, common_1.Controller)('sync'),
    (0, common_1.UseGuards)(sync_token_guard_1.SyncTokenGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof sync_service_1.SyncService !== "undefined" && sync_service_1.SyncService) === "function" ? _a : Object])
], SyncController);


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncTokenGuard = void 0;
const common_1 = __webpack_require__(3);
const crypto_1 = __webpack_require__(106);
let SyncTokenGuard = class SyncTokenGuard {
    canActivate(context) {
        const expected = process.env.SYNC_TOKEN;
        if (!expected) {
            throw new common_1.ServiceUnavailableException('La sincronización no está configurada en el servidor (falta SYNC_TOKEN)');
        }
        const request = context.switchToHttp().getRequest();
        const header = request.headers['x-sync-token'];
        const provided = Array.isArray(header) ? header[0] : header;
        if (typeof provided !== 'string' || !provided) {
            throw new common_1.UnauthorizedException('Token de sincronización ausente');
        }
        const a = Buffer.from(provided);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !(0, crypto_1.timingSafeEqual)(a, b)) {
            throw new common_1.UnauthorizedException('Token de sincronización inválido');
        }
        return true;
    }
};
exports.SyncTokenGuard = SyncTokenGuard;
exports.SyncTokenGuard = SyncTokenGuard = __decorate([
    (0, common_1.Injectable)()
], SyncTokenGuard);


/***/ }),
/* 106 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiBooksModule = void 0;
const common_1 = __webpack_require__(3);
const ai_books_service_1 = __webpack_require__(108);
const ai_books_controller_1 = __webpack_require__(113);
const config_1 = __webpack_require__(4);
const bulk_books_service_1 = __webpack_require__(42);
const books_service_1 = __webpack_require__(36);
let AiBooksModule = class AiBooksModule {
};
exports.AiBooksModule = AiBooksModule;
exports.AiBooksModule = AiBooksModule = __decorate([
    (0, common_1.Module)({
        controllers: [ai_books_controller_1.AiBooksController],
        providers: [ai_books_service_1.AiBooksService, bulk_books_service_1.BulkBooksService, books_service_1.BookService],
        imports: [
            config_1.ConfigModule,
        ],
    })
], AiBooksModule);


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiBooksService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const groq_1 = __webpack_require__(109);
const messages_1 = __webpack_require__(110);
const prisma_service_1 = __webpack_require__(6);
const book_extraction_schema_1 = __webpack_require__(111);
const book_extraction_schema_2 = __webpack_require__(111);
let AiBooksService = class AiBooksService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    onModuleInit() {
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (!apiKey)
            throw new Error('Falta la variable de entorno GROQ_API_KEY');
        const model = new groq_1.ChatGroq({
            apiKey: apiKey,
            model: 'openai/gpt-oss-120b',
            temperature: 0.1,
        });
        this.modelWithStructuredOutput = model.withStructuredOutput(book_extraction_schema_1.BookExtractionSchema, {
            name: 'book_extraction',
        });
        this.bulkModelWithStructuredOutput = model.withStructuredOutput(book_extraction_schema_2.BulkBookActionSchema, {
            name: 'bulk_book_execution',
        });
    }
    async processBookIntent(userInput, currentBookData) {
        const systemPrompt = `
      Eres un asistente experto de la Biblioteca Raúl Castillo en la UPT de Aragua.
      Analiza el mensaje del usuario y rellena los datos correspondientes.
      
      Reglas:
      1. Extrae los PNFs válidos: GENERAL, INFORMATICA, ELECTRONICA, MANTENIMIENTO, CONTADURIA, ADMINISTRACION, ELECTRICIDAD, MECANICA, INSTRUMENTACION, TELECOMUNICACIONES.
      2. Extrae los nombres de los autores en 'authors'.
      3. Si el usuario no menciona un campo de texto, ponlo como null. Si no menciona arreglos, ponlos como [].
    `;
        try {
            const response = await this.modelWithStructuredOutput.invoke([
                new messages_1.SystemMessage(systemPrompt),
                new messages_1.HumanMessage(userInput),
            ]);
            const result = response;
            const cleanedPayload = {};
            if (result.extractedData.title !== null)
                cleanedPayload.title = result.extractedData.title;
            if (result.extractedData.description !== null)
                cleanedPayload.description = result.extractedData.description;
            if (result.extractedData.routepdf !== null)
                cleanedPayload.routepdf = result.extractedData.routepdf;
            if (result.extractedData.routeimg !== null)
                cleanedPayload.routeimg = result.extractedData.routeimg;
            if (result.extractedData.pnfs && result.extractedData.pnfs.length > 0) {
                cleanedPayload.pnfs = result.extractedData.pnfs;
            }
            if (result.extractedData.authors && result.extractedData.authors.length > 0) {
                const resolvedAuthorIds = [];
                for (const authorName of result.extractedData.authors) {
                    const cleanedName = authorName.trim();
                    if (!cleanedName)
                        continue;
                    let author = await this.prisma.author.findFirst({
                        where: { name: { equals: cleanedName, mode: 'insensitive' } }
                    });
                    if (!author) {
                        author = await this.prisma.author.create({ data: { name: cleanedName } });
                    }
                    resolvedAuthorIds.push(author.id);
                }
                cleanedPayload.authorIds = resolvedAuthorIds;
            }
            return {
                message: result.message,
                extractedData: cleanedPayload
            };
        }
        catch (error) {
            console.error('Error procesando intención de IA unitaria:', error);
            return {
                message: 'Disculpa, ocurrió un inconveniente analizando la información.',
                extractedData: {}
            };
        }
    }
    async processBulkIntent(userInput) {
        const systemPrompt = `
      Eres el centro de mando inteligente de la Biblioteca Raúl Castillo en la UPT de Aragua.
      Procesas acciones múltiples (CREATE, UPDATE, DELETE). 
      Si un campo no viene explícito en la orden de un libro, no lo agregues en el JSON de ese registro.
    `;
        try {
            return await this.bulkModelWithStructuredOutput.invoke([
                new messages_1.SystemMessage(systemPrompt),
                new messages_1.HumanMessage(userInput),
            ]);
        }
        catch (error) {
            console.error('Error procesando intención masiva con Groq:', error);
            return { message: 'No se pudo procesar el lote por IA debido a un inconveniente técnico.', extractedData: [] };
        }
    }
};
exports.AiBooksService = AiBooksService;
exports.AiBooksService = AiBooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], AiBooksService);


/***/ }),
/* 109 */
/***/ ((module) => {

module.exports = require("@langchain/groq");

/***/ }),
/* 110 */
/***/ ((module) => {

module.exports = require("@langchain/core/messages");

/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BulkBookActionSchema = exports.BookExtractionSchema = void 0;
const zod_1 = __webpack_require__(112);
const PNF_ENUM = zod_1.z.enum([
    "GENERAL", "INFORMATICA", "ELECTRONICA", "MANTENIMIENTO",
    "CONTADURIA", "ADMINISTRACION", "ELECTRICIDAD",
    "MECANICA", "INSTRUMENTACION", "TELECOMUNICACIONES"
]);
exports.BookExtractionSchema = zod_1.z.object({
    message: zod_1.z.string().describe("Respuesta conversacional amigable para el usuario."),
    extractedData: zod_1.z.object({
        title: zod_1.z.string().nullable().describe("El título del libro si se menciona. Si no, null."),
        description: zod_1.z.string().nullable().describe("Resumen del libro si se menciona. Si no, null."),
        routepdf: zod_1.z.string().nullable().describe("La URL o ruta del PDF si se menciona. Si no, null."),
        routeimg: zod_1.z.string().nullable().describe("La URL o ruta de la portada si se menciona. Si no, null."),
        pnfs: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(PNF_ENUM)).describe("Lista de PNFs válidos."),
        authors: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(zod_1.z.string())).describe("Lista con los nombres de los autores mencionados.")
    })
});
exports.BulkBookActionSchema = zod_1.z.object({
    message: zod_1.z.string().describe("Respuesta inicial indicando el plan de ejecución por lote detectado."),
    extractedData: zod_1.z.array(zod_1.z.object({
        action: zod_1.z.enum(['CREATE', 'UPDATE', 'DELETE']).describe("La acción a ejecutar sobre este libro específico."),
        searchLookup: zod_1.z.string().nullable().describe("Criterio de búsqueda (título exacto o aproximado) requerido para UPDATE o DELETE."),
        title: zod_1.z.string().nullable().describe("Título del libro (Obligatorio para CREATE)."),
        description: zod_1.z.string().nullable().describe("Descripción del libro."),
        routepdf: zod_1.z.string().nullable().describe("Ruta del archivo PDF."),
        routeimg: zod_1.z.string().nullable().describe("Ruta de la imagen de portada."),
        pnfs: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(PNF_ENUM)).describe("Lista de PNFs asociados al libro. Si no hay ninguno, devolver array vacío []."),
        authors: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(zod_1.z.string())).describe("Lista de nombres de los autores del libro. Si no hay ninguno, devolver array vacío [].")
    })).describe("Arreglo con la lista de acciones a ejecutar. Debe ser una lista directa de objetos.")
});


/***/ }),
/* 112 */
/***/ ((module) => {

module.exports = require("zod");

/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiBooksController = void 0;
const common_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(55);
const ai_books_service_1 = __webpack_require__(108);
const bulk_books_service_1 = __webpack_require__(42);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_guard_1 = __webpack_require__(38);
const roles_decorator_1 = __webpack_require__(30);
const client_1 = __webpack_require__(7);
let AiBooksController = class AiBooksController {
    constructor(aiBooksService, bulkBooksService) {
        this.aiBooksService = aiBooksService;
        this.bulkBooksService = bulkBooksService;
    }
    async handleChatbotIntent(message, currentBookJson, file) {
        let contextInput = message || '';
        const currentBook = currentBookJson ? JSON.parse(currentBookJson) : undefined;
        if (file) {
            contextInput += `\n[Archivo adjunto detectado: "${file.originalname}"].`;
        }
        return this.aiBooksService.processBookIntent(contextInput, currentBook);
    }
    async handleBulkExecution(message, req, file) {
        let contextInput = message || '';
        if (file)
            contextInput += `\n[Archivo adjunto detectado: "${file.originalname}"].`;
        const aiResult = await this.aiBooksService.processBulkIntent(contextInput);
        const executionResult = await this.bulkBooksService.processBulkOperations(aiResult.extractedData, req);
        return {
            ...executionResult,
            aiAnalysis: aiResult.message
        };
    }
};
exports.AiBooksController = AiBooksController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)('message')),
    __param(1, (0, common_1.Body)('currentBook')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_d = typeof Express !== "undefined" && (_c = Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AiBooksController.prototype, "handleChatbotIntent", null);
__decorate([
    (0, common_1.Post)('bulk-execute'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)('message')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_f = typeof Express !== "undefined" && (_e = Express.Multer) !== void 0 && _e.File) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AiBooksController.prototype, "handleBulkExecution", null);
exports.AiBooksController = AiBooksController = __decorate([
    (0, common_1.Controller)('ai-books'),
    __metadata("design:paramtypes", [typeof (_a = typeof ai_books_service_1.AiBooksService !== "undefined" && ai_books_service_1.AiBooksService) === "function" ? _a : Object, typeof (_b = typeof bulk_books_service_1.BulkBooksService !== "undefined" && bulk_books_service_1.BulkBooksService) === "function" ? _b : Object])
], AiBooksController);


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInventoryModule = void 0;
const common_1 = __webpack_require__(3);
const ai_inventory_service_1 = __webpack_require__(115);
const ai_inventory_controller_1 = __webpack_require__(117);
const config_1 = __webpack_require__(4);
let AiInventoryModule = class AiInventoryModule {
};
exports.AiInventoryModule = AiInventoryModule;
exports.AiInventoryModule = AiInventoryModule = __decorate([
    (0, common_1.Module)({
        controllers: [ai_inventory_controller_1.AiInventoryController],
        providers: [ai_inventory_service_1.AiInventoryService],
        imports: [
            config_1.ConfigModule
        ]
    })
], AiInventoryModule);


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInventoryService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const groq_1 = __webpack_require__(109);
const messages_1 = __webpack_require__(110);
const inventory_extraction_schema_1 = __webpack_require__(116);
let AiInventoryService = class AiInventoryService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (!apiKey)
            throw new Error('Falta GROQ_API_KEY');
        const model = new groq_1.ChatGroq({
            apiKey,
            model: 'openai/gpt-oss-120b',
            temperature: 0.1,
        });
        this.modelWithStructuredOutput = model.withStructuredOutput(inventory_extraction_schema_1.InventoryExtractionSchema, {
            name: 'inventory_extraction',
        });
    }
    async processInventoryIntent(userInput, currentItemData) {
        let normalizedContext = null;
        if (currentItemData) {
            normalizedContext = {
                name: currentItemData.name || null,
                code: currentItemData.code || null,
                description: currentItemData.description || null,
                stock: currentItemData.totalStock?.toString() || '0',
                typeName: currentItemData.type?.name || null
            };
        }
        const systemPrompt = `
      Eres el asistente de gestión de inventarios de la plataforma UPTALib.
      Tu trabajo es procesar las solicitudes de los administradores para rellenar los datos de insumos, equipos o herramientas.
      
      Debes extraer: name, code, description, stock y typeName (el tipo o categoría del item).
      
      ${normalizedContext ? `CONTEXTO DE EDICIÓN: El administrador está modificando un item existente cuyos valores actuales son: ${JSON.stringify(normalizedContext)}. 
      Modifica, incrementa, decrementa o actualiza los datos basándote estrictamente en esta estructura. 
      Si el usuario pide cambiar el stock (ej. "Ponle 15" o "Súmale 2"), calcula o define el valor final y devuélvelo en la propiedad 'stock' como un string numérico.` : ''}
      
      Si el usuario no especifica un cambio en una propiedad, devuélvelo como null (o mantén el valor original del contexto si es edición). El stock debe ser retornado siempre como string numérico.
    `;
        try {
            return await this.modelWithStructuredOutput.invoke([
                new messages_1.SystemMessage(systemPrompt),
                new messages_1.HumanMessage(userInput),
            ]);
        }
        catch (error) {
            console.error('Error en AI Inventory:', error);
            return {
                message: 'No se pudo procesar la solicitud del inventario de forma automatizada.',
                extractedData: { name: null, code: null, description: null, stock: null, typeName: null }
            };
        }
    }
};
exports.AiInventoryService = AiInventoryService;
exports.AiInventoryService = AiInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], AiInventoryService);


/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryExtractionSchema = void 0;
const zod_1 = __webpack_require__(112);
exports.InventoryExtractionSchema = zod_1.z.object({
    message: zod_1.z.string().describe('Un mensaje amigable detallando qué características del item se lograron identificar.'),
    extractedData: zod_1.z.object({
        name: zod_1.z.string().nullable().describe('El nombre del objeto o equipo de inventario.'),
        code: zod_1.z.string().nullable().describe('El código interno de identificación o serial del item si se menciona.'),
        description: zod_1.z.string().nullable().describe('Una descripción breve sobre el estado físico, marca o uso del item.'),
        stock: zod_1.z.string().nullable().describe('La cantidad numérica total disponible para el registro.'),
        typeName: zod_1.z.string().nullable().describe('La categoría o tipo de item (ej. Computación, Mobiliario, Audiovisuales).')
    })
});


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiInventoryController = void 0;
const common_1 = __webpack_require__(3);
const ai_inventory_service_1 = __webpack_require__(115);
let AiInventoryController = class AiInventoryController {
    constructor(aiInventoryService) {
        this.aiInventoryService = aiInventoryService;
    }
    async handleInventoryIntent(message, currentItem) {
        return this.aiInventoryService.processInventoryIntent(message, currentItem);
    }
};
exports.AiInventoryController = AiInventoryController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)('message')),
    __param(1, (0, common_1.Body)('currentItem')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], AiInventoryController.prototype, "handleInventoryIntent", null);
exports.AiInventoryController = AiInventoryController = __decorate([
    (0, common_1.Controller)('ai-inventory'),
    __metadata("design:paramtypes", [typeof (_a = typeof ai_inventory_service_1.AiInventoryService !== "undefined" && ai_inventory_service_1.AiInventoryService) === "function" ? _a : Object])
], AiInventoryController);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiPhysicalBookModule = void 0;
const common_1 = __webpack_require__(3);
const ai_physical_book_service_1 = __webpack_require__(119);
const ai_physical_book_controller_1 = __webpack_require__(121);
const config_1 = __webpack_require__(4);
let AiPhysicalBookModule = class AiPhysicalBookModule {
};
exports.AiPhysicalBookModule = AiPhysicalBookModule;
exports.AiPhysicalBookModule = AiPhysicalBookModule = __decorate([
    (0, common_1.Module)({
        controllers: [ai_physical_book_controller_1.AiPhysicalBookController],
        providers: [ai_physical_book_service_1.AiPhysicalBookService],
        imports: [config_1.ConfigModule]
    })
], AiPhysicalBookModule);


/***/ }),
/* 119 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiPhysicalBookService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const groq_1 = __webpack_require__(109);
const messages_1 = __webpack_require__(110);
const book_extraction_schema_1 = __webpack_require__(120);
let AiPhysicalBookService = class AiPhysicalBookService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (!apiKey)
            throw new Error('Falta GROQ_API_KEY');
        const model = new groq_1.ChatGroq({
            apiKey,
            model: 'openai/gpt-oss-120b',
            temperature: 0.1,
        });
        this.modelWithStructuredOutput = model.withStructuredOutput(book_extraction_schema_1.BookExtractionSchema, {
            name: 'book_extraction',
        });
    }
    async processBookIntent(userInput, currentBookData) {
        let normalizedContext = null;
        if (currentBookData) {
            const authors = Array.isArray(currentBookData.authors) ? currentBookData.authors : (currentBookData.author ? [currentBookData.author] : []);
            const categories = Array.isArray(currentBookData.categories) ? currentBookData.categories : (currentBookData.category ? [currentBookData.category] : []);
            normalizedContext = {
                title: currentBookData.title || null,
                isbn: currentBookData.isbn || null,
                authorName: authors[0]?.name || authors[0] || null,
                categoryName: categories[0]?.name || categories[0] || null,
                pnf: currentBookData.pnf || null,
                yearOfPublication: currentBookData.yearOfPublication?.toString() || null,
                editorial: currentBookData.editorial || null,
                totalStock: currentBookData.availableStock?.toString() || '0'
            };
        }
        const systemPrompt = `
      Eres el asistente inteligente de gestión de biblioteca de la plataforma UPTALib.
      Tu trabajo es procesar las solicitudes de los administradores en lenguaje natural para rellenar los datos de un libro físico en el formulario.
      
      Debes extraer las siguientes propiedades: title, isbn, authorName, categoryName, pnf, yearOfPublication, editorial, totalStock.
      
      ${normalizedContext ? `CONTEXTO DE EDICIÓN: El administrador está modificando un libro existente cuyos valores actuales son: ${JSON.stringify(normalizedContext)}.
      Modifica, incrementa, decrementa o actualiza los datos basándote estrictamente en esta estructura.
      Si el usuario pide cambiar el stock (ej: "Súmale 5 al stock" o "Cámbiale la cantidad a 10"), calcula el valor final relativo al stock actual y devuélvelo en la propiedad 'totalStock' como un string numérico.` : ''}
      
      Si el usuario no especifica un cambio en una propiedad y no hay contexto de edición, devuélvela como null. Si hay contexto de edición, mantén el valor original del contexto si no se solicita alterarlo.
      Las propiedades 'yearOfPublication' y 'totalStock' deben ser retornadas siempre como un string numérico o null.
    `;
        try {
            return await this.modelWithStructuredOutput.invoke([
                new messages_1.SystemMessage(systemPrompt),
                new messages_1.HumanMessage(userInput),
            ]);
        }
        catch (error) {
            console.error('Error en AI Book Service:', error);
            return {
                message: 'No se pudo procesar la solicitud del libro de forma automatizada.',
                extractedData: {
                    title: null, isbn: null, authorName: null, categoryName: null,
                    pnf: null, yearOfPublication: null, editorial: null, totalStock: null
                }
            };
        }
    }
};
exports.AiPhysicalBookService = AiPhysicalBookService;
exports.AiPhysicalBookService = AiPhysicalBookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], AiPhysicalBookService);


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookExtractionSchema = void 0;
const zod_1 = __webpack_require__(112);
exports.BookExtractionSchema = zod_1.z.object({
    message: zod_1.z.string().describe('Un mensaje amigable indicando qué campos se procesaron o modificaron.'),
    extractedData: zod_1.z.object({
        title: zod_1.z.string().nullable().describe('El título del libro extraído de la solicitud.'),
        isbn: zod_1.z.string().nullable().describe('El código ISBN del libro.'),
        authorName: zod_1.z.string().nullable().describe('El nombre completo del autor del libro.'),
        categoryName: zod_1.z.string().nullable().describe('La categoría, género o materia del libro.'),
        pnf: zod_1.z.string().nullable().describe('El Programa Nacional de Formación asociado (ej. Informática, Mecánica, etc.).'),
        yearOfPublication: zod_1.z.string().nullable().describe('El año de publicación del libro devuelto como un string numérico.'),
        editorial: zod_1.z.string().nullable().describe('El nombre de la editorial.'),
        totalStock: zod_1.z.string().nullable().describe('La cantidad total de libros físicos disponibles.')
    })
});


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiPhysicalBookController = void 0;
const common_1 = __webpack_require__(3);
const ai_physical_book_service_1 = __webpack_require__(119);
let AiPhysicalBookController = class AiPhysicalBookController {
    constructor(aiBookService) {
        this.aiBookService = aiBookService;
    }
    async processIntent(body) {
        const { userInput, currentBookData } = body;
        if (!userInput || userInput.trim() === '') {
            throw new common_1.BadRequestException('El mensaje del usuario (userInput) es obligatorio.');
        }
        return await this.aiBookService.processBookIntent(userInput, currentBookData);
    }
};
exports.AiPhysicalBookController = AiPhysicalBookController;
__decorate([
    (0, common_1.Post)('process-intent'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], AiPhysicalBookController.prototype, "processIntent", null);
exports.AiPhysicalBookController = AiPhysicalBookController = __decorate([
    (0, common_1.Controller)('ai-books'),
    __metadata("design:paramtypes", [typeof (_a = typeof ai_physical_book_service_1.AiPhysicalBookService !== "undefined" && ai_physical_book_service_1.AiPhysicalBookService) === "function" ? _a : Object])
], AiPhysicalBookController);


/***/ }),
/* 122 */
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;