


module.exports = setHeaders = async (req, res, next) => {

    res.setHeader('Content-Type', 'application/json')
        .setHeader('Accept', 'application/json')
        .setHeader('X-Powered-By', 'Bharat Batuk Limited')
        .setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    next();
}