const log = require("log");
const puppeteer = require("puppeteer");
var mysql = require('mysql');
var config = require('./config');
const randomUseragent = require('random-useragent');
const schedule = require('node-schedule');
const express = require('express');
const app = express();

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


    // Load existing Kurser table or create a new table
    var connection = mysql.createConnection({
        host: config.mariaDBHost,
        port: config.mariaDBport,
        user: config.mariaDBuser,
        password: config.mariaDBpassword,
        database: config.mariaDBdatabase
    });
    connection.connect();
    try {
        await connection.query("USE Hent_Nasdaq_kurser;");
        // TODO clean-up
        // await connection.query("DROP TABLE IF EXISTS Kurser;");
        await connection.query("CREATE TABLE IF NOT EXISTS Kurser (`URL ID` text NOT NULL, `URL beskrivelse` text NOT NULL, `URL adresse` text NOT NULL, `Dato` date NOT NULL, `Tid` time NOT NULL, `Kurs` decimal(5,2), `Fejl` text );");
        // await connection.query("INSERT INTO Kurser VALUES ('XCSE05NYK01EA53', 'Nasdaq Nykredit 0,5%', 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE05NYK01EA53', '20210423', '00:33', '95.4', '');");
    } catch (error) {
        console.log('Error preparing database:', error);
    }


    // Configure HTTP server
    app.get('/', function (req, res) {
        res.send('Hello World')
    })
    app.get('/data', function (req, res) {
        // Output data in JSON format
        //TODO add code
    })
    app.get('/chart', function (req, res) {
        // Output nice chart

        // contruct data
        connection.connect();
        try {
            await connection.query("USE Hent_Nasdaq_kurser");
            connection.query(
                'SELECT `URL beskrivelse` FROM `Kurser` group by `URL beskrivelse`',
                function(error, results, fields) {
                    debugger;
                    assert(!error);
                }
            )
        } catch (error) {
            console.log('Error fetching chart data:', error);
        }

        // TODO construct labels
        // TODO send chart
    })
    //TODO Change HTTP port to 80
    app.listen(3000)


    // await RunPuppeteer();

    console.log("Done.");
    connection.end();
})();

async function RunPuppeteer() {
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
            const useragent = (url.useragent || config.defaultuseragent || randomUseragent.getRandom());
            console.log("Using HTTP UserAgent: " + useragent);
            await page.setUserAgent(useragent);

            // open url
            await page.goto(url.URL_adresse, {
                waitUntil: "domcontentloaded",
                timeout: url.timeout || config.defaulttimeout || 0,
            });
            // page loaded 

            var sleep = url.sleep || 0;
            console.log("Sleeping %s seconds ...", sleep);
            // wait xxxx seconds (for dynamic content)
            await Sleep(sleep);

            // Get data for url
            let content = null;
            console.log("Fetching selector: ", url.selector);
            try {
                console.log("waitforselector: ", url.selector);
                content = await page.waitForSelector(url.selector, (el) => el.textContent, {
                    timeout: 5000
                    //TODO remove when tested
                });
                // content = "50.5"
                // console.log("got it: " + content);
                //TODO cleanup when done testing.
                await connection.query("INSERT INTO Kurser VALUES(?, ?, ?, ?, ?, ?, ?)", [url.URL_ID, url.URL_beskrivelse, url.URL_adresse, Date_toISOStringLocal(today), Time_toISOStringLocal(today), content, null]);
            } catch (e) {
                console.error("Cannot get content (content selector is probably wrong)");
                //BUG error object cannot be written to SQL without escaping.
                /* 
TimeoutError: waiting for selector `#dxb-p-avista-table > tbody > tr > td.db-a-lsp` failed: timeout 30000ms exceeded  │        modified:   config.json
    at new WaitTask (/node_modules/puppeteer/lib/cjs/puppeteer/common/DOMWorld.js:482:34)                             │        modified:   hent-nasdaq-kurser.js
    at DOMWorld.waitForSelectorInPage (/node_modules/puppeteer/lib/cjs/puppeteer/common/DOMWorld.js:415:26)           │        modified:   package.json
    at Object.internalHandler.waitFor (/node_modules/puppeteer/lib/cjs/puppeteer/common/QueryHandler.js:31:77)        │        modified:   sh/run.sh
    at DOMWorld.waitForSelector (/node_modules/puppeteer/lib/cjs/puppeteer/common/DOMWorld.js:313:29)                 │
    at Frame.waitForSelector (/node_modules/puppeteer/lib/cjs/puppeteer/common/FrameManager.js:842:51)                │Untracked files:
    at Page.waitForSelector (/node_modules/puppeteer/lib/cjs/puppeteer/common/Page.js:1285:33)                        │  (use "git add <file>..." to include in what will be committed)
    at /app/hent-nasdaq-kurser.js:91:38                                                                               │        '
    at processTicksAndRejections (internal/process/task_queues.js:97:5)                                               │        test-dataset.json

    
      sql: "INSERT INTO Kurser VALUES('XCSE1NYK01EA53', 'Nasdaq Nykredit 1% obligationslån 30 årig fast rente', 'http://ww│ mode change 100644 => 100755 sh/build.sh
w.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE1NYK01EA53', '2021-04-27', '24:53:21', `_disposed` = fals│ mode change 100644 => 100755 sh/run.sh
e, `_context` = '[object Object]', `_client` = '[object Object]', `_remoteObject` = '[object Object]', `_page` = '[obj│ delete mode 100644 test-dataset.json
ect Object]', `_frameManager` = '[object Object]', NULL)"                                                             │ delete mode 100644 tmp.js
}                                                                                                                     │bo@vm5nas01:/volume1/src/docker-puppeteer$ git push

                */
                //TODO store value for e to db 
                // await connection.query("INSERT INTO Kurser VALUES(?, ?, ?, ?, ?, ?, ?)", [url.URL_ID, url.URL_beskrivelse, url.URL_adresse, Date_toISOStringLocal(today), Time_toISOStringLocal(today), null, {e}]);
                await connection.query("INSERT INTO Kurser VALUES(?, ?, ?, ?, ?, ?, ?)", [url.URL_ID, url.URL_beskrivelse, url.URL_adresse, Date_toISOStringLocal(today), Time_toISOStringLocal(today), null, "An error occurred."]);
            }
        } catch (err) {
            console.log("An error occurred: " + err);
        }

    };

    console.log("Closing Puppeteer...");
    await browser.close();
}
