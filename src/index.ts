#!/usr/bin/env node

import yargs from "yargs";
import { server } from "./server";

const main = () => {
    const args = yargs(process.argv.slice(2))
        .options({
            dir: {
                alias: 'd',
                type: 'string',
                demandOption: true,
                description: '棉花糖的启动位置(请保证读写权限)'
            },
            port: {
                alias: 'p',
                type: 'number',
                default: 3000,
                description: '棉花糖的监听端口'
            },
            log: {
                alias: 'l',
                type: 'boolean',
                default: true,
                description: '是否记录访问日志'
            },
            ssl: {
                type: 'boolean',
                default: false,
                description: '是否启用SSL(证书请放置在启动位置下cert.key/pem)'
            }
        })
        .help()
        .parseSync()

    server.deploy(args.dir, args.port, args.log, args.ssl)
}

main()
