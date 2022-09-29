const {getApis, getApiByName} = require('@/utils/screenshotProviders');
const {getIp} = require('@/utils/getIp');
const rateLimit = require('express-rate-limit');

const rateLimitOptions = rateLimit({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    max: 15, // Limit each IP to 15 app requests per `window` (here, per 5 minutes)
    message: 'You are sending API requests too quickly, please try again in 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default async function screenshot(req, res) {
    if(req.method === 'POST'){
        if(!validateStr(req.body.url)){
            return res.status(400).json({
                message: 'You sent an invalid type of request, please provide a valid string for the URL',
                successful: false
            });
        }

        if(!validateStr(req.body.api)){
            return res.status(400).json({
                message: 'You sent an invalid type of request, please provide a valid string for the API option',
                successful: false
            });
        }

        if(!req.body.url.startsWith('https://')){
            return res.status(400).json({
                message: 'You sent an invalid type of request, please provide a valid URL for the search',
                successful: false
            });
        }
                
        const availableApis = getApis();
        if(!availableApis.includes(req.body.api)){
            return res.status(400).json({
                message: 'You sent an invalid type of request, the API option you sent is not a valid API option',
                successful: false
            });
        }
        const ip = getIp(req);
        req.ip = ip;
        try{ 
            await runRateLimitCheck(req, res, rateLimitOptions);
        }
        catch(e){
            return res.status(429).json({
                message: 'You are being rate limited, please wait for 5 minutes before retrying',
                successful: false
            });
        }
        try{
            const apiFunction = getApiByName(req.body.api);
            const imageBuffer = await apiFunction(req.body.url);   
            return res.send(JSON.stringify({
                message: '',
                successful: true,
                imageBuffer: imageBuffer
            }));
        }
        catch(e){
            return res.status(500).json({
                message: 'An error occurred while trying to get a screenshot. Please pick another API provider or contact an administrator for more.',
                successful: false
            });

        }
    }
    return res.status(400).json({
        message: 'You sent an invalid type of request, please send a POST request.',
        successful: false
    });
}

const validateStr = (value) => {
    return typeof value === 'string';
}

const runRateLimitCheck = (req, res, fn) =>  {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}