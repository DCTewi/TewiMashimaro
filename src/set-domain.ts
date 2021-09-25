#!/usr/bin/env node

import fs from "fs"
import { series } from "async"
import { exec } from "child_process"
import { _greenlockConfPath } from "./server"

try {
    const url = process.argv[2] as string | undefined

    if (url == undefined) {
        throw "Invalid URL"
    } else {
        if (fs.existsSync(_greenlockConfPath)) {
            fs.rmSync(_greenlockConfPath, {
                recursive: true,
                force: true
            })
        }

        series([
            ok => {
                exec(`npx greenlock add --subject ${url} --altnames ${url}`).on('close', () => {
                    ok()
                })
            },
            () => console.log('completed.')
        ])
    }
} catch (err) {
    console.error(err)
}

