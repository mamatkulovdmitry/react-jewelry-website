import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    let productsCopy = products.filter(item => item.is_visible == 1);
    setLatestProducts(productsCopy.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"ПОСЛЕДНИЕ"} text2={"КОЛЛЕКЦИИ"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Последние коллекции — это союз роскоши и элегантности. Украшения, созданные,
          чтобы подчеркнуть ваш стиль и оставить след в вашей истории.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {
          latestProducts.map((item, index) => (
            <ProductItem key={index} id={item.uuid} image={item.image} name={item.name} price={item.price} />
          ))
        }
      </div>
    </div>
  )
};

export default LatestCollection;