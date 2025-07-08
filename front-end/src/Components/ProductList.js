import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Product from "./Product";
import "./ProductList.css";
import next from "../assets/images/next.png";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isScrolling, setIsScrolling] = useState(false);
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        minScore: "",
        maxScore: ""
    });
    const [isFiltering, setIsFiltering] = useState(false);

    const scrollRef = useRef();

    const applyFilters = () => {
        const query = new URLSearchParams();

        if (filters.minPrice) query.append("minPrice", filters.minPrice);
        if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
        if (filters.minScore) query.append("minScore", filters.minScore);
        if (filters.maxScore) query.append("maxScore", filters.maxScore);

        axios
            .get(`${process.env.REACT_APP_API_URL}/products?${query.toString()}`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
        setIsFiltering(true);
    };

    const resetFilters = () => {
        setIsFiltering(false);
        setFilters({
            minPrice: "",
            maxPrice: "",
            minScore: "",
            maxScore: ""
        });

        axios
            .get(`${process.env.REACT_APP_API_URL}/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    };

    const handleScroll = (direction) => {
        if (isScrolling) return;

        const container = scrollRef.current;
        if (!container) return;

        const product = container.querySelector(".product-box");
        if (!product) return;

        const productWidth = product.offsetWidth;
        const computedStyle = getComputedStyle(container);
        const gap = parseFloat(computedStyle.columnGap || computedStyle.gap) || 0;

        const scrollAmount =
            direction === "right"
                ? productWidth + gap
                : -(productWidth + gap);

        setIsScrolling(true);

        container.scrollBy({ left: scrollAmount, behavior: "smooth" });

        setTimeout(() => {
            setIsScrolling(false);
        }, 400);
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);
    return (
        <span>
            <div className="filter-panel">
                <div className="filter-wrapper">
                    <input
                        className="filter-input"
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    -
                    <input
                        className="filter-input"
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                </div>
                <div className="filter-wrapper">
                    <input
                        className="filter-input"
                        type="number"
                        placeholder="Min Score"
                        value={filters.minScore}
                        onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                    />
                    -
                    <input
                        className="filter-input"
                        type="number"
                        placeholder="Max Score"
                        value={filters.maxScore}
                        onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
                    />
                </div>
                <div className="btn-wrapper">
                    {
                        isFiltering && <button className="btn reset" onClick={() => { resetFilters() }}>Reset</button>
                    }
                    <button className="btn filter" onClick={() => { applyFilters() }}>Filter</button>
                </div>
            </div>
            <div className="product-list-wrapper">
                <button className="scroll-btn left" onClick={() => handleScroll("left")} disabled={isScrolling}><img src={next} /></button>
                <ul className="products-parent" ref={scrollRef}>
                    {
                        products.map((p) => (
                            <li key={p._id} className="product-box">
                                <Product p={p} />
                            </li>
                        ))}
                </ul>
                <button className="scroll-btn right" onClick={() => handleScroll("right")} disabled={isScrolling}><img src={next} /></button>
            </div>
        </span>
    )
}

export default ProductList;