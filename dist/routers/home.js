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
exports.homeRouter = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const configuration_1 = require("../utils/configuration");
const database_1 = require("../utils/database");
const markdown_it_1 = __importDefault(require("markdown-it"));
const md = (0, markdown_it_1.default)();
exports.homeRouter = (0, express_1.Router)();
var MashimaroStatus;
(function (MashimaroStatus) {
    MashimaroStatus[MashimaroStatus["Success"] = 0] = "Success";
    MashimaroStatus[MashimaroStatus["Limited"] = 1] = "Limited";
    MashimaroStatus[MashimaroStatus["Invalid"] = 2] = "Invalid";
    MashimaroStatus[MashimaroStatus["Unexcepted"] = 3] = "Unexcepted";
})(MashimaroStatus || (MashimaroStatus = {}));
let nextMashimaroTime = new Date(new Date().getTime() - 60000 / (0, configuration_1.config)().frequencyLimitPerMinute);
exports.homeRouter.get('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let mashimaroStatus = req.query.status;
    let pageNumber = req.query.page;
    if (pageNumber == undefined || pageNumber < 1) {
        pageNumber = 1;
    }
    const capacity = (0, configuration_1.config)().pageCapacity;
    const startCount = capacity * (pageNumber - 1);
    const endCount = startCount + capacity;
    const answeredMashimaros = (yield (0, database_1.db)().get()).filter(m => m.answer != undefined).sort((a, b) => {
        if (a.read != b.read) {
            return a.read ? 1 : -1;
        }
        return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
    res.render(path_1.default.resolve(__dirname, '../../views/home.pug'), {
        siteName: (0, configuration_1.config)().siteName,
        title: (0, configuration_1.config)().siteName,
        description: (0, configuration_1.config)().description,
        headerImage: (0, configuration_1.config)().headerImageUrl,
        csrfToken: req.csrfToken(),
        answeredMashimaros: answeredMashimaros.slice(startCount, endCount),
        mashimaroStatus: mashimaroStatus,
        pageNumber: pageNumber,
        pageTotal: Math.max(Math.ceil(answeredMashimaros.length / capacity), 1),
        localizer: req.localizer,
        backgroundCss: `.background-container{background-image: url(${(0, configuration_1.config)().backgroundImageUrl});background-attachment:fixed;}`,
        md: md,
    });
}));
exports.homeRouter.post('', (req, res) => {
    let status = MashimaroStatus.Invalid;
    if ((0, configuration_1.config)().frequencyLimitPerMinute >= 0 && nextMashimaroTime > new Date()) {
        status = MashimaroStatus.Limited;
    }
    else {
        const author = req.body.author;
        const content = req.body.content;
        if (author != undefined && content != undefined) {
            (0, database_1.db)().add(new database_1.Mashimaro(author, content));
            status = MashimaroStatus.Success;
            nextMashimaroTime = new Date(new Date().getTime() + 60000 / (0, configuration_1.config)().frequencyLimitPerMinute);
        }
        else {
            status = MashimaroStatus.Unexcepted;
        }
    }
    res.redirect(`?status=${status.toString()}`);
});
//# sourceMappingURL=home.js.map