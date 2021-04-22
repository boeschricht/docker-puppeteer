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
    const contentSelector1 = "[class^=change-log__MonthBox-]:nth-of-type(1) ul";
    const contentSelector2 = "[class^=change-log__MonthBox-]:nth-of-type(1) ul";
    const contentSelector3 = "[class^=change-log__MonthBox-]:nth-of-type(1) ul";
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
    // await page.setViewport({ width: 1920, height: 1080 });

    try {
        log.info('Goto url1 ...');
        await page.goto('http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE05NYK01EA53', {waitUntil: 'domcontentloaded', timeout: 0});
        log.info('her ...');
       
    } catch (error) {
        log.error('Could not goto url1.' + error);
    }
return
    try {
        log.info('Goto url2 ...');
        await page.goto(url2, {waitUntil: 'networkidle2', timeout: navigationTimeout});
        
    } catch (error) {
        log.error('Could not goto url2.' + error);
    }    
    try {
        log.info('Goto url3 ...');
        await page.goto(url3, {waitUntil: 'networkidle2', timeout: navigationTimeout});
    } catch (error) {
        log.error('Could not goto url3.' + error);
    }

    try {
        log.info('Goto url4 ...');
        await page.goto("http://www.google.com", {waitUntil: 'networkidle2', timeout: navigationTimeout});
    } catch (error) {
        log.error('Could not goto url4.' + error);
    }

        // wait 5 seconds (if there is some dynamic content)
    // TODO: this should wait for the selector to be available
    log.info('Sleeping 5s ...');
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
    log.info(`Opening URL2: ` + url2);
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
    
    const dataset = await Apify.openDataset('Kurser20210414');
    dataset.pushData({date: Date_toISOStringLocal(today), time: Time_toISOStringLocal(today), key1: "url1", val1: content1, key2: "url2", val2: content2, key3: "url3", val3: content3})
    log.info('Closing Puppeteer...');
    await browser.close();
    
    
    log.info('Done.');


})();
