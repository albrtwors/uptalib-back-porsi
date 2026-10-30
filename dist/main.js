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
const swagger_1 = __webpack_require__(54);
const express = __importStar(__webpack_require__(24));
let cachedExpressApp;
async function bootstrapServer() {
    if (cachedExpressApp) {
        return cachedExpressApp;
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const cookieParser = __webpack_require__(133);
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
        const cookieParser = __webpack_require__(133);
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
const books_module_1 = __webpack_require__(36);
const inventory_module_1 = __webpack_require__(47);
const serve_static_1 = __webpack_require__(58);
const path_1 = __webpack_require__(59);
const platform_express_1 = __webpack_require__(60);
const physical_books_module_1 = __webpack_require__(61);
const category_module_1 = __webpack_require__(67);
const author_module_1 = __webpack_require__(72);
const pnf_module_1 = __webpack_require__(77);
const physical_book_operation_module_1 = __webpack_require__(82);
const item_type_module_1 = __webpack_require__(90);
const inventory_operation_module_1 = __webpack_require__(95);
const logs_module_1 = __webpack_require__(103);
const backup_module_1 = __webpack_require__(109);
const sync_module_1 = __webpack_require__(113);
const ai_books_module_1 = __webpack_require__(118);
const ai_inventory_module_1 = __webpack_require__(125);
const ai_physical_book_module_1 = __webpack_require__(129);
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
            pnf_module_1.PnfModule,
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
const jwt_strategy_1 = __webpack_require__(34);
const mail_module_1 = __webpack_require__(33);
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
const client_1 = __webpack_require__(7);
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
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        const data = await this.prisma.user.findMany({
            where,
            take,
            skip,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isBlocked: true,
                emailVerified: true,
            },
        });
        const totalPages = await this.prisma.user.count({ where });
        return { data, totalPages };
    }
    async createByAdmin(createUserDto) {
        const { email, password, name, role } = createUserDto;
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
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role,
                emailVerified: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isBlocked: true,
                emailVerified: true,
            },
        });
        return {
            status: 'success',
            message: 'Usuario creado correctamente',
            user,
        };
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
        if (!Object.values(client_1.Role).includes(newRole)) {
            throw new common_1.BadRequestException('Rol inválido');
        }
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: { role: newRole },
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            });
            return {
                status: 'success',
                message: 'Rol actualizado correctamente',
                user,
            };
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
        const user = this.getEnv('MAIL_USER');
        const password = this.getEnv('MAIL_PASSWORD');
        const clientId = this.getEnv('GOOGLE_CLIENT_ID');
        const clientSecret = this.getEnv('GOOGLE_CLIENT_SECRET');
        const refreshToken = this.getEnv('GOOGLE_REFRESH_TOKEN');
        const configuredService = this.getEnv('MAIL_SERVICE')?.toLowerCase();
        const host = this.getEnv('MAIL_HOST') ||
            (user?.toLowerCase().includes('@gmail.com')
                ? 'smtp.gmail.com'
                : undefined);
        const port = Number(this.getEnv('MAIL_PORT')) || 587;
        const secureValue = this.getEnv('MAIL_SECURE');
        const secure = secureValue ? secureValue === 'true' : port === 465;
        const useGmail = configuredService === 'gmail' ||
            configuredService === 'google' ||
            host?.toLowerCase() === 'smtp.gmail.com' ||
            user?.toLowerCase().endsWith('@gmail.com');
        const hasGoogleOAuth = Boolean(user && clientId && clientSecret && refreshToken);
        const hasPassword = Boolean(user && password);
        this.from =
            this.getEnv('MAIL_FROM') ||
                (user ? `UPTALib <${user}>` : 'UPTALib <no-reply@uptalib.com>');
        if (hasGoogleOAuth) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user,
                    clientId,
                    clientSecret,
                    refreshToken,
                },
            });
            this.mode = 'gmail-oauth2';
        }
        else if (hasPassword && useGmail) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user,
                    pass: password,
                },
            });
            this.mode = 'gmail-app-password';
        }
        else if (hasPassword) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: {
                    user,
                    pass: password,
                },
            });
            this.mode = 'smtp';
        }
        else if (host && !useGmail) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure,
            });
            this.mode = 'smtp';
        }
        else {
            this.transporter = null;
            this.mode = null;
        }
        if (!this.transporter) {
            this.logger.warn('Correo no configurado. Define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN y MAIL_USER, o MAIL_USER y MAIL_PASSWORD (contraseña de aplicación de Gmail).');
            return;
        }
        this.logger.log(`Servicio de correo configurado en modo ${this.mode}`);
    }
    getEnv(key) {
        const value = this.configService.get(key);
        if (value === undefined || value === null) {
            return undefined;
        }
        const normalized = String(value).trim();
        return normalized.length > 0 ? normalized : undefined;
    }
    async sendVerificationCode(to, code) {
        await this.send(to, 'Verifica tu cuenta de UPTALib', `Tu código de verificación es: ${code}. Expira en 15 minutos.`, 'Verifica tu cuenta');
    }
    async sendPasswordResetCode(to, code) {
        await this.send(to, 'Recuperación de contraseña - UPTALib', `Tu código para restablecer la contraseña es: ${code}. Expira en 15 minutos.`, 'Restablece tu contraseña');
    }
    async send(to, subject, message, heading) {
        if (!this.transporter) {
            this.logger.error('No se intentó enviar el correo porque el servicio no está configurado');
            throw new common_1.ServiceUnavailableException('El servicio de correo no está configurado. Contacta al administrador.');
        }
        try {
            const info = await this.transporter.sendMail({
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
            if (info.rejected?.length) {
                this.logger.warn(`El correo fue rechazado para: ${info.rejected.join(', ')}`);
            }
            if (info.messageId) {
                this.logger.log(`Correo enviado con id ${info.messageId} en modo ${this.mode}`);
            }
        }
        catch (error) {
            const mailError = error;
            const details = [mailError.message, mailError.code, mailError.response]
                .filter(Boolean)
                .join(' | ');
            this.logger.error(`No se pudo enviar el correo a ${to}: ${details}`, mailError.stack);
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
const mail_module_1 = __webpack_require__(33);
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(11);
const user_dto_1 = __webpack_require__(29);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_guard_1 = __webpack_require__(30);
const roles_decorator_1 = __webpack_require__(31);
const get_user_decorator_1 = __webpack_require__(32);
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
    createByAdmin(createUserAdminDto) {
        return this.usersService.createByAdmin(createUserAdminDto);
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
    (0, common_1.Post)(''),
    (0, roles_decorator_1.Roles)(user_dto_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof user_dto_1.CreateUserAdminDto !== "undefined" && user_dto_1.CreateUserAdminDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createByAdmin", null);
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Patch)('unblock/:id'),
    (0, roles_decorator_1.Roles)(user_dto_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "unBlockUser", null);
__decorate([
    (0, common_1.Patch)('role/:id'),
    (0, roles_decorator_1.Roles)(user_dto_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_d = typeof user_dto_1.Role !== "undefined" && user_dto_1.Role) === "function" ? _d : Object]),
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
exports.CreateUserAdminDto = exports.CreateUserDto = exports.Role = void 0;
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
class CreateUserAdminDto {
}
exports.CreateUserAdminDto = CreateUserAdminDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Role),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "role", void 0);


/***/ }),
/* 30 */
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
const roles_decorator_1 = __webpack_require__(31);
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
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(3);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 32 */
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
/* 33 */
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
/* 34 */
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
const passport_jwt_1 = __webpack_require__(35);
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
/* 35 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 36 */
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
const books_service_1 = __webpack_require__(37);
const books_controller_1 = __webpack_require__(43);
const prisma_module_1 = __webpack_require__(5);
const bulk_books_service_1 = __webpack_require__(46);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(6);
const pnf_1 = __webpack_require__(38);
const bulk_1 = __webpack_require__(39);
const deleteFile_1 = __webpack_require__(40);
let BookService = class BookService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        return await this.prisma.book.findUnique({
            where: { id },
            include: {
                pnfs: { include: { pnf: true } },
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
        const normalizedPnf = (0, pnf_1.normalizePnfFilter)(pnf);
        if (normalizedPnf && normalizedPnf.trim() !== "") {
            andConditions.push({
                pnfs: {
                    some: {
                        pnf: {
                            name: { equals: normalizedPnf, mode: 'insensitive' }
                        }
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
                pnfs: { include: { pnf: true } },
                authors: true
            },
            orderBy: { id: 'desc' }
        });
        return { data, totalPages };
    }
    async create(data, req) {
        const { title, description, routepdf, routeimg, pnfs = [], authorIds = [] } = data;
        const resolvedPnfIds = await (0, pnf_1.resolvePnfIds)(this.prisma, [], pnfs);
        const book = await this.prisma.book.create({
            data: {
                title,
                description,
                routepdf,
                routeimg,
                authors: {
                    connect: authorIds.map(id => ({ id }))
                }
            }
        });
        if (resolvedPnfIds.length > 0) {
            await this.prisma.bookPnf.createMany({
                data: resolvedPnfIds.map((pnfId) => ({ bookId: book.id, pnfId }))
            });
        }
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
    async deleteMany(ids, req) {
        let deleted = 0;
        const errors = [];
        for (const id of ids) {
            try {
                const book = await this.prisma.book.findFirst({ where: { id } });
                if (!book)
                    throw new common_1.NotFoundException('El libro no existe');
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
                await this.prisma.bookPnf.deleteMany({ where: { bookId: id } });
                await this.prisma.savedBook.deleteMany({ where: { bookId: id } });
                await this.prisma.book.delete({ where: { id } });
                deleted++;
            }
            catch (error) {
                errors.push({ id, message: (0, bulk_1.bulkErrorMessage)(error) });
            }
        }
        await this.prisma.operation.create({
            data: {
                userId: req.user.userId,
                ip: req.ip,
                action: `Eliminó ${deleted} libro(s) digital(es) en lote`
            }
        });
        return {
            status: 'success',
            message: (0, bulk_1.bulkSummaryMessage)({ deleted, failed: errors.length }),
            data: { deleted, errors }
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
        if (pnfs !== undefined) {
            const resolvedPnfIds = await (0, pnf_1.resolvePnfIds)(this.prisma, [], pnfs);
            await this.prisma.bookPnf.deleteMany({ where: { bookId: id } });
            if (resolvedPnfIds.length > 0) {
                await this.prisma.bookPnf.createMany({
                    data: resolvedPnfIds.map((pnfId) => ({ bookId: id, pnfId }))
                });
            }
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
                include: { pnfs: { include: { pnf: true } }, authors: true }
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
                    include: { pnfs: { include: { pnf: true } }, authors: true }
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
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizePnfName = normalizePnfName;
exports.normalizePnfFilter = normalizePnfFilter;
exports.ensurePnf = ensurePnf;
exports.resolvePnfIds = resolvePnfIds;
const common_1 = __webpack_require__(3);
function normalizePnfName(value) {
    return `${value ?? ''}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();
}
function normalizePnfFilter(value) {
    const name = normalizePnfName(value);
    return !name || ['TODOS', 'UNDEFINED', 'NULL'].includes(name) ? '' : name;
}
async function ensurePnf(tx, value) {
    const name = normalizePnfName(value);
    if (!name)
        return null;
    const existing = await tx.pnf.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
    });
    if (existing)
        return existing;
    try {
        return await tx.pnf.create({ data: { name } });
    }
    catch (error) {
        if (error?.code === 'P2002') {
            return tx.pnf.findFirst({
                where: { name: { equals: name, mode: 'insensitive' } },
            });
        }
        throw error;
    }
}
async function resolvePnfIds(tx, ids = [], names = []) {
    const resolved = [];
    for (const id of ids) {
        const cleanId = `${id ?? ''}`.trim();
        if (!cleanId)
            continue;
        const pnf = await tx.pnf.findUnique({ where: { id: cleanId } });
        if (!pnf)
            throw new common_1.BadRequestException('Uno de los PNF seleccionados no existe');
        if (!resolved.includes(pnf.id))
            resolved.push(pnf.id);
    }
    for (const value of names) {
        const pnf = await ensurePnf(tx, value);
        if (pnf && !resolved.includes(pnf.id))
            resolved.push(pnf.id);
    }
    return resolved;
}


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bulkErrorMessage = bulkErrorMessage;
exports.bulkSummaryMessage = bulkSummaryMessage;
function bulkErrorMessage(error) {
    const message = error?.message ?? error?.response ?? 'Error desconocido';
    if (Array.isArray(message))
        return message.join('. ');
    return `${message}`;
}
function bulkSummaryMessage(parts) {
    const summary = [];
    if (parts.created)
        summary.push(`${parts.created} creado(s)`);
    if (parts.updated)
        summary.push(`${parts.updated} actualizado(s)`);
    if (parts.deleted)
        summary.push(`${parts.deleted} eliminado(s)`);
    if (parts.failed)
        summary.push(`${parts.failed} con error`);
    return summary.length > 0 ? `Operación en lote: ${summary.join(', ')}` : 'No se procesó ningún registro';
}


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteFile = deleteFile;
const supabase_1 = __webpack_require__(41);
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
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.supabase = void 0;
const supabase_js_1 = __webpack_require__(42);
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);


/***/ }),
/* 42 */
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),
/* 43 */
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
exports.BookController = void 0;
const common_1 = __webpack_require__(3);
const books_service_1 = __webpack_require__(37);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_guard_1 = __webpack_require__(30);
const roles_decorator_1 = __webpack_require__(31);
const client_1 = __webpack_require__(7);
const deleteFile_1 = __webpack_require__(40);
const bulk_ids_dto_1 = __webpack_require__(44);
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
    bulkDelete(bulkIdsDto, req) {
        return this.bookService.deleteMany(bulkIdsDto.ids, req);
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
    (0, common_1.Post)('bulk-delete'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bulk_ids_dto_1.BulkIntIdsDto !== "undefined" && bulk_ids_dto_1.BulkIntIdsDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "bulkDelete", null);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BulkIntIdsDto = exports.BulkIdsDto = void 0;
const class_transformer_1 = __webpack_require__(45);
const class_validator_1 = __webpack_require__(19);
class BulkIdsDto {
}
exports.BulkIdsDto = BulkIdsDto;
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Los IDs deben ser un arreglo' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Debes seleccionar al menos un registro' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ID debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], BulkIdsDto.prototype, "ids", void 0);
class BulkIntIdsDto {
}
exports.BulkIntIdsDto = BulkIntIdsDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => Array.isArray(value) ? value.map((v) => parseInt(`${v}`)) : value),
    (0, class_validator_1.IsArray)({ message: 'Los IDs deben ser un arreglo' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Debes seleccionar al menos un registro' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Cada ID debe ser un número entero' }),
    __metadata("design:type", Array)
], BulkIntIdsDto.prototype, "ids", void 0);


/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 46 */
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
const books_service_1 = __webpack_require__(37);
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
/* 47 */
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
const inventory_service_1 = __webpack_require__(48);
const inventory_controller_1 = __webpack_require__(52);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(49);
const getPagination_1 = __webpack_require__(16);
const getDifference_1 = __importDefault(__webpack_require__(50));
const copies_1 = __webpack_require__(51);
const bulk_1 = __webpack_require__(39);
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveTypeIds(tx, ids = [], names = []) {
        const resolved = [];
        for (const id of ids) {
            if (id && !resolved.includes(id))
                resolved.push(id);
        }
        for (const name of names) {
            const cleaned = `${name}`.trim();
            if (!cleaned)
                continue;
            let itemType = await tx.itemType.findFirst({
                where: { name: { equals: cleaned, mode: 'insensitive' } },
            });
            if (!itemType) {
                itemType = await tx.itemType.create({ data: { name: cleaned } });
            }
            if (!resolved.includes(itemType.id))
                resolved.push(itemType.id);
        }
        return resolved;
    }
    async createCopies(tx, item, quantity, requestedCodes = [], extra = {}) {
        return (0, copies_1.createItemCopies)(tx, item, quantity, requestedCodes, extra);
    }
    async reconcileCopies(tx, item, targetTotal, requestedCodes = []) {
        const copies = await tx.itemCopy.findMany({
            where: { itemId: item.id },
            orderBy: { createdAt: 'asc' },
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
                ...removable.filter((c) => c.status !== client_1.CopyStatus.DISPONIBLE),
            ];
            for (let i = 0; i < Math.abs(diff); i += 1) {
                await tx.itemCopy.update({
                    where: { id: ordered[i].id },
                    data: { status: client_1.CopyStatus.BAJA },
                });
            }
        }
        return true;
    }
    async create(createInventoryDto) {
        return this.prisma.$transaction(async (tx) => {
            const { typeId, typeName, typeIds = [], typeNames = [], stock, copyCodes = [], ...restOfDto } = createInventoryDto;
            const resolvedTypeIds = await this.resolveTypeIds(tx, [...(typeId ? [typeId] : []), ...typeIds], [...(typeName ? [typeName] : []), ...typeNames]);
            if (resolvedTypeIds.length === 0) {
                throw new common_1.BadRequestException('Debes seleccionar al menos un tipo');
            }
            const parsedStock = parseInt(stock) || 0;
            const item = await tx.item.create({
                data: {
                    ...restOfDto,
                    availableStock: 0,
                    totalStock: 0,
                    status: 'DISPONIBLE',
                    types: {
                        connect: resolvedTypeIds.map((id) => ({ id })),
                    },
                },
                include: {
                    types: { select: { id: true, name: true } },
                },
            });
            await this.createCopies(tx, item, parsedStock, Array.isArray(copyCodes) ? copyCodes : []);
            await (0, copies_1.recalcItemStock)(tx, item.id);
            const withStock = await tx.item.findUnique({
                where: { id: item.id },
                include: {
                    types: { select: { id: true, name: true } },
                    copies: { orderBy: { createdAt: 'asc' } },
                },
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
                types: {
                    some: {
                        name: { contains: query.type, mode: 'insensitive' },
                    },
                },
            };
            if (!where.AND)
                where.AND = [typeFilter];
            else
                where.AND.push(typeFilter);
        }
        const totalPages = Math.ceil((await this.prisma.item.count({ where })) / take);
        const data = await this.prisma.item.findMany({
            where,
            skip,
            take,
            include: {
                types: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { data, totalPages };
    }
    async findOne(id) {
        const item = await this.prisma.item.findUnique({
            where: { id },
            include: {
                types: { select: { id: true, name: true } },
                copies: { orderBy: { createdAt: 'asc' } },
            },
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
            const { typeId, typeName, typeIds, typeNames, stock, copyCodes, ...restOfDto } = updateInventoryDto;
            const typesProvided = typeId !== undefined ||
                typeName !== undefined ||
                typeIds !== undefined ||
                typeNames !== undefined;
            const resolvedTypeIds = typesProvided
                ? await this.resolveTypeIds(tx, [...(typeId ? [typeId] : []), ...(typeIds ?? [])], [...(typeName ? [typeName] : []), ...(typeNames ?? [])])
                : [];
            if (typesProvided && resolvedTypeIds.length === 0) {
                throw new common_1.BadRequestException('Debes seleccionar al menos un tipo');
            }
            const targetTotal = stock !== undefined ? parseInt(stock) : existingItem.totalStock;
            const hasCopies = await this.reconcileCopies(tx, existingItem, targetTotal, Array.isArray(copyCodes) ? copyCodes : []);
            const updateData = {
                ...restOfDto,
            };
            if (!hasCopies) {
                const parsedStock = parseInt(stock) || existingItem.totalStock;
                const newValue = (0, getDifference_1.default)({
                    oldAvailableStockValue: existingItem.availableStock,
                    oldCurrentStockValue: existingItem.totalStock,
                    newStockValue: parsedStock,
                });
                if (newValue < 0) {
                    throw new common_1.HttpException('Hay préstamos pendientes que impiden que reduzcas tanto el stock', common_1.HttpStatus.BAD_REQUEST);
                }
                updateData.availableStock = parsedStock;
                updateData.totalStock = newValue;
                updateData.status = 'DISPONIBLE';
            }
            if (typesProvided) {
                updateData.types = {
                    set: resolvedTypeIds.map((id) => ({ id })),
                };
            }
            let item = await tx.item.update({
                where: { id },
                data: updateData,
                include: {
                    types: { select: { id: true, name: true } },
                },
            });
            if (hasCopies) {
                await (0, copies_1.recalcItemStock)(tx, id);
                item = await tx.item.findUnique({
                    where: { id },
                    include: {
                        types: { select: { id: true, name: true } },
                    },
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
    async bulkUpsert(records) {
        const created = [];
        const updated = [];
        const errors = [];
        for (let index = 0; index < records.length; index++) {
            const record = records[index] ?? {};
            const { id, ...data } = record;
            const name = `${record.name ?? ''}`.trim() || `Registro ${index + 1}`;
            const hasTypes = [record.typeId, record.typeName].some((value) => `${value ?? ''}`.trim()) ||
                (Array.isArray(record.typeIds) && record.typeIds.length > 0) ||
                (Array.isArray(record.typeNames) && record.typeNames.length > 0);
            const missing = [];
            if (!id && !`${data.name ?? ''}`.trim())
                missing.push('name');
            if (!id && [undefined, null, ''].includes(data.stock))
                missing.push('stock');
            if (!id && !hasTypes)
                missing.push('typeIds/typeNames');
            if (missing.length > 0) {
                errors.push({
                    index,
                    name,
                    message: `Faltan campos obligatorios: ${missing.join(', ')}`,
                });
                continue;
            }
            try {
                const result = id ? await this.edit(id, data) : await this.create(data);
                (id ? updated : created).push(result?.item ?? result);
            }
            catch (error) {
                errors.push({ index, name, message: (0, bulk_1.bulkErrorMessage)(error) });
            }
        }
        return {
            status: 'success',
            message: (0, bulk_1.bulkSummaryMessage)({
                created: created.length,
                updated: updated.length,
                failed: errors.length,
            }),
            data: { created, updated, errors },
        };
    }
    async removeMany(ids) {
        const deleted = await this.prisma.$transaction(async (tx) => {
            await tx.itemOperation.deleteMany({ where: { itemId: { in: ids } } });
            return (await tx.item.deleteMany({ where: { id: { in: ids } } })).count;
        });
        return {
            status: 'success',
            message: (0, bulk_1.bulkSummaryMessage)({ deleted, failed: ids.length - deleted }),
            data: { deleted },
        };
    }
    async addCopies(id, dto) {
        return this.prisma.$transaction(async (tx) => {
            const item = await tx.item.findUnique({ where: { id } });
            if (!item)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            const requestedCodes = Array.isArray(dto.codes)
                ? dto.codes
                : [];
            const quantity = dto.quantity !== undefined
                ? parseInt(dto.quantity)
                : requestedCodes.length;
            if (!quantity || quantity <= 0) {
                throw new common_1.BadRequestException('Debes indicar al menos un ejemplar');
            }
            await this.createCopies(tx, item, quantity, requestedCodes, {
                location: dto.location,
                observations: dto.observations,
                codeFrom: dto.codeFrom,
                codeTo: dto.codeTo,
            });
            const summary = await (0, copies_1.recalcItemStock)(tx, id);
            const copies = await tx.itemCopy.findMany({
                where: { itemId: id },
                orderBy: { createdAt: 'asc' },
            });
            return {
                status: 'success',
                message: 'Ejemplares agregados',
                data: { copies, summary },
            };
        });
    }
    async findCopies(id) {
        const item = await this.prisma.item.findUnique({ where: { id } });
        if (!item)
            throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
        const copies = await this.prisma.itemCopy.findMany({
            where: { itemId: id },
            orderBy: { createdAt: 'asc' },
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
            return {
                status: 'success',
                message: 'Ejemplar actualizado',
                data: { copy: updated, summary },
            };
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
            return {
                status: 'success',
                message: 'Ejemplar eliminado',
                data: { summary },
            };
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InventoryService);


/***/ }),
/* 49 */
/***/ ((module) => {

module.exports = require("prisma/prisma.service");

/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = getStockDifference;
function getStockDifference({ newStockValue, oldCurrentStockValue, oldAvailableStockValue }) {
    const difference = oldCurrentStockValue - oldAvailableStockValue;
    const newValue = newStockValue - difference;
    return newValue;
}


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CAN_ENTER = exports.CAN_DROP = void 0;
exports.bookCopyBase = bookCopyBase;
exports.itemCopyBase = itemCopyBase;
exports.buildRangeCodes = buildRangeCodes;
exports.buildCopyCodes = buildCopyCodes;
exports.createBookCopies = createBookCopies;
exports.createItemCopies = createItemCopies;
exports.recalcBookStock = recalcBookStock;
exports.recalcItemStock = recalcItemStock;
exports.applyCopyStatus = applyCopyStatus;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(7);
function sanitize(seed) {
    const clean = `${seed}`.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return clean.slice(0, 8) || 'GEN';
}
function copyBase(assignedCode, kind, fallbackSeed) {
    const code = `${assignedCode ?? ''}`.trim();
    if (code)
        return code.toUpperCase().replace(/\s+/g, '-');
    return `${kind}-${sanitize(fallbackSeed)}`;
}
function bookCopyBase(book) {
    return copyBase(book.code, 'LIB', `${book.isbn ?? ''}`.trim() || book.id);
}
function itemCopyBase(item) {
    return copyBase(item.code, 'ART', item.id);
}
function highestSequence(base, used) {
    const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const sameBase = new RegExp(`^${escaped}-(\\d+)$`);
    const anyTrailingNumber = /(\d+)$/;
    let highest = 0;
    let width = 4;
    for (const code of used) {
        if (code === base.toUpperCase())
            continue;
        const match = sameBase.exec(code) ?? anyTrailingNumber.exec(code);
        if (!match)
            continue;
        const parsed = parseInt(match[1], 10);
        if (Number.isNaN(parsed) || parsed <= highest)
            continue;
        highest = parsed;
        width = Math.max(match[1].length, 2);
    }
    return { next: highest + 1, width };
}
function nextSequentialCode(base, used) {
    const { next, width } = highestSequence(base, used);
    let n = next;
    let candidate;
    do {
        candidate = `${base}-${String(n).padStart(width, '0')}`;
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
function parseRangeBound(value) {
    const trimmed = value.trim();
    const match = trimmed.match(/^(.*?)(\d+)$/);
    if (match) {
        return {
            prefix: match[1],
            start: parseInt(match[2], 10),
            width: match[2].length,
        };
    }
    const prefix = /[-_\s]$/.test(trimmed) ? trimmed : `${trimmed}-`;
    return { prefix, start: 1, width: 4 };
}
function buildRangeCodes(range, quantity) {
    const from = `${range.from ?? ''}`.trim();
    const to = `${range.to ?? ''}`.trim();
    if (!from && !to)
        return [];
    if (!from)
        throw new common_1.BadRequestException('Debes indicar el código inicial del rango');
    if (quantity <= 0)
        return [];
    const startBound = parseRangeBound(from);
    let endNumber = startBound.start + quantity - 1;
    if (to) {
        const endBound = parseRangeBound(to);
        if (endBound.prefix !== startBound.prefix) {
            throw new common_1.BadRequestException('El código inicial y final del rango deben compartir el mismo prefijo');
        }
        if (endBound.start < startBound.start) {
            throw new common_1.BadRequestException('El código final del rango no puede ser menor que el inicial');
        }
        const capacity = endBound.start - startBound.start + 1;
        if (quantity > capacity) {
            throw new common_1.BadRequestException(`El rango indicado solo permite ${capacity} ejemplares`);
        }
        endNumber = endBound.start;
    }
    const codes = [];
    for (let n = startBound.start; n <= endNumber && codes.length < quantity; n += 1) {
        codes.push(`${startBound.prefix}${String(n).padStart(startBound.width, '0')}`);
    }
    return codes;
}
function buildCopyCodes(base, quantity, existing = [], requestedCodes = [], range = {}) {
    const used = new Set([...existing].map((c) => c.toUpperCase()));
    const requested = (requestedCodes ?? []).map((c) => `${c}`.trim()).filter(Boolean);
    const rangeCodes = buildRangeCodes(range, quantity);
    const codes = [];
    for (let i = 0; i < quantity; i += 1) {
        let code = requested[i];
        if (!code && rangeCodes[i]) {
            code = rangeCodes[i];
            if (used.has(code.toUpperCase())) {
                throw new common_1.BadRequestException(`El código ${code} del rango ya existe`);
            }
        }
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
    const codes = buildCopyCodes(bookCopyBase(book), quantity, existing.map((c) => c.code), requestedCodes, { from: extra.codeFrom, to: extra.codeTo });
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
    const codes = buildCopyCodes(itemCopyBase(item), quantity, existing.map((c) => c.code), requestedCodes, { from: extra.codeFrom, to: extra.codeTo });
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
exports.CAN_DROP = [client_1.CopyStatus.DISPONIBLE, client_1.CopyStatus.MANTENIMIENTO];
exports.CAN_ENTER = [client_1.CopyStatus.BAJA, client_1.CopyStatus.MANTENIMIENTO];
const COPY_ACCESS = {
    book: { model: 'bookCopy', fk: 'bookId', recalc: recalcBookStock },
    item: { model: 'itemCopy', fk: 'itemId', recalc: recalcItemStock },
};
async function applyCopyStatus(tx, kind, parentId, copyIds, target, allowed) {
    const access = COPY_ACCESS[kind];
    const ids = [...new Set((copyIds ?? []).map((id) => `${id}`.trim()).filter(Boolean))];
    if (ids.length === 0)
        throw new common_1.BadRequestException('Debes seleccionar al menos un ejemplar');
    const copies = await tx[access.model].findMany({
        where: { id: { in: ids } },
        select: { id: true, code: true, status: true, [access.fk]: true },
    });
    if (copies.length !== ids.length) {
        throw new common_1.HttpException('Uno o más ejemplares no existen', common_1.HttpStatus.NOT_FOUND);
    }
    const wrongParent = copies.find((c) => c[access.fk] !== parentId);
    if (wrongParent) {
        throw new common_1.BadRequestException(`El ejemplar ${wrongParent.code} no pertenece a este recurso`);
    }
    const invalid = copies.find((c) => !allowed.includes(c.status));
    if (invalid) {
        throw new common_1.BadRequestException(`El ejemplar ${invalid.code} no permite esta operación (estado actual: ${invalid.status})`);
    }
    const updated = [];
    for (const copy of copies) {
        updated.push(await tx[access.model].update({
            where: { id: copy.id },
            data: { status: target },
        }));
    }
    await access.recalc(tx, parentId);
    return updated;
}


/***/ }),
/* 52 */
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
exports.InventoryController = void 0;
const common_1 = __webpack_require__(3);
const inventory_service_1 = __webpack_require__(48);
const edit_item_dto_1 = __webpack_require__(53);
const create_inventory_dto_1 = __webpack_require__(55);
const bulk_ids_dto_1 = __webpack_require__(44);
const bulk_inventory_dto_1 = __webpack_require__(56);
const client_1 = __webpack_require__(7);
const roles_guard_1 = __webpack_require__(30);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_decorator_1 = __webpack_require__(31);
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    create(createInventoryDto) {
        return this.inventoryService.create(createInventoryDto);
    }
    bulk(bulkInventoryDto) {
        return this.inventoryService.bulkUpsert(bulkInventoryDto.records);
    }
    bulkDelete(bulkIdsDto) {
        return this.inventoryService.removeMany(bulkIdsDto.ids);
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
    (0, common_1.Post)('bulk'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bulk_inventory_dto_1.BulkInventoryDto !== "undefined" && bulk_inventory_dto_1.BulkInventoryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "bulk", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof bulk_ids_dto_1.BulkIdsDto !== "undefined" && bulk_ids_dto_1.BulkIdsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "bulkDelete", null);
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
    __metadata("design:paramtypes", [String, typeof (_e = typeof edit_item_dto_1.EditItemInventory !== "undefined" && edit_item_dto_1.EditItemInventory) === "function" ? _e : Object]),
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
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EditItemInventory = void 0;
const swagger_1 = __webpack_require__(54);
const create_inventory_dto_1 = __webpack_require__(55);
class EditItemInventory extends (0, swagger_1.PartialType)(create_inventory_dto_1.CreateInventoryDto) {
}
exports.EditItemInventory = EditItemInventory;


/***/ }),
/* 54 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 55 */
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
const class_transformer_1 = __webpack_require__(45);
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
    (0, class_validator_1.IsString)({ message: 'El código debe ser cadena de texto' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser texto' }),
    (0, class_validator_1.MaxLength)(200, {
        message: 'La descripción debe tener un máximo de 200 caracteres',
    }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los tipos deben ser un arreglo' }),
    (0, class_validator_1.IsString)({
        each: true,
        message: 'Cada ID de tipo debe ser una cadena de texto',
    }),
    __metadata("design:type", Array)
], CreateInventoryDto.prototype, "typeIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los tipos deben ser un arreglo' }),
    (0, class_validator_1.IsString)({
        each: true,
        message: 'Cada nombre de tipo debe ser una cadena de texto',
    }),
    __metadata("design:type", Array)
], CreateInventoryDto.prototype, "typeNames", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del tipo debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "typeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre del tipo debe ser texto' }),
    (0, class_validator_1.MinLength)(2, {
        message: 'El nombre del tipo debe tener mínimo 2 caracteres',
    }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "typeName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los códigos de ejemplar deben ser un arreglo' }),
    (0, class_validator_1.IsString)({
        each: true,
        message: 'Cada código de ejemplar debe ser una cadena de texto',
    }),
    __metadata("design:type", Array)
], CreateInventoryDto.prototype, "copyCodes", void 0);


/***/ }),
/* 56 */
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
exports.BulkInventoryDto = exports.BulkInventoryRecordDto = void 0;
const class_transformer_1 = __webpack_require__(45);
const class_validator_1 = __webpack_require__(19);
const update_inventory_dto_1 = __webpack_require__(57);
class BulkInventoryRecordDto extends update_inventory_dto_1.UpdateInventory {
}
exports.BulkInventoryRecordDto = BulkInventoryRecordDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del registro debe ser una cadena de texto' }),
    __metadata("design:type", String)
], BulkInventoryRecordDto.prototype, "id", void 0);
class BulkInventoryDto {
}
exports.BulkInventoryDto = BulkInventoryDto;
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Los registros deben ser un arreglo' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Debes incluir al menos un registro' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BulkInventoryRecordDto),
    __metadata("design:type", Array)
], BulkInventoryDto.prototype, "records", void 0);


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateInventory = void 0;
const swagger_1 = __webpack_require__(54);
const create_inventory_dto_1 = __webpack_require__(55);
class UpdateInventory extends (0, swagger_1.PartialType)(create_inventory_dto_1.CreateInventoryDto) {
}
exports.UpdateInventory = UpdateInventory;


/***/ }),
/* 58 */
/***/ ((module) => {

module.exports = require("@nestjs/serve-static");

/***/ }),
/* 59 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 60 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

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
exports.PhysicalBooksModule = void 0;
const common_1 = __webpack_require__(3);
const physical_books_service_1 = __webpack_require__(62);
const physical_books_controller_1 = __webpack_require__(63);
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
exports.PhysicalBooksService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(49);
const copies_1 = __webpack_require__(51);
const pnf_1 = __webpack_require__(38);
const bulk_1 = __webpack_require__(39);
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
    async reconcileCopies(tx, book, targetTotal, requestedCodes = [], extra = {}) {
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
            await this.createCopies(tx, book, diff, requestedCodes, extra);
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
            const { authorId, authorName, authorIds = [], authorNames = [], categoryId, categoryName, categoryIds = [], categoryNames = [], pnf, pnfId, pnfIds = [], pnfNames = [], pnfs = [], code, copyCodes = [], codeFrom, codeTo, totalStock, ...restOfDto } = createPhysicalBookDto;
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
            let resolvedPnfIds = await (0, pnf_1.resolvePnfIds)(tx, [pnfId, ...(Array.isArray(pnfIds) ? pnfIds : [])], [pnf, ...(Array.isArray(pnfs) ? pnfs : []), ...(Array.isArray(pnfNames) ? pnfNames : [])]);
            if (resolvedPnfIds.length === 0) {
                resolvedPnfIds = await (0, pnf_1.resolvePnfIds)(tx, [], ['GENERAL']);
            }
            const parsedTotal = parseInt(totalStock) || 0;
            const cleanCode = `${code ?? ''}`.trim() || null;
            let physicalBook;
            try {
                physicalBook = await tx.physicalBook.create({
                    data: {
                        ...restOfDto,
                        code: cleanCode,
                        yearOfPublication: parseInt(restOfDto.yearOfPublication) || undefined,
                        totalStock: 0,
                        availableStock: 0,
                        authors: {
                            connect: resolvedAuthorIds.map(id => ({ id }))
                        },
                        categories: {
                            connect: resolvedCategoryIds.map(id => ({ id }))
                        },
                        pnfs: {
                            connect: resolvedPnfIds.map(id => ({ id }))
                        }
                    },
                    include: {
                        authors: { select: { id: true, name: true } },
                        categories: { select: { id: true, name: true } },
                        pnfs: true
                    }
                });
            }
            catch (error) {
                if (error?.code === 'P2002') {
                    throw new common_1.ConflictException('Ya existe un libro físico con ese código');
                }
                throw error;
            }
            await this.createCopies(tx, physicalBook, parsedTotal, Array.isArray(copyCodes) ? copyCodes : [], { codeFrom, codeTo });
            await (0, copies_1.recalcBookStock)(tx, physicalBook.id);
            const withStock = await tx.physicalBook.findUnique({
                where: { id: physicalBook.id },
                include: {
                    authors: { select: { id: true, name: true } },
                    categories: { select: { id: true, name: true } },
                    pnfs: true,
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
            const { authorId, authorName, authorIds, authorNames, categoryId, categoryName, categoryIds, categoryNames, pnf, pnfId, pnfIds, pnfNames, pnfs, code, copyCodes, codeFrom, codeTo, totalStock, ...restOfDto } = updatePhysicalBookDto;
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
            const hasCopies = await this.reconcileCopies(tx, { ...currentBook, code: code !== undefined ? (`${code ?? ''}`.trim() || null) : currentBook.code }, targetTotal, Array.isArray(copyCodes) ? copyCodes : [], { codeFrom, codeTo });
            const updateData = {
                ...restOfDto,
                yearOfPublication: restOfDto.yearOfPublication !== undefined
                    ? parseInt(restOfDto.yearOfPublication)
                    : currentBook.yearOfPublication,
            };
            if (code !== undefined) {
                updateData.code = `${code ?? ''}`.trim() || null;
            }
            const pnfFieldsProvided = pnf !== undefined ||
                pnfId !== undefined ||
                pnfIds !== undefined ||
                pnfNames !== undefined ||
                pnfs !== undefined;
            if (pnfFieldsProvided) {
                const resolvedPnfIds = await (0, pnf_1.resolvePnfIds)(tx, [pnfId, ...(Array.isArray(pnfIds) ? pnfIds : [])], [pnf, ...(Array.isArray(pnfs) ? pnfs : []), ...(Array.isArray(pnfNames) ? pnfNames : [])]);
                updateData.pnfs = { set: resolvedPnfIds.map(id => ({ id })) };
            }
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
            let physicalBook;
            try {
                physicalBook = await tx.physicalBook.update({
                    where: { id },
                    data: updateData,
                    include: {
                        authors: { select: { id: true, name: true } },
                        categories: { select: { id: true, name: true } },
                        pnfs: true
                    }
                });
            }
            catch (error) {
                if (error?.code === 'P2002') {
                    throw new common_1.ConflictException('Ya existe un libro físico con ese código');
                }
                throw error;
            }
            if (hasCopies) {
                await (0, copies_1.recalcBookStock)(tx, id);
                physicalBook = await tx.physicalBook.findUnique({
                    where: { id },
                    include: {
                        authors: { select: { id: true, name: true } },
                        categories: { select: { id: true, name: true } },
                        pnfs: true
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
                pnfs: true,
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
                observations: dto.observations,
                codeFrom: dto.codeFrom,
                codeTo: dto.codeTo
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
        const normalizedPnf = (0, pnf_1.normalizePnfFilter)(query.pnf);
        if (normalizedPnf) {
            const pnfFilter = {
                pnfs: {
                    some: {
                        name: { equals: normalizedPnf, mode: 'insensitive' }
                    }
                }
            };
            where.AND ? where.AND.push(pnfFilter) : where.AND = [pnfFilter];
        }
        const totalPages = await this.prisma.physicalBook.count({ where });
        const data = await this.prisma.physicalBook.findMany({
            where, take, skip, include: {
                authors: { select: { id: true, name: true } },
                categories: { select: { id: true, name: true } },
                pnfs: true
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
    async bulkUpsert(records) {
        const created = [];
        const updated = [];
        const errors = [];
        for (let index = 0; index < records.length; index++) {
            const record = records[index] ?? {};
            const { id, ...data } = record;
            const title = `${record.title ?? ''}`.trim() || `Registro ${index + 1}`;
            const required = ['title', 'yearOfPublication', 'totalStock'];
            const missing = id ? [] : required.filter((field) => data?.[field] === undefined || `${data?.[field]}`.trim() === '');
            if (missing.length > 0) {
                errors.push({ index, title, message: `Faltan campos obligatorios: ${missing.join(', ')}` });
                continue;
            }
            try {
                const result = id ? await this.update(id, data) : await this.create(data);
                (id ? updated : created).push(result?.data ?? result);
            }
            catch (error) {
                errors.push({ index, title, message: (0, bulk_1.bulkErrorMessage)(error) });
            }
        }
        return {
            status: 'success',
            message: (0, bulk_1.bulkSummaryMessage)({ created: created.length, updated: updated.length, failed: errors.length }),
            data: { created, updated, errors }
        };
    }
    async removeMany(ids) {
        const deleted = await this.prisma.$transaction(async (tx) => {
            await tx.bookOperation.deleteMany({ where: { bookId: { in: ids } } });
            return (await tx.physicalBook.deleteMany({ where: { id: { in: ids } } })).count;
        });
        return {
            status: 'success',
            message: (0, bulk_1.bulkSummaryMessage)({ deleted, failed: ids.length - deleted }),
            data: { deleted }
        };
    }
};
exports.PhysicalBooksService = PhysicalBooksService;
exports.PhysicalBooksService = PhysicalBooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PhysicalBooksService);


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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicalBooksController = void 0;
const common_1 = __webpack_require__(3);
const physical_books_service_1 = __webpack_require__(62);
const create_physical_book_dto_1 = __webpack_require__(64);
const update_physical_book_dto_1 = __webpack_require__(65);
const bulk_physical_book_dto_1 = __webpack_require__(66);
const bulk_ids_dto_1 = __webpack_require__(44);
const client_1 = __webpack_require__(7);
const roles_guard_1 = __webpack_require__(30);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_decorator_1 = __webpack_require__(31);
let PhysicalBooksController = class PhysicalBooksController {
    constructor(physicalBooksService) {
        this.physicalBooksService = physicalBooksService;
    }
    create(createPhysicalBookDto) {
        return this.physicalBooksService.create(createPhysicalBookDto);
    }
    bulk(bulkPhysicalBookDto) {
        return this.physicalBooksService.bulkUpsert(bulkPhysicalBookDto.records);
    }
    bulkDelete(bulkIdsDto) {
        return this.physicalBooksService.removeMany(bulkIdsDto.ids);
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
    (0, common_1.Post)('bulk'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bulk_physical_book_dto_1.BulkPhysicalBookDto !== "undefined" && bulk_physical_book_dto_1.BulkPhysicalBookDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "bulk", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof bulk_ids_dto_1.BulkIdsDto !== "undefined" && bulk_ids_dto_1.BulkIdsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "bulkDelete", null);
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
    __metadata("design:paramtypes", [String, typeof (_e = typeof update_physical_book_dto_1.UpdatePhysicalBookDto !== "undefined" && update_physical_book_dto_1.UpdatePhysicalBookDto) === "function" ? _e : Object]),
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
exports.CreatePhysicalBookDto = void 0;
const class_transformer_1 = __webpack_require__(45);
const class_validator_1 = __webpack_require__(19);
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
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código del libro debe ser cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los códigos de ejemplar deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada código de ejemplar debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreatePhysicalBookDto.prototype, "copyCodes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código inicial debe ser cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "codeFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código final debe ser cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "codeTo", void 0);
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
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los PNFs deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ID de PNF debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreatePhysicalBookDto.prototype, "pnfIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los PNFs deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada nombre de PNF debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreatePhysicalBookDto.prototype, "pnfNames", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El PNF debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "pnf", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del PNF debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "pnfId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los PNFs deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada nombre de PNF debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], CreatePhysicalBookDto.prototype, "pnfs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (`${value ?? ''}`.trim() || undefined)),
    (0, class_validator_1.IsString)({ message: 'La editorial debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'La editorial debe tener un mínimo de 3 caracteres' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "editorial", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)({ message: 'El stock debe ser un número positivo' }),
    __metadata("design:type", Number)
], CreatePhysicalBookDto.prototype, "totalStock", void 0);


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePhysicalBookDto = void 0;
const swagger_1 = __webpack_require__(54);
const create_physical_book_dto_1 = __webpack_require__(64);
class UpdatePhysicalBookDto extends (0, swagger_1.PartialType)(create_physical_book_dto_1.CreatePhysicalBookDto) {
}
exports.UpdatePhysicalBookDto = UpdatePhysicalBookDto;


/***/ }),
/* 66 */
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
exports.BulkPhysicalBookDto = exports.BulkPhysicalBookRecordDto = void 0;
const class_transformer_1 = __webpack_require__(45);
const class_validator_1 = __webpack_require__(19);
const update_physical_book_dto_1 = __webpack_require__(65);
class BulkPhysicalBookRecordDto extends update_physical_book_dto_1.UpdatePhysicalBookDto {
}
exports.BulkPhysicalBookRecordDto = BulkPhysicalBookRecordDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del registro debe ser una cadena de texto' }),
    __metadata("design:type", String)
], BulkPhysicalBookRecordDto.prototype, "id", void 0);
class BulkPhysicalBookDto {
}
exports.BulkPhysicalBookDto = BulkPhysicalBookDto;
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Los registros deben ser un arreglo' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Debes incluir al menos un registro' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BulkPhysicalBookRecordDto),
    __metadata("design:type", Array)
], BulkPhysicalBookDto.prototype, "records", void 0);


/***/ }),
/* 67 */
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
const category_service_1 = __webpack_require__(68);
const category_controller_1 = __webpack_require__(69);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(49);
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
                    name: { contains: search, mode: 'insensitive' },
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryController = void 0;
const common_1 = __webpack_require__(3);
const category_service_1 = __webpack_require__(68);
const create_category_dto_1 = __webpack_require__(70);
const update_category_dto_1 = __webpack_require__(71);
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
/* 70 */
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
/* 71 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCategoryDto = void 0;
const swagger_1 = __webpack_require__(54);
const create_category_dto_1 = __webpack_require__(70);
class UpdateCategoryDto extends (0, swagger_1.PartialType)(create_category_dto_1.CreateCategoryDto) {
}
exports.UpdateCategoryDto = UpdateCategoryDto;


/***/ }),
/* 72 */
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
const author_service_1 = __webpack_require__(73);
const author_controller_1 = __webpack_require__(74);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthorService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(49);
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
                    name: { contains: search, mode: 'insensitive' },
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
/* 74 */
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
const author_service_1 = __webpack_require__(73);
const create_author_dto_1 = __webpack_require__(75);
const update_author_dto_1 = __webpack_require__(76);
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
/* 75 */
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
/* 76 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAuthorDto = void 0;
const swagger_1 = __webpack_require__(54);
const create_author_dto_1 = __webpack_require__(75);
class UpdateAuthorDto extends (0, swagger_1.PartialType)(create_author_dto_1.CreateAuthorDto) {
}
exports.UpdateAuthorDto = UpdateAuthorDto;


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PnfModule = void 0;
const common_1 = __webpack_require__(3);
const pnf_controller_1 = __webpack_require__(78);
const pnf_service_1 = __webpack_require__(81);
let PnfModule = class PnfModule {
};
exports.PnfModule = PnfModule;
exports.PnfModule = PnfModule = __decorate([
    (0, common_1.Module)({
        controllers: [pnf_controller_1.PnfController],
        providers: [pnf_service_1.PnfService],
    })
], PnfModule);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PnfController = void 0;
const common_1 = __webpack_require__(3);
const create_pnf_dto_1 = __webpack_require__(79);
const update_pnf_dto_1 = __webpack_require__(80);
const pnf_service_1 = __webpack_require__(81);
let PnfController = class PnfController {
    constructor(pnfService) {
        this.pnfService = pnfService;
    }
    create(createPnfDto) {
        return this.pnfService.create(createPnfDto);
    }
    findAll(query) {
        return this.pnfService.findAll(query);
    }
    findOne(id) {
        return this.pnfService.findOne(id);
    }
    update(id, updatePnfDto) {
        return this.pnfService.update(id, updatePnfDto);
    }
    remove(id) {
        return this.pnfService.remove(id);
    }
};
exports.PnfController = PnfController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_pnf_dto_1.CreatePnfDto !== "undefined" && create_pnf_dto_1.CreatePnfDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PnfController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PnfController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PnfController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_pnf_dto_1.UpdatePnfDto !== "undefined" && update_pnf_dto_1.UpdatePnfDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PnfController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PnfController.prototype, "remove", null);
exports.PnfController = PnfController = __decorate([
    (0, common_1.Controller)('pnf'),
    __metadata("design:paramtypes", [typeof (_a = typeof pnf_service_1.PnfService !== "undefined" && pnf_service_1.PnfService) === "function" ? _a : Object])
], PnfController);


/***/ }),
/* 79 */
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
exports.CreatePnfDto = void 0;
const class_validator_1 = __webpack_require__(19);
class CreatePnfDto {
}
exports.CreatePnfDto = CreatePnfDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'El PNF debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre del PNF debe tener como mínimo 2 caracteres' }),
    (0, class_validator_1.MaxLength)(60, { message: 'El nombre del PNF debe tener un máximo de 60 caracteres' }),
    __metadata("design:type", String)
], CreatePnfDto.prototype, "name", void 0);


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePnfDto = void 0;
const swagger_1 = __webpack_require__(54);
const create_pnf_dto_1 = __webpack_require__(79);
class UpdatePnfDto extends (0, swagger_1.PartialType)(create_pnf_dto_1.CreatePnfDto) {
}
exports.UpdatePnfDto = UpdatePnfDto;


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PnfService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(49);
const pnf_1 = __webpack_require__(38);
let PnfService = class PnfService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPnfDto) {
        const pnf = await (0, pnf_1.ensurePnf)(this.prisma, createPnfDto.name);
        return { status: 'success', message: 'PNF listo', data: pnf };
    }
    async findAll(query = {}) {
        const take = parseInt(query.limit) || 100;
        const search = (0, pnf_1.normalizePnfName)(query.search);
        return this.prisma.pnf.findMany({
            where: search
                ? { name: { contains: search, mode: 'insensitive' } }
                : undefined,
            take,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const pnf = await this.prisma.pnf.findUnique({ where: { id } });
        if (!pnf)
            throw new common_1.NotFoundException('PNF no encontrado');
        return { status: 'success', data: pnf };
    }
    async update(id, updatePnfDto) {
        const current = await this.prisma.pnf.findUnique({ where: { id } });
        if (!current)
            throw new common_1.NotFoundException('PNF no encontrado');
        const name = (0, pnf_1.normalizePnfName)(updatePnfDto.name ?? current.name);
        if (!name)
            throw new common_1.ConflictException('El nombre del PNF no puede estar vacío');
        try {
            const data = await this.prisma.pnf.update({ where: { id }, data: { name } });
            return { status: 'success', message: 'PNF actualizado', data };
        }
        catch (error) {
            if (error?.code === 'P2002')
                throw new common_1.ConflictException('Ya existe un PNF con ese nombre');
            throw error;
        }
    }
    async remove(id) {
        const current = await this.prisma.pnf.findUnique({ where: { id } });
        if (!current)
            throw new common_1.NotFoundException('PNF no encontrado');
        await this.prisma.pnf.delete({ where: { id } });
        return { status: 'success', message: 'PNF eliminado', data: current };
    }
};
exports.PnfService = PnfService;
exports.PnfService = PnfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PnfService);


/***/ }),
/* 82 */
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
const physical_book_operation_service_1 = __webpack_require__(83);
const physical_book_operation_controller_1 = __webpack_require__(84);
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
/* 83 */
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
const prisma_service_1 = __webpack_require__(49);
const copies_1 = __webpack_require__(51);
const bulk_1 = __webpack_require__(39);
let PhysicalBookOperationService = class PhysicalBookOperationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllOperations(query) {
        let QUERY = {};
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        if (query.search) {
            QUERY.where = { OR: [{ book: { title: { contains: query.search, mode: 'insensitive' } } }] };
        }
        else {
            QUERY.where = {};
        }
        const operationType = `${query.type ?? ''}`.trim().toUpperCase();
        if (operationType && client_1.OperationType[operationType]) {
            QUERY.where.type = operationType;
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
                        isbn: true,
                        code: true
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
            const copyIds = Array.isArray(entriesDto.copyIds) ? entriesDto.copyIds : [];
            const quantity = entriesDto.quantity;
            if (copyIds.length > 0) {
                const retired = await (0, copies_1.applyCopyStatus)(tx, 'book', entriesDto.bookId, copyIds, client_1.CopyStatus.BAJA, copies_1.CAN_DROP);
                const operations = [];
                for (const copy of retired) {
                    operations.push(await tx.bookOperation.create({
                        data: {
                            bookId: entriesDto.bookId,
                            copyId: copy.id,
                            quantity: 1,
                            type: 'BAJA',
                            personNames: entriesDto.personNames,
                            personSurNames: entriesDto.personSurNames
                        }
                    }));
                }
                return { status: 'success', message: `Bajas añadidas: ${operations.length} ejemplar(es)`, operations };
            }
            if (!quantity || quantity <= 0) {
                throw new common_1.BadRequestException('Indica una cantidad o selecciona los ejemplares a dar de baja');
            }
            const copies = await tx.bookCopy.findMany({
                where: { bookId: entriesDto.bookId },
                orderBy: { createdAt: 'asc' }
            });
            if (copies.length > 0) {
                const removable = copies.filter((c) => copies_1.CAN_DROP.includes(c.status));
                if (removable.length < quantity) {
                    throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
                }
                const ordered = [
                    ...removable.filter((c) => c.status === client_1.CopyStatus.DISPONIBLE),
                    ...removable.filter((c) => c.status !== client_1.CopyStatus.DISPONIBLE)
                ];
                for (let i = 0; i < quantity; i += 1) {
                    await tx.bookCopy.update({ where: { id: ordered[i].id }, data: { status: client_1.CopyStatus.BAJA } });
                }
                await (0, copies_1.recalcBookStock)(tx, entriesDto.bookId);
            }
            else {
                const difference = existingBook.totalStock - existingBook.availableStock;
                const newValue = existingBook.totalStock - quantity - difference;
                if (newValue < 0)
                    throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
                await tx.physicalBook.update({
                    where: { id: entriesDto.bookId }, data: {
                        availableStock: { decrement: quantity },
                        totalStock: { decrement: quantity }
                    }
                });
            }
            await tx.bookOperation.create({
                data: {
                    bookId: entriesDto.bookId,
                    quantity,
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
            const copyIds = Array.isArray(entriesDto.copyIds) ? entriesDto.copyIds : [];
            if (copyIds.length > 0) {
                const reactivated = await (0, copies_1.applyCopyStatus)(tx, 'book', entriesDto.bookId, copyIds, client_1.CopyStatus.DISPONIBLE, copies_1.CAN_ENTER);
                const operations = [];
                for (const copy of reactivated) {
                    operations.push(await tx.bookOperation.create({
                        data: {
                            bookId: entriesDto.bookId,
                            copyId: copy.id,
                            quantity: 1,
                            type: 'ENTRADA',
                            personNames: entriesDto.personNames,
                            personSurNames: entriesDto.personSurNames
                        }
                    }));
                }
                return { status: 'success', message: `Entradas añadidas: ${operations.length} ejemplar(es) reactivado(s)`, operations };
            }
            if (!entriesDto.quantity || entriesDto.quantity <= 0) {
                throw new common_1.BadRequestException('Indica una cantidad o selecciona los ejemplares a reactivar');
            }
            await (0, copies_1.createBookCopies)(tx, book, entriesDto.quantity, Array.isArray(entriesDto.codes) ? entriesDto.codes : [], {
                codeFrom: entriesDto.codeFrom,
                codeTo: entriesDto.codeTo
            });
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
            QUERY.where = { type: 'PRESTAMO', OR: [{ book: { title: { contains: query.search, mode: 'insensitive' } } }] };
        }
        QUERY.take = parseInt(limit);
        QUERY.skip = parseInt(skip);
        const data = await this.prisma.bookOperation.findMany({
            ...QUERY, where: { ...QUERY.where, wasSettled: false, type: 'PRESTAMO' }, orderBy: { createdAt: 'desc' }, include: {
                book: {
                    select: {
                        title: true,
                        code: true
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
    async dropLoan(id) {
        return this.prisma.$transaction(async (tx) => {
            const existingLoan = await tx.bookOperation.findUnique({ where: { id } });
            if (!existingLoan)
                throw new common_1.HttpException('Préstamo no encontrado', common_1.HttpStatus.NOT_FOUND);
            if (existingLoan.type !== client_1.OperationType.PRESTAMO)
                throw new common_1.BadRequestException('Sólo puedes dar de baja un préstamo en curso');
            if (existingLoan.wasSettled)
                throw new common_1.BadRequestException('Este préstamo ya fue cerrado');
            await tx.bookOperation.create({
                data: {
                    bookId: existingLoan.bookId,
                    copyId: existingLoan.copyId,
                    quantity: existingLoan.quantity,
                    observations: existingLoan.observations,
                    personId: existingLoan.personId,
                    personNames: existingLoan.personNames,
                    personSurNames: existingLoan.personSurNames,
                    type: 'BAJA'
                }
            });
            await tx.bookOperation.update({ where: { id }, data: { wasSettled: true } });
            if (existingLoan.copyId) {
                await tx.bookCopy.update({ where: { id: existingLoan.copyId }, data: { status: client_1.CopyStatus.BAJA } });
                await (0, copies_1.recalcBookStock)(tx, existingLoan.bookId);
            }
            else {
                const existingBook = await tx.physicalBook.findUnique({ where: { id: existingLoan.bookId } });
                if (!existingBook)
                    throw new common_1.HttpException('Libro no encontrado', common_1.HttpStatus.NOT_FOUND);
                await tx.physicalBook.update({
                    where: { id: existingLoan.bookId },
                    data: { totalStock: Math.max(0, existingBook.totalStock - existingLoan.quantity) }
                });
            }
            return { state: 'success', message: 'El ejemplar fue dado de baja' };
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
    isDeletable(operation) {
        return operation.type !== client_1.OperationType.PRESTAMO || operation.wasSettled === true;
    }
    async remove(id) {
        const operation = await this.prisma.bookOperation.findUnique({ where: { id } });
        if (!operation)
            throw new common_1.HttpException('Operación no encontrada', common_1.HttpStatus.NOT_FOUND);
        if (!this.isDeletable(operation)) {
            throw new common_1.BadRequestException('No puedes eliminar un préstamo que no se ha devuelto. Líquidalo primero.');
        }
        await this.prisma.bookOperation.delete({ where: { id } });
        return { status: 'success', message: 'Operación eliminada' };
    }
    async removeMany(ids) {
        const operations = await this.prisma.bookOperation.findMany({ where: { id: { in: ids } } });
        const allowedIds = operations.filter((operation) => this.isDeletable(operation)).map((operation) => operation.id);
        const refused = operations.length - allowedIds.length;
        const deleted = allowedIds.length === 0
            ? 0
            : (await this.prisma.bookOperation.deleteMany({ where: { id: { in: allowedIds } } })).count;
        const notFound = ids.length - operations.length;
        return {
            status: 'success',
            message: `${(0, bulk_1.bulkSummaryMessage)({ deleted, failed: notFound })}${refused > 0 ? `. ${refused} préstamo(s) sin devolver se mantuvieron` : ''}`,
            data: { deleted, refused }
        };
    }
};
exports.PhysicalBookOperationService = PhysicalBookOperationService;
exports.PhysicalBookOperationService = PhysicalBookOperationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PhysicalBookOperationService);


/***/ }),
/* 84 */
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
exports.PhysicalBookOperationController = void 0;
const common_1 = __webpack_require__(3);
const physical_book_operation_service_1 = __webpack_require__(83);
const update_physical_book_operation_dto_1 = __webpack_require__(85);
const entrie_dto_1 = __webpack_require__(87);
const drop_dto_1 = __webpack_require__(88);
const loan_dto_1 = __webpack_require__(89);
const bulk_ids_dto_1 = __webpack_require__(44);
const roles_decorator_1 = __webpack_require__(31);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_guard_1 = __webpack_require__(30);
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
    dropLoan(id) {
        return this.physicalBookOperationService.dropLoan(id);
    }
    bulkDelete(bulkIdsDto) {
        return this.physicalBookOperationService.removeMany(bulkIdsDto.ids);
    }
    findOne(id) {
        return this.physicalBookOperationService.findOne(+id);
    }
    update(id, updatePhysicalBookOperationDto) {
        return this.physicalBookOperationService.update(+id, updatePhysicalBookOperationDto);
    }
    remove(id) {
        return this.physicalBookOperationService.remove(id);
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
    (0, common_1.Patch)('drop-loan/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "dropLoan", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof bulk_ids_dto_1.BulkIdsDto !== "undefined" && bulk_ids_dto_1.BulkIdsDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "bulkDelete", null);
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
    __metadata("design:paramtypes", [String, typeof (_f = typeof update_physical_book_operation_dto_1.UpdatePhysicalBookOperationDto !== "undefined" && update_physical_book_operation_dto_1.UpdatePhysicalBookOperationDto) === "function" ? _f : Object]),
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
/* 85 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePhysicalBookOperationDto = void 0;
const swagger_1 = __webpack_require__(54);
const create_physical_book_operation_dto_1 = __webpack_require__(86);
class UpdatePhysicalBookOperationDto extends (0, swagger_1.PartialType)(create_physical_book_operation_dto_1.CreatePhysicalBookOperationDto) {
}
exports.UpdatePhysicalBookOperationDto = UpdatePhysicalBookOperationDto;


/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePhysicalBookOperationDto = void 0;
class CreatePhysicalBookOperationDto {
}
exports.CreatePhysicalBookOperationDto = CreatePhysicalBookOperationDto;


/***/ }),
/* 87 */
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
const class_transformer_1 = __webpack_require__(45);
const class_validator_1 = __webpack_require__(19);
class EntrieDto {
}
exports.EntrieDto = EntrieDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value === '' || value === null || value === undefined ? undefined : parseInt(value))),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un numero entero' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un numero positivo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EntrieDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un Item para dar entradas' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "bookId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los ejemplares deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ejemplar debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], EntrieDto.prototype, "copyIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los códigos deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada código debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], EntrieDto.prototype, "codes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código inicial del rango debe ser una cadena de texto' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "codeFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código final del rango debe ser una cadena de texto' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "codeTo", void 0);
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
/* 88 */
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
const swagger_1 = __webpack_require__(54);
const entrie_dto_1 = __webpack_require__(87);
const class_validator_1 = __webpack_require__(19);
class DropDto extends (0, swagger_1.PartialType)(entrie_dto_1.EntrieDto) {
}
exports.DropDto = DropDto;
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un libro para dar bajas' }),
    __metadata("design:type", String)
], DropDto.prototype, "bookId", void 0);


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
exports.LoanDto = void 0;
const class_transformer_1 = __webpack_require__(45);
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
/* 90 */
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
const item_type_service_1 = __webpack_require__(91);
const item_type_controller_1 = __webpack_require__(92);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemTypeService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(49);
let ItemTypeService = class ItemTypeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createItemTypeDto) {
        const name = createItemTypeDto.name.trim();
        const existing = await this.prisma.itemType.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
        });
        if (existing) {
            return {
                message: 'El tipo ya existe',
                status: 'success',
                data: existing,
            };
        }
        return {
            message: 'Tipo Creado',
            status: 'success',
            data: await this.prisma.itemType.create({ data: { name } }),
        };
    }
    async findAll(query) {
        const where = {};
        const take = parseInt(query.limit) || 10;
        if (query.search) {
            where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }];
        }
        return this.prisma.itemType.findMany({
            where,
            take,
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const itemType = await this.prisma.itemType.findUnique({ where: { id } });
        if (!itemType) {
            throw new common_1.HttpException('Tipo no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return { status: 'success', data: itemType };
    }
    async update(id, updateItemTypeDto) {
        const data = updateItemTypeDto.name
            ? { name: updateItemTypeDto.name.trim() }
            : {};
        return {
            message: 'Tipo Actualizado',
            status: 'success',
            data: await this.prisma.itemType.update({ where: { id }, data }),
        };
    }
    async remove(id) {
        const itemType = await this.prisma.itemType.findUnique({ where: { id } });
        if (!itemType) {
            throw new common_1.HttpException('Tipo no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            message: 'Tipo Eliminado',
            status: 'success',
            data: await this.prisma.itemType.delete({ where: { id } }),
        };
    }
};
exports.ItemTypeService = ItemTypeService;
exports.ItemTypeService = ItemTypeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ItemTypeService);


/***/ }),
/* 92 */
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
const item_type_service_1 = __webpack_require__(91);
const create_item_type_dto_1 = __webpack_require__(93);
const update_item_type_dto_1 = __webpack_require__(94);
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
/* 94 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateItemTypeDto = void 0;
const swagger_1 = __webpack_require__(54);
const create_item_type_dto_1 = __webpack_require__(93);
class UpdateItemTypeDto extends (0, swagger_1.PartialType)(create_item_type_dto_1.CreateItemTypeDto) {
}
exports.UpdateItemTypeDto = UpdateItemTypeDto;


/***/ }),
/* 95 */
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
const inventory_operation_service_1 = __webpack_require__(96);
const inventory_operation_controller_1 = __webpack_require__(97);
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
/* 96 */
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
const prisma_service_1 = __webpack_require__(49);
const copies_1 = __webpack_require__(51);
const bulk_1 = __webpack_require__(39);
let InventoryOperationService = class InventoryOperationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createInventoryOperationDto) {
        return 'This action adds a new inventoryOperation';
    }
    async addDrops(entriesDto) {
        return this.prisma.$transaction(async (tx) => {
            const existingItem = await tx.item.findUnique({
                where: { id: entriesDto.itemId },
            });
            if (!existingItem)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            const copyIds = Array.isArray(entriesDto.copyIds)
                ? entriesDto.copyIds
                : [];
            const quantity = entriesDto.quantity;
            if (copyIds.length > 0) {
                const retired = await (0, copies_1.applyCopyStatus)(tx, 'item', entriesDto.itemId, copyIds, client_1.CopyStatus.BAJA, copies_1.CAN_DROP);
                const operations = [];
                for (const copy of retired) {
                    operations.push(await tx.itemOperation.create({
                        data: {
                            itemId: entriesDto.itemId,
                            copyId: copy.id,
                            quantity: 1,
                            type: 'BAJA',
                            personNames: entriesDto.personNames,
                            personSurNames: entriesDto.personSurNames,
                        },
                    }));
                }
                return {
                    status: 'success',
                    message: `Bajas añadidas: ${operations.length} ejemplar(es)`,
                    operations,
                };
            }
            if (!quantity || quantity <= 0) {
                throw new common_1.BadRequestException('Indica una cantidad o selecciona los ejemplares a dar de baja');
            }
            const copies = await tx.itemCopy.findMany({
                where: { itemId: entriesDto.itemId },
                orderBy: { createdAt: 'asc' },
            });
            if (copies.length > 0) {
                const removable = copies.filter((c) => copies_1.CAN_DROP.includes(c.status));
                if (removable.length < quantity) {
                    throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
                }
                const ordered = [
                    ...removable.filter((c) => c.status === client_1.CopyStatus.DISPONIBLE),
                    ...removable.filter((c) => c.status !== client_1.CopyStatus.DISPONIBLE),
                ];
                for (let i = 0; i < quantity; i += 1) {
                    await tx.itemCopy.update({
                        where: { id: ordered[i].id },
                        data: { status: client_1.CopyStatus.BAJA },
                    });
                }
                await (0, copies_1.recalcItemStock)(tx, entriesDto.itemId);
            }
            else {
                const difference = existingItem.totalStock - existingItem.availableStock;
                const newValue = existingItem.totalStock - quantity - difference;
                if (newValue < 0)
                    throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
                await tx.item.update({
                    where: { id: entriesDto.itemId },
                    data: {
                        availableStock: { decrement: quantity },
                        totalStock: { decrement: quantity },
                    },
                });
            }
            await tx.itemOperation.create({
                data: {
                    itemId: entriesDto.itemId,
                    quantity,
                    type: 'BAJA',
                    personNames: entriesDto.personNames,
                    personSurNames: entriesDto.personSurNames,
                },
            });
            return { status: 'success', message: 'Bajas añadidas' };
        });
    }
    async addEntries(entriesDto) {
        return this.prisma.$transaction(async (tx) => {
            const existingItem = await tx.item.findUnique({
                where: { id: entriesDto.itemId },
            });
            if (!existingItem)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            const copyIds = Array.isArray(entriesDto.copyIds)
                ? entriesDto.copyIds
                : [];
            if (copyIds.length > 0) {
                const reactivated = await (0, copies_1.applyCopyStatus)(tx, 'item', entriesDto.itemId, copyIds, client_1.CopyStatus.DISPONIBLE, copies_1.CAN_ENTER);
                const operations = [];
                for (const copy of reactivated) {
                    operations.push(await tx.itemOperation.create({
                        data: {
                            itemId: entriesDto.itemId,
                            copyId: copy.id,
                            quantity: 1,
                            type: 'ENTRADA',
                            personNames: entriesDto.personNames,
                            personSurNames: entriesDto.personSurNames,
                        },
                    }));
                }
                return {
                    status: 'success',
                    message: `Entradas añadidas: ${operations.length} ejemplar(es) reactivado(s)`,
                    operations,
                };
            }
            if (!entriesDto.quantity || entriesDto.quantity <= 0) {
                throw new common_1.BadRequestException('Indica una cantidad o selecciona los ejemplares a reactivar');
            }
            await (0, copies_1.createItemCopies)(tx, existingItem, entriesDto.quantity, Array.isArray(entriesDto.codes) ? entriesDto.codes : []);
            await (0, copies_1.recalcItemStock)(tx, entriesDto.itemId);
            await tx.itemOperation.create({
                data: {
                    itemId: entriesDto.itemId,
                    quantity: entriesDto.quantity,
                    type: 'ENTRADA',
                    personNames: entriesDto.personNames,
                    personSurNames: entriesDto.personSurNames,
                },
            });
            return { status: 'success', message: 'Entradas añadidas' };
        });
    }
    async loan(itemLoan) {
        return this.prisma.$transaction(async (tx) => {
            const copyIds = Array.isArray(itemLoan.copyIds)
                ? itemLoan.copyIds
                : [];
            if (copyIds.length > 0) {
                const copies = await tx.itemCopy.findMany({
                    where: { id: { in: copyIds } },
                });
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
                            type: 'PRESTAMO',
                        },
                    });
                    await tx.itemCopy.update({
                        where: { id: copy.id },
                        data: { status: client_1.CopyStatus.PRESTADO },
                    });
                    loans.push(loan);
                }
                await (0, copies_1.recalcItemStock)(tx, itemId);
                return {
                    status: 'success',
                    message: 'Prestamo Registrado',
                    loan: loans[0],
                    loans,
                };
            }
            const quantity = itemLoan.quantity ?? 1;
            const available = await tx.itemCopy.findMany({
                where: { itemId: itemLoan.itemId, status: client_1.CopyStatus.DISPONIBLE },
                orderBy: { createdAt: 'asc' },
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
                            type: 'PRESTAMO',
                        },
                    });
                    await tx.itemCopy.update({
                        where: { id: copy.id },
                        data: { status: client_1.CopyStatus.PRESTADO },
                    });
                    loans.push(loan);
                }
                await (0, copies_1.recalcItemStock)(tx, itemLoan.itemId);
                return {
                    status: 'success',
                    message: 'Prestamo Registrado',
                    loan: loans[0],
                    loans,
                };
            }
            const existingItem = await tx.item.findUnique({
                where: { id: itemLoan.itemId },
            });
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
                    personSurNames: itemLoan.personSurNames,
                },
            });
            await tx.item.update({
                where: { id: itemLoan.itemId },
                data: {
                    availableStock: { decrement: quantity },
                },
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
                    personSurNames: existingLoan.personSurNames,
                },
            });
            await tx.itemOperation.update({
                where: { id },
                data: { wasSettled: true },
            });
            if (existingLoan.copyId) {
                await tx.itemCopy.update({
                    where: { id: existingLoan.copyId },
                    data: { status: client_1.CopyStatus.DISPONIBLE },
                });
                await (0, copies_1.recalcItemStock)(tx, existingLoan.itemId);
            }
            else {
                await tx.item.update({
                    where: { id: existingLoan.itemId },
                    data: {
                        availableStock: { increment: existingLoan.quantity },
                    },
                });
            }
            return { status: 'success', message: 'Item Devuelto' };
        });
    }
    async dropLoan(id) {
        return this.prisma.$transaction(async (tx) => {
            const existingLoan = await tx.itemOperation.findUnique({ where: { id } });
            if (!existingLoan)
                throw new common_1.HttpException('Préstamo no encontrado', common_1.HttpStatus.NOT_FOUND);
            if (existingLoan.type !== client_1.OperationType.PRESTAMO)
                throw new common_1.BadRequestException('Sólo puedes dar de baja un préstamo en curso');
            if (existingLoan.wasSettled)
                throw new common_1.BadRequestException('Este préstamo ya fue cerrado');
            await tx.itemOperation.create({
                data: {
                    type: 'BAJA',
                    quantity: existingLoan.quantity,
                    itemId: existingLoan.itemId,
                    copyId: existingLoan.copyId,
                    observations: existingLoan.observations,
                    personId: existingLoan.personId,
                    personNames: existingLoan.personNames,
                    personSurNames: existingLoan.personSurNames,
                },
            });
            await tx.itemOperation.update({
                where: { id },
                data: { wasSettled: true },
            });
            if (existingLoan.copyId) {
                await tx.itemCopy.update({
                    where: { id: existingLoan.copyId },
                    data: { status: client_1.CopyStatus.BAJA },
                });
                await (0, copies_1.recalcItemStock)(tx, existingLoan.itemId);
            }
            else {
                const existingItem = await tx.item.findUnique({
                    where: { id: existingLoan.itemId },
                });
                if (!existingItem)
                    throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
                await tx.item.update({
                    where: { id: existingLoan.itemId },
                    data: {
                        totalStock: Math.max(0, existingItem.totalStock - existingLoan.quantity),
                    },
                });
            }
            return { status: 'success', message: 'El ejemplar fue dado de baja' };
        });
    }
    async findAllLoans(query) {
        const where = {};
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        if (query.search) {
            where.OR = [
                { item: { name: { contains: query.search, mode: 'insensitive' } } },
            ];
        }
        const data = await this.prisma.itemOperation.findMany({
            where: { ...where, type: 'PRESTAMO', wasSettled: false },
            include: {
                item: { include: { types: true } },
                copy: { select: { code: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });
        const totalPages = Math.ceil((await this.prisma.itemOperation.count({
            where: { ...where, type: 'PRESTAMO', wasSettled: false },
        })) / limit);
        return { data, totalPages };
    }
    async findAll(query) {
        const where = {};
        const page = parseInt(query.page) || 1;
        const take = parseInt(query.limit) || 10;
        const skip = (page - 1) * take;
        if (query.search) {
            where.AND = [
                { item: { name: { contains: query.search, mode: 'insensitive' } } },
            ];
        }
        const totalPages = await this.prisma.itemOperation.count({
            where,
        });
        const data = await this.prisma.itemOperation.findMany({
            where,
            take,
            skip,
            orderBy: { createdAt: 'desc' },
            include: {
                item: { include: { types: true } },
                copy: { select: { code: true } },
            },
        });
        return { data, totalPages };
    }
    findOne(id) {
        return `This action returns a #${id} inventoryOperation`;
    }
    update(id, updateInventoryOperationDto) {
        return `This action updates a #${id} inventoryOperation`;
    }
    isDeletable(operation) {
        return (operation.type !== client_1.OperationType.PRESTAMO || operation.wasSettled === true);
    }
    async remove(id) {
        const operation = await this.prisma.itemOperation.findUnique({
            where: { id },
        });
        if (!operation)
            throw new common_1.HttpException('Operación no encontrada', common_1.HttpStatus.NOT_FOUND);
        if (!this.isDeletable(operation)) {
            throw new common_1.BadRequestException('No puedes eliminar un préstamo que no se ha devuelto. Líquidalo primero.');
        }
        await this.prisma.itemOperation.delete({ where: { id } });
        return { status: 'success', message: 'Operación eliminada' };
    }
    async removeMany(ids) {
        const operations = await this.prisma.itemOperation.findMany({
            where: { id: { in: ids } },
        });
        const allowedIds = operations
            .filter((operation) => this.isDeletable(operation))
            .map((operation) => operation.id);
        const refused = operations.length - allowedIds.length;
        const deleted = allowedIds.length === 0
            ? 0
            : (await this.prisma.itemOperation.deleteMany({
                where: { id: { in: allowedIds } },
            })).count;
        const notFound = ids.length - operations.length;
        return {
            status: 'success',
            message: `${(0, bulk_1.bulkSummaryMessage)({ deleted, failed: notFound })}${refused > 0 ? `. ${refused} préstamo(s) sin devolver se mantuvieron` : ''}`,
            data: { deleted, refused },
        };
    }
};
exports.InventoryOperationService = InventoryOperationService;
exports.InventoryOperationService = InventoryOperationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InventoryOperationService);


/***/ }),
/* 97 */
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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryOperationController = void 0;
const common_1 = __webpack_require__(3);
const inventory_operation_service_1 = __webpack_require__(96);
const create_inventory_operation_dto_1 = __webpack_require__(98);
const update_inventory_operation_dto_1 = __webpack_require__(99);
const entrie_dto_1 = __webpack_require__(100);
const drop_dto_1 = __webpack_require__(101);
const bulk_ids_dto_1 = __webpack_require__(44);
const loan_dto_1 = __webpack_require__(102);
const client_1 = __webpack_require__(7);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_decorator_1 = __webpack_require__(31);
const roles_guard_1 = __webpack_require__(30);
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
    dropLoan(id) {
        return this.inventoryOperationService.dropLoan(id);
    }
    create(createInventoryOperationDto) {
        return this.inventoryOperationService.create(createInventoryOperationDto);
    }
    findAll(query) {
        return this.inventoryOperationService.findAll(query);
    }
    bulkDelete(bulkIdsDto) {
        return this.inventoryOperationService.removeMany(bulkIdsDto.ids);
    }
    findOne(id) {
        return this.inventoryOperationService.findOne(+id);
    }
    update(id, updateInventoryOperationDto) {
        return this.inventoryOperationService.update(+id, updateInventoryOperationDto);
    }
    remove(id) {
        return this.inventoryOperationService.remove(id);
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
    (0, common_1.Patch)('drop-loan/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "dropLoan", null);
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
    (0, common_1.Post)('bulk-delete'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof bulk_ids_dto_1.BulkIdsDto !== "undefined" && bulk_ids_dto_1.BulkIdsDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "bulkDelete", null);
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
    __metadata("design:paramtypes", [String, typeof (_g = typeof update_inventory_operation_dto_1.UpdateInventoryOperationDto !== "undefined" && update_inventory_operation_dto_1.UpdateInventoryOperationDto) === "function" ? _g : Object]),
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
/* 98 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateInventoryOperationDto = void 0;
class CreateInventoryOperationDto {
}
exports.CreateInventoryOperationDto = CreateInventoryOperationDto;


/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateInventoryOperationDto = void 0;
const swagger_1 = __webpack_require__(54);
const create_inventory_operation_dto_1 = __webpack_require__(98);
class UpdateInventoryOperationDto extends (0, swagger_1.PartialType)(create_inventory_operation_dto_1.CreateInventoryOperationDto) {
}
exports.UpdateInventoryOperationDto = UpdateInventoryOperationDto;


/***/ }),
/* 100 */
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
const class_transformer_1 = __webpack_require__(45);
const class_validator_1 = __webpack_require__(19);
class EntrieDto {
}
exports.EntrieDto = EntrieDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value === '' || value === null || value === undefined ? undefined : parseInt(value))),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un numero entero' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un numero positivo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EntrieDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un Item para dar entradas' }),
    __metadata("design:type", String)
], EntrieDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los ejemplares deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada ejemplar debe ser una cadena de texto' }),
    __metadata("design:type", Array)
], EntrieDto.prototype, "copyIds", void 0);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DropDto = void 0;
const swagger_1 = __webpack_require__(54);
const entrie_dto_1 = __webpack_require__(100);
const class_validator_1 = __webpack_require__(19);
class DropDto extends (0, swagger_1.PartialType)(entrie_dto_1.EntrieDto) {
}
exports.DropDto = DropDto;
__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un Item para dar bajas' }),
    __metadata("design:type", String)
], DropDto.prototype, "itemId", void 0);


