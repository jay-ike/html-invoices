/*jslint node*/
const {transform} = require("lightningcss");
const {readFile, readdir, writeFile} = require("node:fs");
const {promisify} = require("node:util");
const path = require("node:path");
const fs = {};

fs.readFile = promisify(readFile);
fs.readDir = promisify(readdir);
fs.WriteFile = promisify(writeFile);

async function parseCss({dir}, src) {
    const blob = await fs.readFile(path.normalize(
        `${dir.input}/${dir.includes}/${src}`
    ));
    const {code} = transform({
        code: blob,
        filename: "style.css",
        minify: true
    });
    return code.toString();
}
module.exports = function (config) {
    config.addNunjucksAsyncShortcode("cssmin", async function (src) {
        let result = await parseCss(config, src);
        return result;
    });
    config.addPassthroughCopy("assets");

    return {
        dir: {
            includes: "_templates",
            input: "src",
            output: "_site"
        }
    };
};
