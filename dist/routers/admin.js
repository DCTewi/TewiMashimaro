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
exports.adminRouter = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const configuration_1 = require("../utils/configuration");
const database_1 = require("../utils/database");
const markdown_it_1 = __importDefault(require("markdown-it"));
const md = (0, markdown_it_1.default)();
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.get('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userKey = req.query.key;
    if (userKey != undefined && userKey.trim() == (0, configuration_1.config)().adminKey) {
        let pageNumber = req.query.page;
        if (pageNumber == undefined || pageNumber < 1) {
            pageNumber = 1;
        }
        const mashimaros = (yield (0, database_1.db)().get()).sort((a, b) => {
            if (a.read != b.read) {
                return a.read ? 1 : -1;
            }
            return new Date(a.time).getTime() - new Date(b.time).getTime();
        });
        const capacity = (0, configuration_1.config)().adminCapacity;
        const startCount = capacity * (pageNumber - 1);
        const endCount = startCount + capacity;
        res.render(path_1.default.resolve(__dirname, '../../views/admin.pug'), {
            siteName: (0, configuration_1.config)().siteName,
            title: 'Dashboard',
            csrfToken: req.csrfToken(),
            mashimaros: mashimaros.slice(startCount, endCount),
            pageNumber: pageNumber,
            pageTotal: Math.max(Math.ceil(mashimaros.length / capacity), 1),
            userKey: userKey,
            localizer: req.localizer,
            backgroundCss: `.background-container{background-image: url(${(0, configuration_1.config)().backgroundImageUrl});background-attachment:fixed;}`,
            md: md,
        });
    }
    else {
        res.redirect('/');
    }
}));
exports.adminRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userKey = req.query.key;
    if (userKey != undefined && userKey.trim() == (0, configuration_1.config)().adminKey) {
        console.log(req.body);
        const method = req.body.method;
        const id = req.body.id;
        if (method != undefined && id != undefined) {
            if (method == 'delete') {
                yield (0, database_1.db)().remove(id);
            }
            else if (method == 'read') {
                let mashimaro = (yield (0, database_1.db)().get()).find(m => m.id == id);
                if (mashimaro != undefined) {
                    mashimaro.read = !mashimaro.read;
                    yield (0, database_1.db)().update(mashimaro);
                }
            }
            else if (method == 'answer') {
                const answer = req.body.answer;
                if (answer != undefined) {
                    let mashimaro = (yield (0, database_1.db)().get()).find(m => m.id == id);
                    console.log(method, id, answer, mashimaro);
                    if (mashimaro != undefined) {
                        mashimaro.read = true;
                        mashimaro.answer = answer;
                        console.log(method, id, answer, mashimaro);
                        yield (0, database_1.db)().update(mashimaro);
                    }
                }
            }
        }
        res.redirect(req.originalUrl);
    }
    else {
        res.redirect('/');
    }
}));
//# sourceMappingURL=admin.js.map