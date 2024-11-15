import {torequest} from "./pkg/toreq";
import {rand} from "./pkg/rand";
import {drive} from "./pkg/drive";

export async function main() {
    console.log("Reading Website")
    const req = await torequest.init("./webside.csv", 500);
    while (Math.random() < 3) {
        console.log("Start Request")
        const provider = rand.dohProvider();
        console.log("Use " + provider + " As DoH Provider")
        const session = await drive.chrome({
            dohServer: provider,
            noDNSCache: true,
            unsafe: true,
            headless: true,
            noAssetsLoad: true
        })
        console.log("Start Successful")
        for (const reqUrl of req.inner) {
            console.log("Nav to " + reqUrl)
            try {
                let title: string = "";
                try {
                    await session.get(reqUrl);
                    title = await session.getTitle();
                } catch (e) {
                    await session.get(reqUrl.replace("https://", "http://"));
                    title = await session.getTitle();
                }
                console.log("title of " + reqUrl + " is " + title);

            } catch (e) {
                console.log("error: " + e);
            }
        }
        await session.close();
    }
}

