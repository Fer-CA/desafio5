const serverLog = (req, res, next) => {
    console.log({
        path: req.path,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });
    next();
}

module.exports = { serverLog };
