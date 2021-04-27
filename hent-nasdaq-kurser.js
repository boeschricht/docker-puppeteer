require("log-node")();
const log = require("log");
const puppeteer = require("puppeteer");
var mysql = require('mysql');
var config = require('./config');
// ensure user and group can read and write database created.
const newmask = 0o000;
const oldmask = process.umask(newmask);


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
    return z(d.getHours() + 2) + ":" + z(d.getMinutes() + ":" + z(d.getSeconds()));
}

function Sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

(async () => {
    var today = new Date();
    var datetimestr = Date_toISOStringLocal(today) + "-" + Time_toISOStringLocal(today)
    var errors = [];
    const datafile = config.datafile || "datafile-" + datetimestr;
    process.env.LOG_LEVEL = config.loglevel;
    console.log("log level" + process.env.LOG_LEVEL);


    // Load existing Kurser or create a new'
    var connection = mysql.createConnection({
        host: '172.17.0.1',
        port: '3307',
        user: 'appuser1',
        password: 'lR2[jPwJc1',
        database: 'Hent_Nasdaq_kurser'
    });
    connection.connect();
    try {
        await connection.query("USE Hent_Nasdaq_kurser;");
        await connection.query("DROP TABLE IF EXISTS Kurser;");
        await connection.query("CREATE TABLE Kurser (`URL ID` text NOT NULL, `URL beskrivelse` text NOT NULL, `URL adresse` text NOT NULL, `Dato` date NOT NULL, `Tid` time NOT NULL, `Kurs` decimal(5,2), `Fejl` mediumblob );");
        // await connection.query("INSERT INTO Kurser VALUES ('XCSE05NYK01EA53', 'Nasdaq Nykredit 0,5%', 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE05NYK01EA53', '20210423', '00:33', '95.4', '');");
    } catch (error) {
        debugger;
        console.log('Error preparing database:', error)
    }

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
            console.log("url: " + JSON.stringify(url));
            if (url.useragent || config.defaultuseragent) {
                console.log("Using HTTP UserAgent: " + (url.useragent || config.defaultuseragent));
                await page.setUserAgent(url.useragent || config.defaultuseragent);
            }

            // open url
            await page.goto(url, {
                waitUntil: "domcontentloaded",
                timeout: url.timeout || config.defaulttimeout || 0,
            });
            // page loaded 

            var sleep = url.sleep || 0;
            console.log("Sleeping %s seconds ...", sleep);
            // wait xxxx seconds (for dynamic content)
            await sleep(sleep);

            // Get data for url
            let content = null;
            console.log("Fetching selector: ", url.selector);
            try {
                console.log("waitforselector: ", url.selector);
                content = await page.waitForSelector(url.selector, (el) => el.textContent);
                content = "50.5"
                console.log("got it: " + content);
                await connection.query("INSERT INTO Kurser VALUES(?, ?, ?, ?, ?, ?, ?)", [url.URL_ID, url.URL_beskrivelse, url.URL_adresse, Date_toISOStringLocal(today), Time_toISOStringLocal(today), content, null]);

                content = await page.$eval(contentSelector1, (el) => el.textContent);
            } catch (e) {
                console.error("an eror occured");
                errors.push(e + "\r\n");
                await connection.query("INSERT INTO Kurser VALUES(?, ?, ?, ?, ?, ?, ?)", [url.URL_ID, url.URL_beskrivelse, url.URL_adresse, Date_toISOStringLocal(today), Time_toISOStringLocal(today), null, e]);
                throw new Error(
                    "Cannot get content (content selector is probably wrong)"
                );
            }
        } catch (err) {

        }
    };
    
    console.log("Closing Puppeteer...");
    await browser.close();
    console.log("Done.");
    
    connection.end();
})();
