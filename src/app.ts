import { execSync } from "child_process";

import fs from "fs";
import Utils from "../utils"

if (!fs.existsSync("cache.json")) fs.writeFileSync("cache.json", '{"stable":null,"preview":null}');
if (!fs.existsSync("manifest.json")) fs.writeFileSync("manifest.json", '{"name":"Minecraft: Item ID Viewer"}');
if (!fs.existsSync("build")) fs.mkdirSync("build");

(async () => {
    const getVersion = await Utils.getVersion();
    const cache = await Utils.readJson("cache.json");

    async function build(version: "stable" | "preview") {
        console.log(`Starting build for ${version}...`);
        const time = Date.now();
        await Utils.writeJson("manifest.json", {
            name: `Item ID Viewer (${getVersion[version]} ${version[0]?.toUpperCase()}${version.slice(1)})`,
            description: [
                "A tool to view item IDs in Minecraft.",
                "Note: Item IDs may display incorrectly after each version update or when installed alongside add-ons.",
                "Developed by Asaki Yuki",
            ].join("\n"),
            version: [0, 0, 1],
            baseGameVersion: Utils.parseVersion(getVersion[version]),
        });
        execSync(`bun run ui --version=${version}`, { stdio: "ignore" });
        fs.cpSync("Minecraft-UIBuild.mcpack", `build/${version}_version.mcpack`);
        console.log(`Finished build for ${version} in ${Date.now() - time}ms`);
    }

    if (getVersion.stable != cache.stable && (cache.stable = getVersion.stable)) await build("stable");
    if (getVersion.preview != cache.preview && (cache.preview = getVersion.preview)) await build("preview");

    await Utils.writeJson("cache.json", cache);
})();