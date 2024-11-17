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
                    chrome: await platform_fs.whereIs("google-chrome-stable"),
                    firefox: await platform_fs.whereIs("firefox-esr")
                },
            })
            await session.manage().setTimeouts({pageLoad: 6000})
            console.log("Start Successful")
            for (const reqUrl of req.inner) {
                console.log("Nav to " + reqUrl)
                try {
                    let title: string = "";
                    try {
                        await session.get(reqUrl);
                        title = await session.getTitle();
                    } catch (e) {
                        try {
                            await session.get(reqUrl.replace("https://", "http://"));
                            title = await session.getTitle();
                        } catch (e) {
                            console.log(e)
                        }
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

