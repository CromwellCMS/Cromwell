const fs = require('fs-extra');

const folders = [
    __dirname + '\\core\\core-backend\\node_modules',
    __dirname + '\\core\\core-common\\node_modules',
    __dirname + '\\core\\core-frontend\\node_modules',
    __dirname + '\\core\\core-backend\\dist',
    __dirname + '\\core\\core-common\\dist',
    __dirname + '\\core\\core-frontend\\dist',
    __dirname + '\\core\\core-backend\\es',
    __dirname + '\\core\\core-common\\es',
    __dirname + '\\core\\core-frontend\\es',
    __dirname + '\\backend\\node_modules',
    __dirname + '\\renderer\\node_modules',
    __dirname + '\\renderer\\.next',
    __dirname + '\\renderer\\.cromwell',
    __dirname + '\\themes\\node_modules',
    __dirname + '\\themes\\cromwell-demoshop\\node_modules',
    __dirname + '\\node_modules',
]

const files = [
    __dirname + '\\core\\core-backend\\package-lock.json',
    __dirname + '\\core\\core-common\\package-lock.json',
    __dirname + '\\core\\core-frontend\\package-lock.json',
    __dirname + '\\backend\\package-lock.json',
    __dirname + '\\renderer\\package-lock.json',
    __dirname + '\\themes\\cromwell-demoshop\\package-lock.json',
    __dirname + '\\package-lock.json'
]

// console.log(folders);
// console.log(files);

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

