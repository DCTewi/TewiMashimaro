#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const server_1 = require("./server");
const main = () => {
    const args = (0, yargs_1.default)(process.argv.slice(2))
        .options({
        dir: {
            alias: 'd',
            type: 'string',
            demandOption: true,
            description: '棉花糖的启动位置(请保证读写权限)'
        },
        log: {
            type: 'boolean',
            default: true,
            description: '是否记录访问日志'
        },
        local: {
            type: 'boolean',
            default: false,
            description: '是否仅监听本地回环(127.0.0.1)'
        },
        port: {
            type: 'number',
            default: 3000,
            description: '监听端口'
        }
    })
        .help()
        .parseSync();
    const serverarg = {
        dir: args.dir,
        recordLog: args.log,
        localonly: args.local,
        port: args.port
    };
    server_1.server.deploy(serverarg);
};
main();
//# sourceMappingURL=index.js.map