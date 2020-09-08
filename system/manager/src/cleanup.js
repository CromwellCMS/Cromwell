const fs = require('fs-extra');
const { projectRootDir, systemDir } = require('../config');


const folders = [
    systemDir + '\\core\\backend\\node_modules',
    systemDir + '\\core\\common\\node_modules',
    systemDir + '\\core\\frontend\\node_modules',
    systemDir + '\\core\\backend\\dist',
    systemDir + '\\core\\common\\dist',
    systemDir + '\\core\\frontend\\dist',
    systemDir + '\\core\\backend\\es',
    systemDir + '\\core\\common\\es',
    systemDir + '\\core\\frontend\\es',

    systemDir + '\\server\\node_modules',
    systemDir + '\\server\\.cromwell',
    systemDir + '\\server\\build',

    systemDir + '\\renderer\\node_modules',
    systemDir + '\\renderer\\build',
    systemDir + '\\renderer\\.cromwell',

    systemDir + '\\admin-panel\\.cromwell',
    systemDir + '\\admin-panel\\node_modules',
    systemDir + '\\admin-panel\\build',

    systemDir + '\\.cromwell',


    //temp
    projectRootDir + '\\themes\\cromwell-demoshop\\node_modules',
    projectRootDir + '\\themes\\cromwell-demoshop\\es',
    projectRootDir + '\\themes\\cromwell-demoshop\\dist',
    projectRootDir + '\\plugins\\ProductShowcase\\node_modules',
    projectRootDir + '\\plugins\\ProductShowcase\\es',
    projectRootDir + '\\plugins\\ProductShowcase\\dist',
    projectRootDir + '\\plugins\\ProductShowcaseDemo\\node_modules',
    projectRootDir + '\\plugins\\ProductShowcaseDemo\\es',
    projectRootDir + '\\plugins\\ProductShowcaseDemo\\dist',

    projectRootDir + '\\node_modules',

]

const files = [
    systemDir + '\\core\\backend\\package-lock.json',
    systemDir + '\\core\\common\\package-lock.json',
    systemDir + '\\core\\frontend\\package-lock.json',
    systemDir + '\\server\\package-lock.json',
    systemDir + '\\renderer\\package-lock.json',
    projectRootDir + '\\package-lock.json',
    projectRootDir + '\\themes\\cromwell-demoshop\\package-lock.json',
]

// console.log(folders);
// console.log(files);

files.forEach(path => {
    if (fs.existsSync(path)) {
        console.log('Removing file: ' + path);
        try {
            fs.unlinkSync(path)
        } catch (e) { console.log(e) }
    }
})

folders.forEach(path => {
    if (fs.existsSync(path)) {
        console.log('Removing folder: ' + path);
        try {
            fs.unlinkSync(path)
        } catch (e) { console.log(e) }
    }
})

