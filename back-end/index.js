require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Product = require("./db/Product");
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

let cachedGoldPrice = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 30;

const fetchGoldPrice = async () => {
    const now = Date.now();

    if (cachedGoldPrice && (now - lastFetchTime) < CACHE_DURATION) {
        return cachedGoldPrice;
    }

    try {
        const url = "https://www.goldapi.io/api/XAU/USD";
        const requestOptions = {
            method: 'GET',
            headers: {
                "x-access-token": process.env.GOLD_API_KEY,
                "Content-Type": "application/json"
            }
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        cachedGoldPrice = data.price;
        lastFetchTime = now;
        return cachedGoldPrice;
    } catch (err) {
        console.error("Error fetching gold price:", err);
        return cachedGoldPrice || null;
    }
};


app.get("/products", async (req, res) => {
    try {
        const goldPrice = await fetchGoldPrice();
        if (!goldPrice) return res.status(500).json({ error: "Could not fetch gold price" });

        const products = await Product.find();
        console.log("Products from DB:", products);

        const calculatedProducts = products.map(product => ({
            ...product._doc,
            price: ((product.popularityScore + 1) * product.weight * goldPrice).toFixed(2),
            score: (product.popularityScore * 5).toFixed(1),
        }));
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
        const minScore = parseFloat(req.query.minScore) || 0;
        const maxScore = parseFloat(req.query.maxScore) || 5;

        const filtered = calculatedProducts.filter(p =>
            parseFloat(p.price) >= minPrice &&
            parseFloat(p.price) <= maxPrice &&
            parseFloat(p.score) >= minScore &&
            parseFloat(p.score) <= maxScore
        );

        res.json(filtered);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching products" });
    }
});

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});