const { exec } = require('child_process');

const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr });
        });
    });
}

module.exports.execute = async (command, message) => {
    const executed = await execPromise(command);
    if (executed.error) {
        console.log(executed.error);
        throw Error(`failed to execute ${command}`);
    }
    return executed;
}

module.exports.parseGlobalPackages = async (stdout) => {
    const packages = [];
    const lines = stdout.split('\n');

    lines.forEach(line => {
        if (line.trim() === '') return;
        const [packageName] = line.split(' -> ');
        if (packageName) packages.push(packageName)
    });

    return packages;
}