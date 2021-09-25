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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const configuration_1 = require("../utils/configuration");
const database_1 = require("../utils/database");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.get('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userKey = req.query.key;
    if (userKey != undefined && userKey.trim() == (0, configuration_1.config)().adminKey) {
        let pageNumber = req.query.page;
        if (pageNumber == undefined || pageNumber < 1) {
            pageNumber = 1;
        }
        const mashimaros = yield (0, database_1.db)().get();
        const capacity = 5;
        const startCount = capacity * (pageNumber - 1);
        const endCount = startCount + capacity;
        res.render('admin', {
            siteName: (0, configuration_1.config)().siteName,
            title: 'Dashboard',
            mashimaros: mashimaros.slice(startCount, endCount),
            pageNumber: pageNumber,
            pageTotal: Math.max(Math.ceil(mashimaros.length / capacity), 1),
            userKey: userKey
        });
    }
    else {
        res.redirect('/');
    }
}));
//# sourceMappingURL=admin.js.map