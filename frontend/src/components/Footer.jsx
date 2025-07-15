import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

import { FiTruck, FiCreditCard, FiShield, FiX } from "react-icons/fi";

const Footer = () => {
    const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
    const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed p-4 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                    <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    const DeliveryPaymentModal = () => (
        <Modal
            isOpen={deliveryModalOpen}
            onClose={() => setDeliveryModalOpen(false)}
            title="Доставка и оплата"
        >
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <FiTruck size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Варианты доставки</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 min-w-2 min-h-2 max-w-2 max-h-2 rounded-full bg-blue-500"></span>
                                <span>Курьерская доставка - 300 ₽ (1-2 дня)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 min-w-2 min-h-2 max-w-2 max-h-2 rounded-full bg-blue-500"></span>
                                <span>Самовывоз из магазина - бесплатно</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <FiCreditCard size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Способы оплаты</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 min-w-2 min-h-2 max-w-2 max-h-2 rounded-full bg-green-500"></span>
                                <span>Банковской картой онлайн</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 min-w-2 min-h-2 max-w-2 max-h-2 rounded-full bg-green-500"></span>
                                <span>Наличными при получении</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Modal>
    );

    const PrivacyPolicyModal = () => (
        <Modal
            isOpen={privacyModalOpen}
            onClose={() => setPrivacyModalOpen(false)}
            title="Политика конфиденциальности"
        >
            <div className="space-y-6 text-gray-600">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <FiShield size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Сбор информации</h4>
                        <p>
                            Мы собираем только необходимую информацию для обработки вашего заказа: имя, контактные данные, адрес доставки.
                            Ваши платежные данные обрабатываются платежной системой и не сохраняются на наших серверах.
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Использование данных</h4>
                    <p>
                        Ваши персональные данные используются исключительно для обработки заказов, улучшения качества обслуживания
                        и информирования вас о статусе заказа. Мы не передаем ваши данные третьим лицам, за исключением случаев,
                        предусмотренных законодательством.
                    </p>
                </div>

                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Безопасность</h4>
                    <p>
                        Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа,
                        изменения, раскрытия или уничтожения. Сайт использует SSL-шифрование для защиты передачи данных.
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm">
                        Последнее обновление: 01 января 2025 года. По всем вопросам обращайтесь на info@uvelir.com
                    </p>
                </div>
            </div>
        </Modal>
    );

    return (
        <div>
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                <div>
                    <img className="mb-5 w-32 sm:w-36 max-h-10" src={assets.logo} alt="Logo" />
                    <p className="w-full md:w-2/3 text-gray-600">
                        "Центр Ювелир" — это место, где изысканный стиль и мастерство ювелирного
                        искусства объединяются, чтобы создать для вас уникальные украшения.
                        Мы предлагаем только высококачественные изделия из драгоценных металлов
                        и камней, чтобы подчеркнуть вашу индивидуальность. Будьте уверены в безупречности
                        каждого украшения — ваша красота и удовлетворение для нас превыше всего.
                    </p>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">КОМПАНИЯ</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <Link to="/"><li>Главная</li></Link>
                        <Link to="/about"><li>О нас</li></Link>
                        <li className="cursor-pointer" onClick={() => setDeliveryModalOpen(true)}>Доставка и оплата</li>
                        <li className="cursor-pointer" onClick={() => setPrivacyModalOpen(true)}>Политика конфиденциальности</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">КОНТАКТЫ</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li><a href="tel:+79126017918">+7 (912) 601-79-18</a></li>
                        <li><a href="mailto:info@uvelir.com">info@uvelir.com</a></li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className="py-5 text-sm text-center">&copy; Центр Ювелир 2025 - Все права защищены.</p>
            </div>
            <DeliveryPaymentModal />
            <PrivacyPolicyModal />
        </div>
    )
};

export default Footer;