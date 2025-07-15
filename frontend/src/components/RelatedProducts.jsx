import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { useNavigate } from "react-router-dom";

const RelatedProducts = ({ category, subCategory, sex }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();

            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.material);
            productsCopy = productsCopy.filter((item) => sex === item.sex);
            setRelated(productsCopy.slice(0, 5));
        }
    }, [products]);

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1={"ПОХОЖИЕ"} text2={"КОЛЛЕКЦИИ"} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {
                    related.map((item, index) => (
                        <div key={index} onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            navigate(`/product/${item.uuid}`);
                        }}>
                            <ProductItem key={index} id={item.uuid} image={item.image} name={item.name} price={item.price} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
};

export default RelatedProducts;