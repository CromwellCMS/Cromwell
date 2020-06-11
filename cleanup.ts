const fs = require('fs-extra');

const folders = [
    __dirname + '\\core\\node_modules',
    __dirname + '\\core\\dist',
    __dirname + '\\backend\\node_modules',
    __dirname + '\\renderer\\node_modules',
    __dirname + '\\renderer\\.next',
    __dirname + '\\templates\\node_modules',
    __dirname + '\\templates\\cromwell-demoshop\\node_modules',
    __dirname + '\\node_modules',
]

const files = [
    __dirname + '\\package-lock.json'
]

console.log(folders);
console.log(files);

files.forEach(path => {
    if (fs.existsSync(path)) {
        console.log('Removing file: ' + path);
        fs.unlinkSync(path)
    }
})

folders.forEach(path => {
    if (fs.existsSync(path)) {
        console.log('Removing folder: ' + path);
        fs.removeSync(path);
    }
})

