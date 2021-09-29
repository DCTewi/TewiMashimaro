#!/usr/bin/env node

import yargs from "yargs";
import { server, ServerArgs } from "./server";

const main = () => {
    const args = yargs(process.argv.slice(2))
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
        .parseSync()

    const serverarg: ServerArgs = {
        dir: args.dir,
        recordLog: args.log,
        localonly: args.local,
        port: args.port
    }

    server.deploy(serverarg)
}

main()
