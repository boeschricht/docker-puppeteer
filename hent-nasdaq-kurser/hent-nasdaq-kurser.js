require("log-node")();
const log = require("log");
const puppeteer = require('puppeteer');

function Date_toISOStringLocal(d) {
    function z(n){return (n<10?'0':'') + n}
    return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' +
           z(d.getDate())
            
  }
  function Time_toISOStringLocal(d) {
    function z(n){return (n<10?'0':'') + n}
    return z(d.getHours()+2) + ':' +  
           z(d.getMinutes())
            
  }

  function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  }


(async() => {
    log.info('Start ...');

    const url1 = "http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE05NYK01EA53";
    const url2 = "http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE1NYK01EA53";
    const url3 = "http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE15NYK01EDA53";
    const contentSelector1 = "#db-p-avista-table > tbody > tr > td.db-a-lsp";
    const contentSelector2 = "#db-p-avista-table > tbody > tr > td.db-a-lsp";
    const contentSelector3 = "#db-p-avista-table > tbody > tr > td.db-a-lsp";
    const navigationTimeout = 10000;

    var today = new Date();

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-logging=stderr', '--v=1'
        ]    
    });    

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36 Edg/89.0.100.0")
    // await page.setViewport({ width: 1920, height: 1080 });

    try {
        
        
        // TODO: this should wait for the selector to be available
        
        log.info('Goto url1 ...');
        await page.goto(url1, {waitUntil: 'domcontentloaded', timeout: navigationTimeout});
        log.info('Sleeping 5s ...');
        // wait 5 seconds (if there is some dynamic content)
        await sleep(5000);
        // Get data for url 1
        log.info('Fetching data for url1...');
        let content1 = null;
        try {
            content1 = await page.$eval(contentSelector1, (el) => el.textContent);
        } catch (e) {
            throw new Error('Cannot get content (content selector is probably wrong)');
        }
        log.info(`url1 data: ${content1}`);
        
        // open URL2 in a browser
        log.info('Goto url2 ...');
        await page.goto(url2, {
            waitUntil: 'networkidle2',
            timeout: navigationTimeout,
        });
        // wait 5 seconds (if there is some dynamic content)
        // TODO: this should wait for the selector to be available
        log.info('Sleeping 5s ...');
        await sleep(5000);
        // Get data for url 2
        log.info('Fetching data for url2...');
        let content2 = null;
        try {
            content2 = await page.$eval(contentSelector2, (el) => el.textContent);
        } catch (e) {
            throw new Error('Cannot get content (content selector is probably wrong)');
        }
        log.info(`url2 data: ${content2}`);
        
        // open URL3 in a browser
        log.info('Goto url3 ...');
        await page.goto(url3, {waitUntil: 'networkidle2', timeout: navigationTimeout});
        log.info(`Opening URL3: ` + url3);
        await page.goto(url3, {
            waitUntil: 'networkidle2',
            timeout: navigationTimeout,
        });
        // wait 5 seconds (if there is some dynamic content)
        // TODO: this should wait for the selector to be available
        log.info('Sleeping 5s ...');
        await sleep(5000);
        // Get data for url 3
        log.info('Fetching data for url3...');
        let content3 = null;
        try {
            content3 = await page.$eval(contentSelector3, (el) => el.textContent);
        } catch (e) {
            throw new Error('Cannot get content (content selector is probably wrong)');
        }
        log.info(`url3 data: ${content3}`);
        
    } catch (error) {
        log.error('Could not goto url1.' + error);
    }
    
    log.info('Closing Puppeteer...');
    await browser.close();
    log.info('Done.');
    
    
        
    })();
