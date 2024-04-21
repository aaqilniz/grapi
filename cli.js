const yargs = require('yargs/yargs');
const { execute, parseGlobalPackages } = require('./utils');

module.exports = async () => {
    const extensions = ['cache', 'fuzzy', 'sql-controller'];

    const { argv } = yargs(process.argv.slice(2));
    const command = argv['_'][0];

    let arguments = '';

    delete argv['_'];
    delete argv['$0'];


    Object.keys(argv).forEach(arg => {
        arguments += `--${arg}='${argv[arg]}' `
    });
    try {
        const resposne = await execute('npm list -g --depth 0');
        const packages = await parseGlobalPackages(resposne.stdout);

        let exists = false;

        if (extensions.includes(command)) {
            packages.forEach(package => {
                if (package.includes(`lb4-${command}`)) { exists = true; }
            });
            if (!exists) await execute(`npm install -g lb4-${command}`);
            await execute(`lb4-${command} ${arguments}`);
        } else {
            packages.forEach(package => {
                if (package.includes('@loopback/cli')) { exists = true; }
            });
            if (!exists) await execute('npm install -g @loopback/cli');
            await execute(`lb4 ${command} ${arguments}`);
        }
    } catch (error) {
        console.log(error);
    }
}