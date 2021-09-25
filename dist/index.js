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
const admin_1 = require("./routers/admin");
const home_1 = require("./routers/home");
const listenPort = 3000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // let mashimaros = await db().get()
        // for (let mashimaro of mashimaros) {
        //     mashimaro.answer = "啊对对对，你说得对"
        //     await db().update(mashimaro)
        // }
        // return
        const app = (0, express_1.default)();
        app.set('view engine', 'pug');
        app.use(express_1.default.static('public'));
        app.use((0, cookie_parser_1.default)());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, csurf_1.default)({ cookie: true }));
        app.use('', home_1.homeRouter);
        app.use('/me', admin_1.adminRouter);
        app.listen(listenPort, () => {
            console.log(`Start on port ${listenPort}.`);
        });
    });
}
main();
//# sourceMappingURL=index.js.map