/***/ }),
/* 102 */
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
const class_transformer_1 = __webpack_require__(45);
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
/* 103 */
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
const logs_service_1 = __webpack_require__(104);
const logs_controller_1 = __webpack_require__(105);
const prisma_module_1 = __webpack_require__(108);
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogsService = void 0;
const common_1 = __webpack_require__(3);
const getPagination_1 = __webpack_require__(16);
const prisma_service_1 = __webpack_require__(49);
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
            where.OR = [{ action: { contains: search, mode: 'insensitive' } }];
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
/* 105 */
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
const logs_service_1 = __webpack_require__(104);
const create_log_dto_1 = __webpack_require__(106);
const update_log_dto_1 = __webpack_require__(107);
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
/* 106 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateLogDto = void 0;
class CreateLogDto {
}
exports.CreateLogDto = CreateLogDto;


/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateLogDto = void 0;
const swagger_1 = __webpack_require__(54);
const create_log_dto_1 = __webpack_require__(106);
class UpdateLogDto extends (0, swagger_1.PartialType)(create_log_dto_1.CreateLogDto) {
}
exports.UpdateLogDto = UpdateLogDto;


/***/ }),
/* 108 */
/***/ ((module) => {

module.exports = require("prisma/prisma.module");

/***/ }),
/* 109 */
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
const backup_service_1 = __webpack_require__(110);
const backup_controller_1 = __webpack_require__(112);
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
/* 110 */
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
const zlib = __importStar(__webpack_require__(111));
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
            PhysicalBook: await this.prisma.physicalBook.findMany({
                include: { pnfs: true },
            }),
            BookCopy: await this.prisma.bookCopy.findMany(),
            ItemCopy: await this.prisma.itemCopy.findMany(),
            BookPnf: await this.prisma.bookPnf.findMany(),
            Pnf: await this.prisma.pnf.findMany(),
            _PhysicalBookToPnf: await this.prisma.$queryRawUnsafe(`SELECT * FROM "_PhysicalBookToPnf"`),
            _AuthorToPhysicalBook: await this.prisma.$queryRawUnsafe(`SELECT * FROM "_AuthorToPhysicalBook"`),
            _CategoryToPhysicalBook: await this.prisma.$queryRawUnsafe(`SELECT * FROM "_CategoryToPhysicalBook"`),
            _AuthorToBook: await this.prisma.$queryRawUnsafe(`SELECT * FROM "_AuthorToBook"`),
            _ItemToItemType: await this.prisma.$queryRawUnsafe(`SELECT * FROM "_ItemToItemType"`),
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
/* 111 */
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),
/* 112 */
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
const backup_service_1 = __webpack_require__(110);
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
/* 113 */
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
const sync_service_1 = __webpack_require__(114);
const sync_controller_1 = __webpack_require__(115);
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
/* 114 */
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
var SyncService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(6);
const SCALARS = {
    category: ['name'],
    author: ['name'],
    itemType: ['name'],
    pnf: ['name'],
    physicalBook: [
        'code',
        'isbn',
        'title',
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
let SyncService = SyncService_1 = class SyncService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger('SyncService');
    }
    isTransient(err) {
        const error = err;
        if (!error)
            return false;
        if (error.code && SyncService_1.RETRYABLE_CODES.has(error.code))
            return true;
        return SyncService_1.RETRYABLE_PATTERN.test(String(error.message ?? ''));
    }
    async withRetry(label, operation, attempts = 3) {
        let lastError;
        for (let attempt = 1; attempt <= attempts; attempt += 1) {
            try {
                return await operation();
            }
            catch (err) {
                lastError = err;
                if (attempt === attempts || !this.isTransient(err))
                    throw err;
                const delay = 500 * attempt;
                this.logger.warn(`${label}: transient DB error (attempt ${attempt}/${attempts}), retrying in ${delay}ms`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw lastError;
    }
    isNewer(incoming, existing) {
        if (!incoming ||
            incoming.updatedAt === undefined ||
            incoming.updatedAt === null) {
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
                await tx[model].update({
                    where: { id: row.id },
                    data: this.pick(model, row, false),
                });
                counters.updated += 1;
            }
            else {
                counters.skipped += 1;
            }
        }
    }
    async exportAll() {
        return this.withRetry('exportAll', () => this.buildSnapshot());
    }
    async buildSnapshot() {
        const [categories, authors, itemTypes, physicalBooks, pnfs, bookCopies, bookOperations, items, itemCopies, itemOperations,] = await Promise.all([
            this.prisma.category.findMany(),
            this.prisma.author.findMany(),
            this.prisma.itemType.findMany(),
            this.prisma.physicalBook.findMany({
                include: {
                    authors: { select: { id: true } },
                    categories: { select: { id: true } },
                    pnfs: { select: { id: true } },
                },
            }),
            this.prisma.pnf.findMany(),
            this.prisma.bookCopy.findMany(),
            this.prisma.bookOperation.findMany(),
            this.prisma.item.findMany({
                include: { types: { select: { id: true } } },
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
                    pnfIds: b.pnfs.map((p) => p.id),
                    authors: undefined,
                    categories: undefined,
                    pnfs: undefined,
                })),
                bookCopies,
                bookOperations,
                items: items.map((i) => ({
                    ...i,
                    typeIds: i.types.map((t) => t.id),
                    types: undefined,
                })),
                itemCopies,
                itemOperations,
            },
        };
    }
    async merge(payload) {
        return this.withRetry('merge', () => this.runMerge(payload));
    }
    async runMerge(payload) {
        const data = payload?.data ?? {};
        const counters = { created: 0, updated: 0, skipped: 0 };
        await this.prisma.$transaction(async (tx) => {
            await this.upsertScalars(tx, 'category', data.categories ?? [], counters);
            await this.upsertScalars(tx, 'author', data.authors ?? [], counters);
            await this.upsertScalars(tx, 'itemType', data.itemTypes ?? [], counters);
            await this.upsertScalars(tx, 'pnf', data.pnfs ?? [], counters);
            const authorIds = new Set((await tx.author.findMany({ select: { id: true } })).map((a) => a.id));
            const categoryIds = new Set((await tx.category.findMany({ select: { id: true } })).map((c) => c.id));
            const itemTypeIds = new Set((await tx.itemType.findMany({ select: { id: true } })).map((t) => t.id));
            for (const row of data.physicalBooks ?? []) {
                if (!row || typeof row.id !== 'string')
                    continue;
                const existing = await tx.physicalBook.findUnique({
                    where: { id: row.id },
                });
                const base = this.pick('physicalBook', row);
                const incomingPnfIds = Array.isArray(row.pnfIds)
                    ? row.pnfIds.filter((id) => typeof id === 'string')
                    : [];
                if (!existing) {
                    await tx.physicalBook.create({ data: base });
                    counters.created += 1;
                    if (incomingPnfIds.length > 0) {
                        await tx.physicalBook.update({
                            where: { id: row.id },
                            data: {
                                pnfs: { set: incomingPnfIds.map((id) => ({ id })) },
                            },
                        });
                    }
                }
                else if (this.isNewer(row, existing)) {
                    await tx.physicalBook.update({
                        where: { id: row.id },
                        data: this.pick('physicalBook', row, false),
                    });
                    counters.updated += 1;
                    if (incomingPnfIds.length > 0) {
                        await tx.physicalBook.update({
                            where: { id: row.id },
                            data: {
                                pnfs: { set: incomingPnfIds.map((id) => ({ id })) },
                            },
                        });
                    }
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
                const typeIdsProvided = Array.isArray(row.typeIds) || typeof row.typeId === 'string';
                const incomingTypeIds = Array.isArray(row.typeIds)
                    ? row.typeIds
                    : typeof row.typeId === 'string'
                        ? [row.typeId]
                        : [];
                const validTypeIds = incomingTypeIds.filter((id) => typeof id === 'string' && itemTypeIds.has(id));
                if (typeIdsProvided && validTypeIds.length === 0) {
                    counters.skipped += 1;
                    continue;
                }
                const existing = await tx.item.findUnique({ where: { id: row.id } });
                if (!existing) {
                    await tx.item.create({ data: this.pick('item', row) });
                    counters.created += 1;
                }
                else if (this.isNewer(row, existing)) {
                    await tx.item.update({
                        where: { id: row.id },
                        data: this.pick('item', row, false),
                    });
                    counters.updated += 1;
                }
                else {
                    counters.skipped += 1;
                    continue;
                }
                if (typeIdsProvided) {
                    await tx.item.update({
                        where: { id: row.id },
                        data: {
                            types: {
                                set: validTypeIds.map((id) => ({ id })),
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
        return this.withRetry('info', () => this.buildInfo());
    }
    async buildInfo() {
        const [categories, authors, itemTypes, physicalBooks, items, bookCopies, itemCopies,] = await Promise.all([
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
SyncService.RETRYABLE_CODES = new Set([
    'P1000',
    'P1001',
    'P1002',
    'P1008',
    'P1017',
    'P2024',
]);
SyncService.RETRYABLE_PATTERN = /connection|closed the connection|timed out fetching|login has been failing|econnreset|etimedout|econnrefused|socket hang up|server conn/i;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], SyncService);


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncController = void 0;
const common_1 = __webpack_require__(3);
const sync_service_1 = __webpack_require__(114);
const sync_token_guard_1 = __webpack_require__(116);
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
/* 116 */
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
const crypto_1 = __webpack_require__(117);
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
/* 117 */
/***/ ((module) => {

module.exports = require("crypto");

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
exports.AiBooksModule = void 0;
const common_1 = __webpack_require__(3);
const ai_books_service_1 = __webpack_require__(119);
const ai_books_controller_1 = __webpack_require__(124);
const config_1 = __webpack_require__(4);
const bulk_books_service_1 = __webpack_require__(46);
const books_service_1 = __webpack_require__(37);
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiBooksService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const groq_1 = __webpack_require__(120);
const messages_1 = __webpack_require__(121);
const prisma_service_1 = __webpack_require__(6);
const book_extraction_schema_1 = __webpack_require__(122);
const book_extraction_schema_2 = __webpack_require__(122);
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
        const pnfs = await this.prisma.pnf.findMany({ orderBy: { name: 'asc' } });
        const pnfList = pnfs.map((p) => p.name).join(', ');
        const systemPrompt = `
      Eres un asistente experto de la Biblioteca Raúl Castillo en la UPT de Aragua.
      Analiza el mensaje del usuario y rellena los datos correspondientes.
      
      Reglas:
      1. Extrae los PNFs registrados en la biblioteca: ${pnfList}. Si el usuario menciona uno que no está en la lista, devuélvelo normalizado en mayúsculas sin espacios extra (se creará al guardar).
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
/* 120 */
/***/ ((module) => {

module.exports = require("@langchain/groq");

/***/ }),
/* 121 */
/***/ ((module) => {

module.exports = require("@langchain/core/messages");

/***/ }),
/* 122 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BulkBookActionSchema = exports.BookExtractionSchema = void 0;
const zod_1 = __webpack_require__(123);
const pnf_1 = __webpack_require__(38);
const PNF_ENUM = zod_1.z.string().min(3).describe('El Programa Nacional de Formación asociado.');
const PNF_LIST = zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : Array.isArray(val) ? val.map((item) => (0, pnf_1.normalizePnfName)(item)).filter(Boolean) : val), zod_1.z.array(PNF_ENUM));
exports.BookExtractionSchema = zod_1.z.object({
    message: zod_1.z.string().describe("Respuesta conversacional amigable para el usuario."),
    extractedData: zod_1.z.object({
        title: zod_1.z.string().nullable().describe("El título del libro si se menciona. Si no, null."),
        description: zod_1.z.string().nullable().describe("Resumen del libro si se menciona. Si no, null."),
        routepdf: zod_1.z.string().nullable().describe("La URL o ruta del PDF si se menciona. Si no, null."),
        routeimg: zod_1.z.string().nullable().describe("La URL o ruta de la portada si se menciona. Si no, null."),
        pnfs: PNF_LIST.describe("Lista de PNFs válidos."),
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
        pnfs: PNF_LIST.describe("Lista de PNFs asociados al libro. Si no hay ninguno, devolver array vacío []."),
        authors: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(zod_1.z.string())).describe("Lista de nombres de los autores del libro. Si no hay ninguno, devolver array vacío [].")
    })).describe("Arreglo con la lista de acciones a ejecutar. Debe ser una lista directa de objetos.")
});


/***/ }),
/* 123 */
/***/ ((module) => {

module.exports = require("zod");

/***/ }),
/* 124 */
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
const platform_express_1 = __webpack_require__(60);
const ai_books_service_1 = __webpack_require__(119);
const bulk_books_service_1 = __webpack_require__(46);
const jwt_auth_guard_1 = __webpack_require__(25);
const roles_guard_1 = __webpack_require__(30);
const roles_decorator_1 = __webpack_require__(31);
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
/* 125 */
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
const ai_inventory_service_1 = __webpack_require__(126);
const ai_inventory_controller_1 = __webpack_require__(128);
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
/* 126 */
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
const groq_1 = __webpack_require__(120);
const messages_1 = __webpack_require__(121);
const inventory_extraction_schema_1 = __webpack_require__(127);
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
                typeNames: Array.isArray(currentItemData.types)
                    ? currentItemData.types.map((type) => type?.name).filter(Boolean)
                    : null,
            };
        }
        const systemPrompt = `
      Eres el asistente de gestión de inventarios de la plataforma UPTALib.
      Tu trabajo es procesar las solicitudes de los administradores para rellenar los datos de insumos, equipos o herramientas.
      
      Debes extraer: name, code, description, stock y typeNames (uno o más tipos del item).
      
      ${normalizedContext
            ? `CONTEXTO DE EDICIÓN: El administrador está modificando un item existente cuyos valores actuales son: ${JSON.stringify(normalizedContext)}. 
      Modifica, incrementa, decrementa o actualiza los datos basándote estrictamente en esta estructura. 
      Si el usuario pide cambiar el stock (ej. "Ponle 15" o "Súmale 2"), calcula o define el valor final y devuélvelo en la propiedad 'stock' como un string numérico.`
            : ''}
      
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
                extractedData: {
                    name: null,
                    code: null,
                    description: null,
                    stock: null,
                    typeNames: null,
                },
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
/* 127 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryExtractionSchema = void 0;
const zod_1 = __webpack_require__(123);
exports.InventoryExtractionSchema = zod_1.z.object({
    message: zod_1.z
        .string()
        .describe('Un mensaje amigable detallando qué características del item se lograron identificar.'),
    extractedData: zod_1.z.object({
        name: zod_1.z
            .string()
            .nullable()
            .describe('El nombre del objeto o equipo de inventario.'),
        code: zod_1.z
            .string()
            .nullable()
            .describe('El código interno de identificación o serial del item si se menciona.'),
        description: zod_1.z
            .string()
            .nullable()
            .describe('Una descripción breve sobre el estado físico, marca o uso del item.'),
        stock: zod_1.z
            .string()
            .nullable()
            .describe('La cantidad numérica total disponible para el registro.'),
        typeNames: zod_1.z
            .array(zod_1.z.string())
            .nullable()
            .describe('Uno o más tipos de item (ej. Computación, Mobiliario, Audiovisuales).'),
    }),
});


/***/ }),
/* 128 */
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
const ai_inventory_service_1 = __webpack_require__(126);
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
/* 129 */
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
const ai_physical_book_service_1 = __webpack_require__(130);
const ai_physical_book_controller_1 = __webpack_require__(132);
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
/* 130 */
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
exports.AiPhysicalBookService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const groq_1 = __webpack_require__(120);
const messages_1 = __webpack_require__(121);
const prisma_service_1 = __webpack_require__(6);
const book_extraction_schema_1 = __webpack_require__(131);
const pnf_1 = __webpack_require__(38);
let AiPhysicalBookService = class AiPhysicalBookService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
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
    toPnfNames(value) {
        if (!value)
            return [];
        const list = Array.isArray(value) ? value : [value];
        return list
            .map((item) => (0, pnf_1.normalizePnfName)(typeof item === 'string' ? item : item?.name ?? item?.pnf ?? ''))
            .filter(Boolean);
    }
    async processBookIntent(userInput, currentBookData) {
        let normalizedContext = null;
        if (currentBookData) {
            const authors = Array.isArray(currentBookData.authors) ? currentBookData.authors : (currentBookData.author ? [currentBookData.author] : []);
            const categories = Array.isArray(currentBookData.categories) ? currentBookData.categories : (currentBookData.category ? [currentBookData.category] : []);
            const pnfs = this.toPnfNames(currentBookData.pnfs ?? currentBookData.pnf ?? currentBookData.pnfNames);
            normalizedContext = {
                title: currentBookData.title || null,
                isbn: currentBookData.isbn || null,
                code: currentBookData.code || null,
                authorName: authors[0]?.name || authors[0] || null,
                categoryName: categories[0]?.name || categories[0] || null,
                pnfs: pnfs.length > 0 ? pnfs : null,
                yearOfPublication: currentBookData.yearOfPublication?.toString() || null,
                editorial: currentBookData.editorial || null,
                totalStock: currentBookData.availableStock?.toString() || '0'
            };
        }
        const pnfs = await this.prisma.pnf.findMany({ orderBy: { name: 'asc' } });
        const pnfList = pnfs.map((p) => p.name).join(', ');
        const systemPrompt = `
      Eres el asistente inteligente de gestión de biblioteca de la plataforma UPTALib.
      Tu trabajo es procesar las solicitudes de los administradores en lenguaje natural para rellenar los datos de un libro físico en el formulario.

      Debes extraer las siguientes propiedades: title, isbn, code, authorName, categoryName, pnfs, yearOfPublication, editorial, totalStock.

      Reglas de los PNFs:
      1. 'pnfs' es un arreglo con uno o más Programas Nacionales de Formación. Los PNFs registrados en la biblioteca son: ${pnfList}.
      2. Si el administrador menciona un PNF que no está en la lista, devuélvelo igualmente normalizado en mayúsculas sin espacios extra (se creará al guardar).
      3. El 'isbn' es el identificador editorial internacional y el 'code' es el código asignado por la biblioteca; son campos distintos. No pongas el ISBN dentro de 'code' ni viceversa.

      ${normalizedContext ? `CONTEXTO DE EDICIÓN: El administrador está modificando un libro existente cuyos valores actuales son: ${JSON.stringify(normalizedContext)}.
      Modifica, incrementa, decrementa o actualiza los datos basándote estrictamente en esta estructura.
      Si el usuario pide cambiar el stock (ej: "Súmale 5 al stock" o "Cámbiale la cantidad a 10"), calcula el valor final relativo al stock actual y devuélvelo en la propiedad 'totalStock' como un string numérico.
      Si el usuario agrega o quita un PNF, devuelve en 'pnfs' la lista final completa.` : ''}

      Si el usuario no especifica un cambio en una propiedad y no hay contexto de edición, devuélvela como null (o [] en el caso de 'pnfs'). Si hay contexto de edición, mantén el valor original del contexto si no se solicita alterarlo.
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
                    title: null, isbn: null, code: null, authorName: null, categoryName: null,
                    pnfs: [], yearOfPublication: null, editorial: null, totalStock: null
                }
            };
        }
    }
};
exports.AiPhysicalBookService = AiPhysicalBookService;
exports.AiPhysicalBookService = AiPhysicalBookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], AiPhysicalBookService);


/***/ }),
/* 131 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookExtractionSchema = void 0;
const zod_1 = __webpack_require__(123);
const pnf_1 = __webpack_require__(38);
const PNF_LIST = zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : Array.isArray(val) ? val.map((item) => (0, pnf_1.normalizePnfName)(typeof item === 'string' ? item : item?.name ?? item?.pnf ?? '')).filter(Boolean) : val), zod_1.z.array(zod_1.z.string().min(3).describe('El Programa Nacional de Formación asociado.')));
exports.BookExtractionSchema = zod_1.z.object({
    message: zod_1.z.string().describe('Un mensaje amigable indicando qué campos se procesaron o modificaron.'),
    extractedData: zod_1.z.object({
        title: zod_1.z.string().nullable().describe('El título del libro extraído de la solicitud.'),
        isbn: zod_1.z.string().nullable().describe('El código ISBN del libro (identificador editorial internacional).'),
        code: zod_1.z.string().nullable().describe('El código asignado por la biblioteca al libro físico (base de los códigos de los ejemplares).'),
        authorName: zod_1.z.string().nullable().describe('El nombre completo del autor del libro.'),
        categoryName: zod_1.z.string().nullable().describe('La categoría, género o materia del libro.'),
        pnfs: PNF_LIST.describe('Lista de PNFs asociados al libro. Si no hay ninguno, devolver array vacío [].'),
        yearOfPublication: zod_1.z.string().nullable().describe('El año de publicación del libro devuelto como un string numérico.'),
        editorial: zod_1.z.string().nullable().describe('El nombre de la editorial.'),
        totalStock: zod_1.z.string().nullable().describe('La cantidad total de libros físicos disponibles.')
    })
});


/***/ }),
/* 132 */
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
const ai_physical_book_service_1 = __webpack_require__(130);
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
/* 133 */
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