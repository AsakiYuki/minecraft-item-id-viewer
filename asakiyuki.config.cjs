const [fs, path] = [require("fs"), require("path")];

function manifest() {
    return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "manifest.json"), "utf-8"));
}

/**
 * Configuration object for the JsonUI Scripting build process.
 * @type {import('jsonui-scripting').Config}
 */
const config = {
    compiler: {
        autoCompress: true,
        fileExtension: "ui",
        encodeJson: false,
        UI: {
            nameLength: 32,
            namespaceAmount: 1,
            namespaceLength: 64,
            obfuscateName: false,
            obfuscateType: false,
        },
    },
    installer: {
        autoInstall: true,
        developEvironment: true,
        previewVersion: false,
        customPath: false,
        installPath: "/your/minecraft/data/path",
    },
    manifest: manifest(),
};

module.exports = { config };
