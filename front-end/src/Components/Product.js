import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import "./Product.css";

const Product = ({ p }) => {
    const [selectedColor, setSelectedColor] = useState("yellow");

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={"full-" + i} color="#f6d5a8" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" color="#f6d5a8" />);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={"empty-" + i} color="#f6d5a8" />);
        }

        return stars;
    };

    return (
        <div className="product-container">
            <div className="img-container">
                <img src={p.images[selectedColor]} alt={p.name} className="product-img" />
            </div>
            <div className="product-info-contanier">
                <h3 className="product-title">{p.name}</h3>
                <p className="product-price">${p.price} USD</p>
                <ul className="product-colors-container">
                    <li>
                        <div className={`outer-circle ${selectedColor === "yellow" ? "selected" : "not-selected"}`}
                            onClick={() => setSelectedColor("yellow")}>
                            <div className="inner-circle yellow-gold"></div>
                        </div>
                    </li>
                    <li>
                        <div className={`outer-circle ${selectedColor === "white" ? "selected" : "not-selected"}`}
                            onClick={() => setSelectedColor("white")}>
                            <div className="inner-circle white-gold"></div>
                        </div>
                    </li>
                    <li>
                        <div className={`outer-circle ${selectedColor === "rose" ? "selected" : "not-selected"}`}
                            onClick={() => setSelectedColor("rose")}>
                            <div className="inner-circle rose-gold"></div>
                        </div>
                    </li>
                </ul>
                <p className="product-color-title">{selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} Gold</p>
                <div className="product-stars-container">
                    <div>{renderStars(p.score)}</div><p>{p.score}/5</p>
                </div>
            </div>
        </div>
    )
}

export default Product;