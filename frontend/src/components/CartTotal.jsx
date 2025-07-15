import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

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
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"СУММА"} text2={"КОРЗИНЫ"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Товары на сумму</p>
          <p>{getStringPrice(getCartAmount())} {currency}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Стоимость доставки</p>
          <p>{getStringPrice(delivery_fee)} {currency}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Итого</b>
          <b>{getCartAmount() === 0 ? 0 : getStringPrice(getCartAmount() + delivery_fee)} {currency}</b>
        </div>
      </div>
    </div>
  )
};

export default CartTotal;