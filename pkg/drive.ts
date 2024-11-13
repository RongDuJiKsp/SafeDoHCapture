import {Browser, Builder, WebDriver} from "selenium-webdriver";
import {Options as ChromeOptions} from "selenium-webdriver/chrome";
import {Options as FirefoxOptions} from "selenium-webdriver/firefox";
import {linux} from "./linux";

export class drive {

    static chrome(options: BrowserOptions): Promise<WebDriver> {
        const opt = new ChromeOptions();
        if (options.headless) {
            opt.addArguments("--headless")
            opt.addArguments('--disable-gpu'); // GPU加速在无头模式下无用
        }
        if (options.unsafe) {
            opt.addArguments("--no-sandbox")
            opt.addArguments('--ignore-certificate-errors'); // 忽略SSL证书错误
            opt.addArguments('--allow-insecure-localhost'); // 允许不安全的本地地址
            opt.addArguments('--disable-web-security'); // 禁用跨域检查
        }
        if (options.noDNSCache) {
            opt.addArguments('--dns-cache-size=0');  // 禁用 DNS 缓存
            opt.addArguments('--disable-dns-prefetching');  // 禁用 DNS 预取
        }
        if (options.dohServer) {
            opt.addArguments('--dns-over-https');  // 启用 DoH
            opt.addArguments('--doh-url=' + options.dohServer);  // 设置 DoH 服务器，
        }

        return new Builder().forBrowser(Browser.CHROME).setChromeOptions(opt).build()
    }

    static async firefox(options: BrowserOptions): Promise<WebDriver> {
        const opt = new FirefoxOptions();
        if (linux.is()) {
            opt.setBinary(await linux.whereIs("firefox"))
        }
        if (options.headless) {
            opt.addArguments("--headless")
        }
        if (options.unsafe) {
            opt.setPreference("acceptInsecureCerts", true); // 忽略 SSL 证书错误
            opt.setPreference("dom.security.https_only_mode", false); // 关闭HTTPS-only模式
            opt.setPreference("security.csp.enable", false); // 禁用内容安全策略 (CSP)
        }
        if (options.noDNSCache) {
            opt.setPreference('network.dns.disablePrefetch', true);  // 禁用 DNS 预取
            opt.setPreference('network.dnsCacheExpiration', 0);  // 禁用 DNS 缓存
            opt.setPreference('network.dnsCacheEntries', 0);  // 清空 DNS 缓存
        }
        if (options.dohServer) {
            opt.setPreference("network.trr.mode", 2); // 启用 DoH，2 代表启用并使用 DoH 请求
            opt.setPreference("network.trr.uri", options.dohServer); // 设置 DoH 服务器
        }
        return new Builder().forBrowser(Browser.FIREFOX).setFirefoxOptions(opt).build()
    }
}

export interface BrowserOptions {
    headless?: boolean;
    dohServer?: string
    unsafe?: boolean
    noDNSCache?: boolean
}