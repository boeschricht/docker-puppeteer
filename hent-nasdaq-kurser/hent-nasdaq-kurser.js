require("log-node")();
const log = require("log");
const puppeteer = require("puppeteer");
var alasql = require('alasql');
var config = require('./config');


function Date_toISOStringLocal(d) {
    function z(n) {
        return (n < 10 ? "0" : "") + n;
    }
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
}
function Time_toISOStringLocal(d) {
    function z(n) {
        return (n < 10 ? "0" : "") + n;
    }
    return z(d.getHours() + 2) + ":" + z(d.getMinutes());
}

function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

(async () => {
    var today = new Date();
    var datetimestr = Date_toISOStringLocal(today) + "-" + Time_toISOStringLocal(today)
    var errors = [];
    const datafile = config.datafile || "datafile-" + datetimestr;
    process.env.LOG_LEVEL = config.loglevel;
    console.log("log level"+ process.env.LOG_LEVEL);

    // Load existing dataset or create a new
    alasql("CREATE TABLE dataset (`URL ID` string, `URL beskrivelse` string, `URL adresse` string, `Dato` date, `Tid` time, `Kurs` number, `Fejl` string)");
    alasql("SELECT * INTO dataset FROM json('test-dataset')");
    var res = alasql("Select * FROM dataset");
    console.log("Dataset:");
    console.log(res);






    const browser = await puppeteer.launch({
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            // "--enable-logging=stderr",
            // "--v=1",
        ],
    });

    const page = await browser.newPage();

    for (const url of config.urls) {
        try {
            console.log("url: " + url);
            if (url.useragent || config.defaultuseragent) {
                console.log("Using HTTP UserAgent: " + (url.useragent || config.defaultuseragent));
                await page.setUserAgent(url.useragent || config.defaultuseragent);
            }


            // open url
            // // await page.goto(url, {
            // //     waitUntil: "domcontentloaded",
            // //     timeout: url.timeout || config.defaulttimeout || 0,
            // // });
            // page loaded 

            var sleep = url.sleep || 0;
            console.log("Sleeping %s seconds ...", sleep);
            // wait xxxx seconds (for dynamic content)
            // // await sleep(sleep);

            // Get data for url
            let content = null;
            console.log("Fetching selector: ", url.selector);
            try {
                console.log("waitforselector: ", url.selector);
                // // content = await page.waitForSelector(url.selector, (el) => el.textContent);
                content="50.5"
                console.log("got it: " + content);
                alasql("INSERT INTO dataset VALUES(?, ?, ?, ?, ?, ?)", url.URL_ID, url.URL_beskrivelse, url.URL_adresse, today.getDate(), today.getTime(), content);

                // content = await page.$eval(contentSelector1, (el) => el.textContent);
            } catch (e) {
                errors.push(e + "\r\n");
                alasql("INSERT INTO dataset VALUES(?, ?, ?, ?, ?, ?)", url.URL_ID, url.URL_beskrivelse, url.URL_adresse, today.getDate(), today.getTime(), null, e);
                throw new Error(
                    "Cannot get content (content selector is probably wrong)"
                );
            }
        } catch (err) {

        }
        var res = alasql("Select * FROM dataset")
        console.log("Dataset:")
        console.log(res)
    
    };


    console.log("Closing Puppeteer...");
    await browser.close();
    console.log("Done.");
})();
