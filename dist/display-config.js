#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const configuration_1 = require("./utils/configuration");
const pathresolver_1 = require("./utils/pathresolver");
const args = (0, yargs_1.default)(process.argv.slice(2))
    .options({
    dir: {
        alias: 'd',
        type: 'string',
        default: '/home/mashimaro',
        description: '设置文件的位置(请保证读写权限)'
    },
})
    .help()
    .parseSync();
(0, pathresolver_1.setRootPath)(args.dir);
console.log((0, configuration_1.config)());
//# sourceMappingURL=display-config.js.map