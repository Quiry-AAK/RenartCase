require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Product = require("./db/Product");
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const fetchGoldPrice = async () => {
    const url = "https://www.goldapi.io/api/XAU/USD";

    const requestOptions = {
        method: 'GET',
        headers: {
            "x-access-token": process.env.GOLD_API_KEY,
            "Content-Type": "application/json"
        }
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        return data.price;
    } catch (err) {
        console.error("Error fetching gold price:", err);
        return null;
    }
};


app.get("/products", async (req, res) => {
    try {
        const goldPrice = await fetchGoldPrice();
        if (!goldPrice) return res.status(500).json({ error: "Could not fetch gold price" });

        const products = await Product.find();

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});