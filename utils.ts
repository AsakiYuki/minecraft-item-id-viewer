import fs from "fs";
import path from "path";

interface MinecraftVersion {
    stable: string;
    preview: string;
}

export default class Utils {
    static async readJson(file: string): Promise<any> {
        const data = await new Promise<any>((res, rej) => {
            fs.readFile(path.resolve(process.cwd(), file), "utf-8", (err, data) => {
                if (err) rej(err);
                res(JSON.parse(data));
            });
        });

        return data;
    }

    static async writeJson(file: string, data: any): Promise<void> {
        await new Promise<void>((res, rej) => {
            fs.writeFile(path.resolve(process.cwd(), file), JSON.stringify(data, null, 4), "utf-8", (err) => {
                if (err) rej(err);
                res();
            });
        });
    }

    static async getVersion(): Promise<MinecraftVersion> {
        const minecraft = await fetch("https://asakiyuki.com/api/minecraft").then(r => r.json());
        return {
            stable: minecraft.stable.version,
            preview: minecraft.preview.version
        };
    }

    static parseVersion(version: string): number[] {
        const [major, minor, patch] = version.split(".");
        return [Number(major), Number(minor), Number(patch)];
    }
}