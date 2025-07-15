import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import { useMediaQuery } from "@uidotdev/usehooks";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const isDesktopDevice = useMediaQuery("(min-width: 640px)");
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(!isDesktopDevice);
  const [category, setCategory] = useState([]);
  const [material, setMaterial] = useState([]);
  const [sex, setSex] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Инициализируем filterProducts с видимыми товарами
  const [filterProducts, setFilterProducts] = useState(
    products.filter(item => item.is_visible == 1)
  );

  useEffect(() => {
    setShowFilter(isDesktopDevice);
  }, [isDesktopDevice]);

  // Обновляем filterProducts при изменении products из контекста
  useEffect(() => {
    setFilterProducts(products.filter(item => item.is_visible == 1));
  }, [products]);

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const productItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  const embeddedCategories = [
    { id: "1", name: "Кольца" },
    { id: "2", name: "Серьги" },
    { id: "3", name: "Подвески" },
    { id: "4", name: "Браслеты" },
    { id: "5", name: "Цепи" }
  ];

  const embeddedMaterials = [
    { id: "1", name: "Серебро" },
    { id: "2", name: "Золото" },
    { id: "3", name: "Платина" },
    { id: "4", name: "Титан" },
    { id: "5", name: "Сталь" }
  ];

  const embeddedSex = [
    { id: "1", name: "Для женщин" },
    { id: "2", name: "Для мужчин" },
    { id: "3", name: "Для детей" }
  ];

  const categories = embeddedCategories.map(item => item.name);
  const materials = embeddedMaterials.map(item => item.name);
  const sexValues = embeddedSex.map(item => item.name);

  const toggleCategory = (event) => {
    const value = event.target.value;
    setCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const toggleMaterial = (event) => {
    const value = event.target.value;
    setMaterial(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const toggleSex = (event) => {
    const value = event.target.value;
    setSex(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productsCopy = products.filter(item => item.is_visible == 1);

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (material.length > 0) {
      productsCopy = productsCopy.filter(item => material.includes(item.material));
    }

    if (sex.length > 0) {
      productsCopy = productsCopy.filter(item => sex.includes(item.sex));
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let filterProductCopy = [...filterProducts];

    switch (sortType) {
      case "low-high":
        filterProductCopy.sort((a, b) => (a.price - b.price));
        break;
      case "high-low":
        filterProductCopy.sort((a, b) => (b.price - a.price));
        break;
      default:
        break;
    }

    setFilterProducts(filterProductCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, material, sex, search, showSearch]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const StyledCheckbox = ({ value, checked, onChange, label }) => (
    <motion.label
      className="flex items-center gap-3 cursor-pointer group select-none"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          value={value}
          checked={checked}
          onChange={onChange}
          className="absolute opacity-0 h-0 w-0"
        />
        <motion.div
          className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors duration-200
            ${checked ? 'bg-black border-black' : 'border-gray-400 group-hover:border-gray-600'}`}
          initial={false}
          animate={{
            scale: checked ? [1, 0.9, 1.1, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {checked && (
            <motion.svg
              className="w-3 h-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          )}
        </motion.div>
      </div>
      <span className={`text-sm font-light transition-colors duration-200
        ${checked ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
        {label}
      </span>
    </motion.label>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t"
    >
      <div className="min-w-60">
        <motion.p
          className="my-2 text-xl flex items-center cursor-pointer gap-2 select-none"
          onClick={() => setShowFilter(!showFilter)}
          whileTap={{ scale: 0.95 }}
        >
          ФИЛЬТРЫ
          <motion.img
            className={`h-3 sm:hidden`}
            src={assets.dropdown_icon}
            alt="Dropdown Icon"
            animate={{ rotate: showFilter ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.p>
        <AnimatePresence>
          {showFilter && (
            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="sm:block"
            >
              <div className="border border-gray-200 rounded-lg pl-5 py-3 mt-6 bg-white shadow-sm">
                <p className="mb-3 text-sm font-medium text-gray-800">КАТЕГОРИЯ</p>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <StyledCheckbox
                      key={cat}
                      value={cat}
                      checked={category.includes(cat)}
                      onChange={toggleCategory}
                      label={cat}
                    />
                  ))}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg pl-5 py-3 my-5 bg-white shadow-sm">
                <p className="mb-3 text-sm font-medium text-gray-800">МЕТАЛЛ</p>
                <div className="flex flex-col gap-3">
                  {materials.map((mat) => (
                    <StyledCheckbox
                      key={mat}
                      value={mat}
                      checked={material.includes(mat)}
                      onChange={toggleMaterial}
                      label={mat}
                    />
                  ))}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg pl-5 py-3 my-5 bg-white shadow-sm">
                <p className="mb-3 text-sm font-medium text-gray-800">ПОЛ</p>
                <div className="flex flex-col gap-3">
                  {sexValues.map((sexVal) => (
                    <StyledCheckbox
                      key={sexVal}
                      value={sexVal}
                      checked={sex.includes(sexVal)}
                      onChange={toggleSex}
                      label={sexVal}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex-1">
        <motion.div
          className="flex justify-between gap-4 text-base sm:text-2xl mb-4 sm:flex-col md:flex-row"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Title text1={"ВСЕ"} text2={"КОЛЛЕКЦИИ"} />
          <motion.select
            className="w-full sm:w-auto h-11 border-2 border-gray-300 text-sm px-2 rounded-md focus:outline-none focus:border-black transition-colors"
            onChange={(event) => setSortType(event.target.value)}
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02, borderColor: "#000" }}
          >
            <option value="relevant">По популярности</option>
            <option value="low-high">По возрастанию цены</option>
            <option value="high-low">По убыванию цены</option>
          </motion.select>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6"
          layout
        >
          <AnimatePresence>
            {filterProducts.map((item, index) => (
              <motion.div
                key={item.uuid}
                variants={productItemVariants}
                initial="hidden"
                animate="visible"
                custom={index % 12}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <ProductItem
                  id={item.uuid}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
};

export default Collection;