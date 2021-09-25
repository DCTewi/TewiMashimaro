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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const rotating_file_stream_1 = require("rotating-file-stream");
const localizer_1 = require("./middlewares/localizer");
const admin_1 = require("./routers/admin");
const home_1 = require("./routers/home");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const listenPort = 3000;
        const logstream = (0, rotating_file_stream_1.createStream)('access.log', {
            interval: '1d',
            path: '_log',
            encoding: 'utf-8',
            teeToStdout: true
        });
        const logtoken = 'Req: :remote-addr [:date[iso]] ":method :url HTTP/:http-version" :status\nAgent: ":user-agent"\n';
        const app = (0, express_1.default)();
        app.set('view engine', 'pug');
        app.use(express_1.default.static('public'));
        app.use((0, morgan_1.default)(logtoken, { stream: logstream }));
        app.use((0, cookie_parser_1.default)());
        app.use(localizer_1.localizer);
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, csurf_1.default)({ cookie: { httpOnly: true, secure: true } }));
        app.use('', home_1.homeRouter);
        app.use('/me', admin_1.adminRouter);
        app.listen(listenPort, () => {
            console.log(`TewiMashimaro started on port ${listenPort}.\n`);
        });
    });
}
main();
//# sourceMappingURL=index.js.map