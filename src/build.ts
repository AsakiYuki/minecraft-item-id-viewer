import { execSync } from "child_process"

import fs from "fs"
import Utils from "../utils"

if (!fs.existsSync("cache.json")) fs.writeFileSync("cache.json", '{"stable":null,"preview":null}')
if (!fs.existsSync("manifest.json")) fs.writeFileSync("manifest.json", '{"name":"Minecraft: Item ID Viewer"}')
if (!fs.existsSync("build")) fs.mkdirSync("build")

;(async () => {
	const getVersion = await Utils.getVersion()
	const cache = await Utils.readJson("cache.json")
	const { all_versions } = await Utils.readJson("build/backup/list.json")
	let newVersionFound = false

	let commit = "New version found: "

	async function build(version: "stable" | "preview") {
		console.log(`Starting build for ${version}...`)
		const time = Date.now()
		await Utils.writeJson("manifest.json", {
			name: `Item ID Viewer (${getVersion[version]} ${version[0]?.toUpperCase()}${version.slice(1)})`,
			description: [
				"A tool to view item IDs in Minecraft.",
				"Note: Item IDs may display incorrectly after each version update or when installed alongside add-ons.",
				"Developed by Asaki Yuki",
			].join("\n"),
			version: [0, 0, 1],
			baseGameVersion: Utils.parseVersion(getVersion[version]),
		})
		execSync(`bun run ui --version=${version}`, { stdio: "ignore" })
		fs.cpSync("Minecraft-UIBuild.mcpack", `build/${version}.mcpack`)

		all_versions.push(`${version}-${getVersion[version]}`)
		fs.cpSync("Minecraft-UIBuild.mcpack", `build/backup/${version}-${getVersion[version]}.mcpack`)

		console.log(`Finished build for ${version} in ${Date.now() - time}ms`)
	}

	if (getVersion.stable != cache.stable) {
		console.log(`Found new stable version: ${getVersion.stable}`)
		await build("stable")
		commit += `stable-${getVersion.stable}`
		newVersionFound = true

		// Update cache
		cache.stable = getVersion.stable
	}

	if (getVersion.preview != cache.preview && (cache.preview = getVersion.preview)) {
		console.log(`Found new preview version: ${getVersion.stable}`)
		await build("preview")
		if (newVersionFound) commit += ", "
		commit += `preview-${getVersion.preview}`
		newVersionFound = true
	}

	if (newVersionFound) {
		await Promise.all([
			Utils.writeJson("cache.json", cache),
			Utils.writeJson("build/backup/list.json", { all_versions }),
		])
		fs.writeFileSync("commit-msg.txt", commit)
	} else fs.writeFileSync("commit-msg.txt", "")
})()
