const exec = require("child_process").exec
const fs = require("fs")

require('./set-registry')

const packageJsonBackup = fs.readFileSync('package.json')

let packageJson = JSON.parse(packageJsonBackup)
delete packageJson.publishConfig

fs.writeFileSync('package.json', JSON.stringify(packageJson))
fs.renameSync('.npmrc', '.npmrc_bak')

try {
    let publishProcess = exec("npm publish")

    publishProcess.on('exit', code => {
        console.log(`Publish progress over with ${code.toString()}`)
    })

    publishProcess.stdout.on('data', data => {
        console.log(`[npm] ${data.toString()}`)
    })

    publishProcess.stderr.on('data', data => {
        console.error(`[npm] ${data.toString()}`)
    })

} finally {
    fs.renameSync('.npmrc_bak', '.npmrc')
    fs.writeFileSync('package.json', packageJsonBackup)
}
