#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._greenlockPackageAgent = exports._greenlockConfPath = exports._staticDir = exports._logToken = exports._logPath = exports._logName = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const rotating_file_stream_1 = require("rotating-file-stream");
const localizer_1 = require("./middlewares/localizer");
const admin_1 = require("./routers/admin");
const home_1 = require("./routers/home");
const configuration_1 = require("./utils/configuration");
exports._logName = 'access.log';
exports._logPath = './_log';
exports._logToken = 'Req: :remote-addr [:date[iso]] ":method :url HTTP/:http-version" :status\nAgent: ":user-agent"\n';
exports._staticDir = './public';
exports._greenlockConfPath = './_greenlock';
exports._greenlockPackageAgent = `${process.env.npm_package_name}/${process.env.npm_package_version}`;
function main(debuged = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const logstream = (0, rotating_file_stream_1.createStream)(exports._logName, {
            interval: '1d',
            path: exports._logPath,
            encoding: 'utf-8',
            teeToStdout: true
        });
        const app = (0, express_1.default)();
        app.set('view engine', 'pug');
        app.use(express_1.default.static(exports._staticDir));
        app.use((0, morgan_1.default)(exports._logToken, { stream: logstream }));
        app.use((0, cookie_parser_1.default)());
        app.use(localizer_1.localizer);
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, csurf_1.default)({ cookie: { httpOnly: true, secure: true } }));
        app.use('', home_1.homeRouter);
        app.use('/me', admin_1.adminRouter);
        if (!debuged) {
            require("greenlock-express").init({
                packageRoot: process.cwd(),
                packageAgent: exports._greenlockPackageAgent,
                configDir: exports._greenlockConfPath,
                maintainerEmail: (0, configuration_1.config)().maintainerEmail,
                notify: (ev, args) => {
                    console.info(ev, args);
                },
                cluster: false
            }).serve(app);
        }
        else {
            app.listen(23456, () => {
                console.log('Mashimaro debug mode start on port 23456');
            });
        }
    });
}
main(process.argv.includes('--debug'));
//# sourceMappingURL=server.js.map