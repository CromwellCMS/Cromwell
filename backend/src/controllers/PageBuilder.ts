import { PageBuilderType } from "@cromwell/core";
import { resolve } from 'path';
import { getFrontendBuildDir } from '../helpers/getFrontendBuildDir';
const fs = require('fs-extra');

export class PageBuilder implements PageBuilderType {

    private buildStaticDir?: string;

    constructor() {
        this.buildStaticDir = getFrontendBuildDir();

    }
    buildPage(path: string) {

        console.log('PageBuilder::Building page. Path: ' + path);
    }

    deletePage(path: string) {
        console.log('PageBuilder::deletePage: Deleting page. Path: ' + path);

        const pageHTMLPath = `${this.buildStaticDir}/${path}.html`;
        if (fs.existsSync(pageHTMLPath)) {
            console.log('PageBuilder:deletePage deleting page HTML file: ' + pageHTMLPath);
            fs.unlinkSync(pageHTMLPath);
        } else {
            console.log('PageBuilder:deletePage cannot find page HTML file: ' + pageHTMLPath);
        }


        const pageJSONPath = `${this.buildStaticDir}/${path}.json`;
        if (fs.existsSync(pageJSONPath)) {
            console.log('PageBuilder:deletePage deleting page JSON file: ' + pageJSONPath);
            fs.unlinkSync(pageJSONPath);
        } else {
            console.log('PageBuilder:deletePage cannot find page JSON file: ' + pageJSONPath);
        }

    }
}