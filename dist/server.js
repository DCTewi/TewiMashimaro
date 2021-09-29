"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const rotating_file_stream_1 = require("rotating-file-stream");
const localizer_1 = require("./middlewares/localizer");
const admin_1 = require("./routers/admin");
const home_1 = require("./routers/home");
const configuration_1 = require("./utils/configuration");
const database_1 = require("./utils/database");
const pathresolver_1 = require("./utils/pathresolver");
const _logName = 'access.log';
const _logPath = './_log';
const _logToken = 'Req: [:date[iso]] ":method :url HTTP/:http-version" :status\nAgent: ":user-agent"\n';
const _staticDir = '../public';
exports.server = {
    deploy: (arg) => {
        (0, pathresolver_1.setRootPath)(arg.dir);
        /* ensure exists */ {
            (0, database_1.db)().get();
            (0, configuration_1.config)();
        }
        const app = (0, express_1.default)();
        app.set('view engine', 'pug');
        app.use(express_1.default.static(path_1.default.resolve(__dirname, _staticDir)));
        if (arg.recordLog) {
            const logstream = (0, rotating_file_stream_1.createStream)(_logName, {
                interval: '1d',
                path: (0, pathresolver_1.resolvedPath)(_logPath),
                encoding: 'utf-8',
                teeToStdout: true
            });
            app.use((0, morgan_1.default)(_logToken, { stream: logstream }));
        }
        app.use((0, cookie_parser_1.default)());
        app.use(localizer_1.localizer);
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, csurf_1.default)({ cookie: { httpOnly: true, secure: arg.localonly } }));
        app.use('', home_1.homeRouter);
        app.use('/me', admin_1.adminRouter);
        if (arg.localonly) {
            console.log('LOCAL ONLY MODE');
            app.listen(arg.port, "127.0.0.1", () => {
                console.log(`Mashimaro start on port ${arg.port}`);
            });
        }
        else {
            app.listen(arg.port, () => {
                console.log(`Mashimaro start on port ${arg.port}`);
            });
        }
    }
};
//# sourceMappingURL=server.js.map