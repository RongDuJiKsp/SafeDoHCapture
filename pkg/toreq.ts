import * as fs from "node:fs"
import csv from "csv-parser";

export class torequest {
    static urlful(web: string): string {
        return "https://" + web
    }

    static init(path: string, lim: number): Promise<Requests> {
        return new Promise<Requests>((resolve, reject) => {
            const chucks: Record<string, string>[] = [];
            fs.createReadStream(path).pipe(csv()).on("data", chunk => {
                if (chucks.length < lim) {
                    chucks.push(chunk);
                }
            }).on('end', () => {
                const inner = chucks.map(chuck => chuck['web']).map(url => url.trim()).map(url => torequest.urlful(url));
                resolve(new Requests(inner));

            }).on('error', (err) => {
                reject(err);
            })
        })
    }
}

class Requests {
    inner: string[] = []

    constructor(inner: string[]) {
        this.inner = inner
    }

}