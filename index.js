const express = require("express");
const urlRoutes = require("./routes/url.js");
const { connectToMongoDB } = require("./connect.js")
const URL = require("./models/url.js");


const app = express();
const PORT = 3000;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("mongodb connected"))
    .catch((error) => console.log("error :", error));

app.use(express.json());

app.get("/:generatedId", async (req, res) => {
    const generatedId = req.params.generatedId;
    const entry = await URL.findOneAndUpdate({
        shortId: generatedId
    }, {
        $push: {
            visitHistory: {
                timestamps: Date.now(),
            },

        },
    },);

    if (!entry) {
        return res.status(404).send("Not found")
    }

    res.redirect(entry.requiredURL)
})


app.use("/url", urlRoutes)


app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));