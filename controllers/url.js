const shortId = require("shortid");

const URL = require("../models/url")


async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" })
    const generatedId = shortId.generate()
    await URL.create({
        shortId: generatedId,
        requiredURL: body.url,
        visitHistory: [],
    });

    return res.render('home', {
        id: generatedId,
    });

}

module.exports = {
    handleGenerateNewShortURL,
};