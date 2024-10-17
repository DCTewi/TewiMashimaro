"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfig = exports.config = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const pathresolver_1 = require("./pathresolver");
class Configuration {
    constructor() {
        this.siteName = "Tewi Mashimaro";
        this.description = "通过棉花糖来向我匿名提问!";
        this.headerImageUrl = '';
        this.backgroundImageUrl = '';
        this.frequencyLimitPerMinute = 6;
        this.pageCapacity = 5;
        this.adminCapacity = 10;
        this.adminKey = (0, uuid_1.v4)();
    }
}
const configurationPath = "./config.json";
const config = () => {
    try {
        const raw = fs_1.default.readFileSync((0, pathresolver_1.resolvedPath)(configurationPath), 'utf-8');
        let conf = JSON.parse(raw);
        return conf;
    }
    catch (_a) {
        fs_1.default.writeFileSync((0, pathresolver_1.resolvedPath)(configurationPath), JSON.stringify(new Configuration(), null, 4), 'utf-8');
        return new Configuration();
    }
};
exports.config = config;
const setConfig = (config) => {
    fs_1.default.writeFileSync((0, pathresolver_1.resolvedPath)(configurationPath), JSON.stringify(config, null, 4), 'utf-8');
};
exports.setConfig = setConfig;
//# sourceMappingURL=configuration.js.map