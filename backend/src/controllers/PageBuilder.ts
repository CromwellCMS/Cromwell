import { PageBuilderType } from "@cromwell/core";
import { resolve } from 'path';
const fs = require('fs-extra');

export class PageBuilder implements PageBuilderType {

    private rootBuildDir: string;
    private buildStaticDir: string;

    constructor() {
        this.rootBuildDir = resolve(__dirname, '../../../renderer/.next').replace(/\\/g, '/');
        console.log('PageBuilder rootBuildDir: ', this.rootBuildDir);
        if (!fs.existsSync(this.rootBuildDir)) {
            throw new Error('PageBuilder: cannot find frontend nextjs build folder: ' + this.rootBuildDir);
        }
        const buildIdPath = this.rootBuildDir + '/BUILD_ID';
        let buildId;
        if (fs.existsSync(buildIdPath)) {
            buildId = fs.readFileSync(buildIdPath, { encoding: 'utf8', flag: 'r' });
        } else {
            throw new Error('PageBuilder: cannot find frontend nextjs BUILD_ID file: ' + buildIdPath);
        }
        this.buildStaticDir = `${this.rootBuildDir}/server/static/${buildId}/pages`
        console.log('PageBuilder buildStaticDir: ', this.buildStaticDir);
        if (!fs.existsSync(this.buildStaticDir)) {
            throw new Error('PageBuilder: cannot find frontend nextjs static build folder: ' + this.buildStaticDir);
        }

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