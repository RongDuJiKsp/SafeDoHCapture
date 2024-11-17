import {torequest} from "./pkg/toreq";
import {rand} from "./pkg/rand";
import {platform_fs} from "./pkg/platform";

export async function main() {
    console.log("Reading Website")
    const req = await torequest.init("./webside.csv", 500);
    while (Math.random() < 3) {
        console.log("Start Request")
        const provider = rand.dohProvider();
        console.log("Use " + provider + " As DoH Provider")
        try {
            const session = await rand.makeRandDriver({
                dohServer: provider,
                noDNSCache: true,
                unsafe: true,
                headless: true,
                enableSkipOfPageLoad: true,
                exec: {
                    chrome: undefined,
                    firefox: await platform_fs.whereIs("firefox-esr")
                }
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
            console.log("Success Request")
            await session.close();
            console.log("Restarting")
        } catch (e) {
            console.log(e)
            console.log("Restarting")
        }
    }
}

