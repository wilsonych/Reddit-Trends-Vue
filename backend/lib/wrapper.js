const LOG = require("lib/log");

function timeMeasure(obj, method, api) {
    return {
        method: method.toUpperCase(),
        api: api,
        timeUsage:Object.keys(obj).map((key, index, array) => {
                    const difference = obj[key] - obj[array[index - 1]];
                    return { target: key, time: difference };
                })
                .slice(1)
    }
}

function wrapper(controller) {
    return async (req, res) => {
        const method = req.method.toLowerCase();

        if (!controller[method]) return res.status(405).end(`Method ${req.method.toUpperCase()} not support`);

        const endpoint = req.params.endpoint;

        let action;

        if (endpoint) {
            if (!controller[method][endpoint]) return res.status(405).end(`${req.url} not support`);
            action = controller[method][endpoint];
        } else {
            action = controller[method];
        }

        if (req.headers.timeusage) req.headers.timeusage.middleware = Date.now();

        action(req)
            .then((result) => {
                if(req.headers.timeusage) {
                    req.headers.timeusage.database = Date.now();
                    const time = timeMeasure(req.headers.timeusage,method,req.url)
                    result = {timeusage:time,data:result}
                }
                res.status(200).json(result)
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
                res.status(400).json({ message: err.toString() })
            })
    };
}

module.exports = wrapper;
