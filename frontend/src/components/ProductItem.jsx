import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const images = JSON.parse(image);

  const getStringPrice = (price) => {
    let priceString = price.toLocaleString("ru-RU", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 2 });
    priceString = priceString.replace(",", ".");

    if (price % 1 !== 0) {
      priceString = priceString.replace(/(\d)(?=(\d{3})+\.)/g, "$1 ");
    } else {
      priceString = priceString.replace(/(\d)(?=(\d{3})+\b)/g, "$1 ");
    }
    return priceString;
  };

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img className="hover:scale-110 transition ease-in-out" src={images[0]} alt="Product Image" />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">{getStringPrice(price)} {currency}</p>
    </Link>
  )
};

export default ProductItem;