const { existsSync, renameSync, readFileSync, writeFileSync } = require("fs");
const yargs = require("yargs");

const toGithub = () => {
    if (existsSync('.npmrc')) {
        return
    }

    renameSync('.npmrc_bak', '.npmrc')

    const packageJsonBackup = readFileSync('package.json')
    let packageJson = JSON.parse(packageJsonBackup)
    packageJson.publishConfig = {
        registry: "https://npm.pkg.github.com/DCTewi"
    }
    writeFileSync('package.json', JSON.stringify(packageJson, null, 4))
}

const toNpm = () => {
    if (existsSync('.npmrc_bak')) {
        return
    }

    renameSync('.npmrc', '.npmrc_bak')

    const packageJsonBackup = readFileSync('package.json')
    let packageJson = JSON.parse(packageJsonBackup)
    delete packageJson.publishConfig
    writeFileSync('package.json', JSON.stringify(packageJson, null, 4))
}

const args = yargs
    .options({
        to: {
            type: 'string',
            default: 'github'
        }
    })
    .help()
    .parseSync()

if (args.to == 'github') {
    toGithub()
    console.log('Set registry to Github completed')
} else if (args.to == 'npm') {
    toNpm()
    console.log('Set registry to NPM completed')
} else {
    console.log(`${args.to} not found!`)
}
