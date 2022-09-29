const axios = require('axios');
const puppeteer = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');

/* Credits to https://gist.github.com/agungjk/ff542367470d156478f7381af2cf7e60 for a puppeteer work-around for Vercel */

const apis = {
    'internal': async (url) => {
        try{
            const browser = await puppeteer.launch(
            process.env.NODE_ENV === 'production'
                ? {
                    args: chrome.args,
                    executablePath: await chrome.executablePath,
                    headless: chrome.headless,
                }
                : {
                    executablePath: "/yourpath/to/chrome"
                }
            );
            const device_width = 1920;
            const device_height = 1080;
            const page = await browser.newPage();
            await page.setCacheEnabled(false);
            await page.setUserAgent('Mozilla / 5.0 (Windows NT 10.0; Win64; x64) AppleWebKit / 537.36 (KHTML, like Gecko) Chrome / 61.0.3163.100 Safari / 537.36');
            await page.setViewport({width: device_width, height: device_height})
            await page.goto(url);
            const imageBuffer = await page.screenshot({
                type: 'jpeg',
                quality: 100,
                omitBackground: true,
                clip: {
                    x: 0,
                    y: 0,
                    width: 1920,
                    height: 1080,
                  },
            });
            await page.close();
            await browser.close();
            return Buffer.from(imageBuffer, 'binary').toString('base64');;
        }
        catch(e){
            console.log(e);
            return null;
        }
    },

    'screenshotlayer.com': async (url) => {
        const screenshotApiLink = `https://api.screenshotlayer.com/api/capture?access_key=${process.env.SS_LAYER_ACCESS_KEY}&url=${url}&format=png`
        try{
            const apiStatus = await axios.get(screenshotApiLink, {})
            if(apiStatus.data){
                if(apiStatus.data.error){
                    if(apiStatus.data.error.type === 'rate_limit_reached'){
                        return null;
                    }
                }
            }
        }
        catch(e){
            console.log(e);
            return null;
        }
        try{
            const response = await axios.get(screenshotApiLink, {
                responseType: 'arraybuffer'
            })
            const base64Image = Buffer.from(response.data, 'binary').toString('base64');
            return base64Image;
        }
        catch(e){
            console.log(e);
            return null;
        }
    },
}

module.exports.getApiByName = (name) => {
    if(!apis[name]){
        return null;   
    }
    return apis[name];
}

module.exports.getApis = () => {
    return Object.keys(apis);
}