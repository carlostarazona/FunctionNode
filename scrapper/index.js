const puppeteer = require('puppeteer-extra');
const normalPuppeteer = require('puppeteer');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

const sleep = async(ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
}


const scrapper = async ({dni, birthDate, emissionDate}) => {
    puppeteer.use(
    RecaptchaPlugin({
        provider: {
        id: '2captcha',
        token: '59e0e04b12f26c262c2ee49e5d4fedee' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
        },
        //visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    }));
    
    const browser = await puppeteer.launch({
        headless: false, 
        devtools: true,
        /*
        args: [                
            '--no-sandbox'                                                  
            ],
            */
    });
    const page = await browser.newPage();
    page.once('load', () => console.log('Page loaded!'));  
    await page.emulate(normalPuppeteer.devices['iPad'])
    await page.goto('https://carnetvacunacion.minsa.gob.pe/#/auth');

    await page.evaluate(() => {
        const dniInput = document.getElementsByClassName('input-text-correct ng-untouched ng-pristine ng-invalid')[0];
        dniInput.focus();
    });
    await page.keyboard.type(dni, {delay: 200});
    await page.evaluate(() => {
        const dates = document.getElementsByClassName("example-tel-input-element placeholder:text-textoinput ng-pristine ng-invalid");
        dates[0].focus();
    });

    await page.keyboard.type(emissionDate, {delay: 200});
    await page.evaluate(() => {
        const dates = document.getElementsByClassName("example-tel-input-element placeholder:text-textoinput ng-pristine ng-invalid");
        dates[0].focus();
    });

    await page.keyboard.type(birthDate, {delay: 200});
    console.log('solving captcha');
    await page.solveRecaptchas()
    console.log('solved captcha');

    const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('history')),
        page.evaluate(() => {
            const button = document.getElementsByClassName("button-primario underline h-[48px] lg:h-[54px] text-base lg:text-[18px] mb-[60px] md:mb-16")[0];
            button.click();
        }),
    ]);
    const response2 = await page.waitForResponse(response => response.url().includes('history'));
    const citizenData = await response2.json();
    console.log(citizenData);
    await browser.close();
    return citizenData;
}

module.exports = {
    scrapper,
}
