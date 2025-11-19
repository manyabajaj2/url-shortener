const express = require("express");
const cookieParser = require('cookie-parser');
const urlRoutes = require("./routes/url.js");
const { connectToMongoDB } = require("./connect.js");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/auth.js");

const path = require("path");

const staticRoute = require('./routes/staticRouter.js');
const URL = require("./models/url.js");
const userRoute = require("./routes/user.js")


const app = express();
const PORT = 3000;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("mongodb connected"))
    .catch((error) => console.log("error :", error));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use("/url", restrictToLoggedinUserOnly, urlRoutes);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);


app.get("/url/:generatedId", async (req, res) => {
    console.log("Received param:", req.params.generatedId);
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
    console.log(entry.requiredURL);

    res.redirect(entry.requiredURL)
})





app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));