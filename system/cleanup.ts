const fs = require('fs-extra');

const folders = [
    __dirname + '\\core\\backend\\node_modules',
    __dirname + '\\core\\common\\node_modules',
    __dirname + '\\core\\frontend\\node_modules',
    __dirname + '\\core\\backend\\dist',
    __dirname + '\\core\\common\\dist',
    __dirname + '\\core\\frontend\\dist',
    __dirname + '\\core\\backend\\es',
    __dirname + '\\core\\common\\es',
    __dirname + '\\core\\frontend\\es',
    __dirname + '\\server\\node_modules',
    __dirname + '\\renderer\\node_modules',
    __dirname + '\\renderer\\.next',
    __dirname + '\\renderer\\.cromwell',
    __dirname + '\\admin-panel\\.cromwell',
    __dirname + '\\admin-panel\\node_modules',

    //temp
    __dirname + '\\themes\\cromwell-demoshop\\node_modules',
    __dirname + '\\themes\\cromwell-demoshop\\es',
    __dirname + '\\themes\\cromwell-demoshop\\dist',
    __dirname + '\\plugins\\ProductShowcase\\node_modules',
    __dirname + '\\plugins\\ProductShowcase\\es',
    __dirname + '\\plugins\\ProductShowcase\\dist',
    __dirname + '\\plugins\\ProductShowcaseDemo\\node_modules',
    __dirname + '\\plugins\\ProductShowcaseDemo\\es',
    __dirname + '\\plugins\\ProductShowcaseDemo\\dist',


    __dirname + '\\node_modules',
]

const files = [
    __dirname + '\\core\\backend\\package-lock.json',
    __dirname + '\\core\\common\\package-lock.json',
    __dirname + '\\core\\frontend\\package-lock.json',
    __dirname + '\\server\\package-lock.json',
    __dirname + '\\renderer\\package-lock.json',
    __dirname + '\\package-lock.json',
    __dirname + '\\themes\\cromwell-demoshop\\package-lock.json',
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

