import {Browser, ThenableWebDriver} from "selenium-webdriver";
import {BrowserOptions, drive} from "./drive";

const dohProviders: string[] = [
    'https://1.0.0.1/dns-query',
    'https://1.1.1.1/dns-query',
    'https://doh.pub/dns-query',
    'https://8.8.8.8/dns-query',
    'https://8.8.4.4/dns-query',
    'https://dns.twnic.tw/dns-query',
    'https://dns-unfiltered.adguard.com/dns-query',
    'https://dns.quad9.net/dns-query'
];
const drivers = [Browser.CHROME, Browser.FIREFOX];

export class rand {
    static dohProvider(): string {
        return dohProviders[Math.floor(Math.random() * dohProviders.length)];
    }

    static randDriver() {
        return drivers[Math.floor(Math.random() * drivers.length)];
    }

    static makeRandDriver(options: BrowserOptions): ThenableWebDriver {
        switch (rand.randDriver()) {
            case "chrome":
                return drive.chrome(options)
            case "firefox":
                return drive.firefox(options)
        }
    }

}