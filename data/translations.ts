import { Language } from '../types.ts';

type TranslationDict = {
    [key: string]: { [key in Language]: string };
};

export const translations: TranslationDict = {
    // Site meta
    'site_title_home': { he: 'NOVATRA | ריהוט תינוקות פרימיום Veres', en: 'NOVATRA | Premium Baby Furniture by Veres', ru: 'NOVATRA | Премиум детская мебель от Veres' },
    'site_description_home': { he: 'גלו את קולקציית ריהוטי התינוקות האיכותיים של Veres. מיטות, שידות, ארונות ועוד. עיצוב, בטיחות ואיכות לחדר הילדים המושלם.', en: 'Discover the collection of high-quality baby furniture by Veres. Cribs, dressers, wardrobes, and more. Design, safety, and quality for the perfect nursery.', ru: 'Откройте для себя коллекцию высококачественной детской мебели от Veres. Кроватки, комоды, шкафы и многое другое. Дизайн, безопасность и качество для идеальной детской комнаты.' },
    'site_description_category': { he: 'עיינו בקטגוריית {category} שלנו ב-NOVATRA. מגוון רחב של ריהוטי תינוקות איכותיים מבית Veres.', en: 'Browse our {category} category at NOVATRA. A wide range of quality baby furniture from Veres.', ru: 'Просмотрите нашу категорию {category} в NOVATRA. Широкий ассортимент качественной детской мебели от Veres.' },
    'site_description_about': { he: 'למדו על NOVATRA, היבואן הרשמי של ריהוטי התינוקות Veres בישראל. המחויבות שלנו לאיכות, בטיחות ועיצוב.', en: 'Learn about NOVATRA, the official importer of Veres baby furniture in Israel. Our commitment to quality, safety, and design.', ru: 'Узнайте о NOVATRA, официальном импортере детской мебели Veres в Израиле. Наша приверженность качеству, безопасности и дизайну.' },
    'site_description_contact': { he: 'צרו קשר עם צוות NOVATRA. אנחנו כאן כדי לענות על כל שאלה בנוגע למוצרי Veres, הזמנות ומשלוחים.', en: 'Contact the NOVATRA team. We are here to answer any questions about Veres products, orders, and shipping.', ru: 'Свяжитесь с командой NOVATRA. Мы здесь, чтобы ответить на любые вопросы о продуктах Veres, заказах и доставке.' },
    'site_description_wishlist': { he: 'רשימת המשאלות שלכם ב-NOVATRA. שמרו את הפריטים האהובים עליכם ותכננו את חדר התינוק המושלם.', en: 'Your wishlist at NOVATRA. Save your favorite items and plan the perfect nursery.', ru: 'Ваш список желаний в NOVATRA. Сохраняйте понравившиеся товары и планируйте идеальную детскую комнату.' },
    'site_description_checkout': { he: 'השלמת הזמנה ב-NOVATRA. תהליך תשלום מאובטח ומהיר לרכישת ריהוטי התינוקות שלכם.', en: 'Complete your order at NOVATRA. A secure and fast checkout process for your baby furniture purchase.', ru: 'Завершите ваш заказ в NOVATRA. Безопасный и быстрый процесс оформления покупки вашей детской мебели.' },

    // Navigation
    'nav_products': { he: 'מוצרים', en: 'Products', ru: 'Продукты' },
    'nav_about': { he: 'אודות', en: 'About Us', ru: 'О нас' },
    'nav_contact': { he: 'צור קשר', en: 'Contact', ru: 'Контакты' },
    'categories_title': { he: 'קטגוריות', en: 'Categories', ru: 'Категории' },

    // Header
    'free_shipping_banner': { he: '🚚 משלוח חינם בהזמנות מעל ₪1,000', en: '🚚 Free shipping on orders over ₪1,000', ru: '🚚 Бесплатная доставка при заказе от 1000₪' },

    // Hero
    'hero_title': { he: 'עיצוב, בטיחות ואיכות. חדר החלומות של תינוקך.', en: 'Design, Safety & Quality. Your Baby\'s Dream Room.', ru: 'Дизайн, безопасность и качество. Комната мечты вашего ребенка.' },
    'hero_subtitle': { he: 'קולקציית ריהוטי התינוקות של Veres עכשיו בישראל. כל מה שצריך כדי ליצור סביבה מושלמת לקטנטנים שלכם.', en: 'The Veres baby furniture collection is now in Israel. Everything you need to create the perfect environment for your little ones.', ru: 'Коллекция детской мебели Veres теперь в Израиле. Все, что нужно для создания идеальной обстановки для ваших малышей.' },
    'hero_button': { he: 'צפו בקולקציה', en: 'Explore Collection', ru: 'Смотреть коллекцию' },
    
    // Products
    'all_products': { he: 'כל המוצרים', en: 'All Products', ru: 'Все товары' },
    'out_of_stock': { he: 'אזל מהמלאי', en: 'Out of Stock', ru: 'Нет в наличии' },
    'in_stock': { he: 'במלאי', en: 'In Stock', ru: 'В наличии' },
    'add_to_cart': { he: 'הוספה לסל', en: 'Add to Cart', ru: 'Добавить в корзину' },
    'select_color': { he: 'בחירת צבע', en: 'Select Color', ru: 'Выберите цвет' },
    'add_accessories': { he: 'אביזרים נוספים:', en: 'Additional Accessories:', ru: 'Дополнительные аксессуары:' },
    'confirm_add_to_cart': { he: 'הוסף פריטים אלו לסל', en: 'Add these items to cart', ru: 'Добавить эти товары в корзину' },
    'total_price': { he: 'סה"כ', en: 'Total', ru: 'Итого' },
    'add_to_cart_cta': { he: 'הוספה לסל', en: 'Add to Cart', ru: 'Добавить в корзину' },
    'stock_urgency': { he: '⚠️ רק {stock} יחידות במלאי!', en: '⚠️ Only {stock} units left in stock!', ru: '⚠️ Осталось всего {stock} шт.!' },

    // Sorting
    'sort_default': { he: 'מיון ברירת מחדל', en: 'Default Sorting', ru: 'Сортировка по умолчанию' },
    'sort_price_asc': { he: 'מחיר: מהנמוך לגבוה', en: 'Price: Low to High', ru: 'Цена: по возрастанию' },
    'sort_price_desc': { he: 'מחיר: מהגבוה לנמוך', en: 'Price: High to Low', ru: 'Цена: по убыванию' },
    'sort_name_asc': { he: 'שם: א-ת', en: 'Name: A-Z', ru: 'Название: А-Я' },
    'sort_name_desc': { he: 'שם: ת-א', en: 'Name: Z-A', ru: 'Название: Я-А' },
    'sort_rating_desc': { he: 'דירוג: מהגבוה לנמוך', en: 'Rating: High to Low', ru: 'Рейтинг: по убыванию' },
    'sort_rating_asc': { he: 'דירוג: מהנמוך לגבוה', en: 'Rating: Low to High', ru: 'Рейтинг: по возрастанию' },
    'sort_model_asc': { he: 'דגם: א-ת', en: 'Model: A-Z', ru: 'Модель: А-Я' },
    'sort_model_desc': { he: 'דגם: ת-א', en: 'Model: Z-A', ru: 'Модель: Я-А' },


    // Filters
    'collection': { he: 'קולקציה', en: 'Collection', ru: 'Коллекция' },
    'color': { he: 'צבע', en: 'Color', ru: 'Цвет' },
    
    // Wishlist
    'wishlist_title': { he: 'רשימת המשאלות', en: 'Wishlist', ru: 'Список желаний' },
    'add_to_wishlist': { he: 'הוספה לרשימת המשאלות', en: 'Add to Wishlist', ru: 'Добавить в список желаний' },
    'remove_from_wishlist': { he: 'הסרה מרשימת המשאלות', en: 'Remove from Wishlist', ru: 'Удалить из списка желаний' },
    'wishlist_added_notification': { he: 'המוצר נוסף לרשימת המשאלות!', en: 'Product added to wishlist!', ru: 'Товар добавлен в список желаний!' },
    'wishlist_removed_notification': { he: 'המוצר הוסר מרשימת המשאלות.', en: 'Product removed from wishlist.', ru: 'Товар удален из списка желаний.' },
    'wishlist_empty': { he: 'רשימת המשאלות שלך ריקה כרגע.', en: 'Your wishlist is currently empty.', ru: 'Ваш список желаний пуст.' },
    'wishlist_explore': { he: 'גלו מוצרים', en: 'Explore Products', ru: 'Изучить товары' },

    // Cart
    'cart_added_notification': { he: 'המוצר נוסף לסל הקניות!', en: 'Product added to cart!', ru: 'Товар добавлен в корзину!' },

    // Checkout
    'checkout_title': { he: 'תשלום', en: 'Checkout', ru: 'Оформление заказа' },
    'order_summary': { he: 'סיכום הזמנה', en: 'Order Summary', ru: 'Итог заказа' },
    'subtotal': { he: 'סכום ביניים', en: 'Subtotal', ru: 'Подытог' },
    'discount': { he: 'הנחה', en: 'Discount', ru: 'Скидка' },
    'total': { he: 'סה"כ', en: 'Total', ru: 'Всего' },
    'coupon_code': { he: 'קוד קופון', en: 'Coupon Code', ru: 'Промокод' },
    'apply_coupon': { he: 'החל', en: 'Apply', ru: 'Применить' },
    'remove_coupon': { he: 'הסר', en: 'Remove', ru: 'Удалить' },
    'coupon_applied_success': { he: 'הקופון הופעל בהצלחה!', en: 'Coupon applied successfully!', ru: 'Промокод успешно применен!' },
    'coupon_removed_success': { he: 'הקופון הוסר.', en: 'Coupon removed.', ru: 'Промокод удален.' },
    'coupon_invalid': { he: 'קוד קופון לא חוקי.', en: 'Invalid coupon code.', ru: 'Неверный промокод.' },

    // Notifications
    'success': { he: 'הצלחה', en: 'Success', ru: 'Успешно' },
    'error': { he: 'שגיאה', en: 'Error', ru: 'Ошибка' },
    'info': { he: 'מידע', en: 'Info', ru: 'Информация' },

    // Trust Badges
    'safety_certified': { he: 'בטיחות מאושרת', en: 'Safety Certified', ru: 'Сертифицированная безопасность' },
    'eu_standard': { he: 'תקן אירופאי', en: 'EU Standard', ru: 'Европейский стандарт' },
    'israeli_standard': { he: 'תו תקן ישראלי', en: 'Israeli Standard', ru: 'Израильский стандарт' },
    'social_proof': { he: 'אלפי הורים מרוצים', en: 'Thousands of Happy Parents', ru: 'Тысячи довольных родителей' },
    'social_proof_text': { he: 'הצטרפו למשפחת Veres ותיהנו משקט נפשי', en: 'Join the Veres family and enjoy peace of mind', ru: 'Присоединяйтесь к семье Veres и наслаждайтесь спокойствием' },
    'whatsapp_support': { he: 'תמיכה בווטסאפ', en: 'WhatsApp Support', ru: 'Поддержка в WhatsApp' },
    'whatsapp_support_text': { he: 'שירות לקוחות אישי ומהיר לכל שאלה', en: 'Personal and fast customer service for any question', ru: 'Персональное и быстрое обслуживание клиентов по любому вопросу' },
    
    // Footer
    'footer_about': { he: 'אודותינו', en: 'About Us', ru: 'О нас' },
    'footer_contact': { he: 'צור קשר', en: 'Contact', ru: 'Контакты' },
    'footer_shipping': { he: 'משלוחים', en: 'Shipping', ru: 'Доставка' },
    'footer_returns': { he: 'החזרות', en: 'Returns', ru: 'Возвраты' },
    'footer_follow': { he: 'עקבו אחרינו', en: 'Follow Us', ru: 'Следите за нами' },
    'newsletter_title': { he: 'הצטרפו לניוזלטר שלנו', en: 'Join Our Newsletter', ru: 'Подпишитесь на нашу рассылку' },
    'newsletter_subtitle': { he: 'קבלו עדכונים, מבצעים והשראה ישר למייל שלכם', en: 'Get updates, promotions, and inspiration straight to your inbox', ru: 'Получайте обновления, акции и вдохновение прямо на вашу почту' },
    'newsletter_placeholder': { he: 'האימייל שלכם', en: 'Your Email', ru: 'Ваш Email' },
    'newsletter_button': { he: 'הרשמה', en: 'Subscribe', ru: 'Подписаться' },
    'newsletter_success': { he: 'תודה שנרשמת!', en: 'Thank you for subscribing!', ru: 'Спасибо за подписку!' },
    'newsletter_invalid_email': { he: 'אנא הזינו כתובת אימייל חוקית.', en: 'Please enter a valid email address.', ru: 'Пожалуйста, введите действительный адрес электронной почты.' },
    'footer_rights': { he: '© 2024 NOVATRA. כל הזכויות שמורות.', en: '© 2024 NOVATRA. All rights reserved.', ru: '© 2024 NOVATRA. Все права защищены.' },

    // Chat (Old)
    'chat_expert': { he: 'צ\'אט עם מומחה', en: 'Chat with an Expert', ru: 'Чат с экспертом' },
    'chat_placeholder': { he: 'כתבו את שאלתכם...', en: 'Type your question...', ru: 'Введите ваш вопрос...' },
    'chat_greeting': { he: 'שלום! אני העוזר הוירטואלי של NOVATRA. איך אני יכול לעזור לכם היום?', en: 'Hello! I\'m the virtual assistant for NOVATRA. How can I help you today?', ru: 'Здравствуйте! Я виртуальный помощник NOVATRA. Чем я могу вам помочь сегодня?' },
    
    // Rani - AI Shopping Assistant
    'rani_title': { he: '💬 Rani - עוזר הקניות', en: '💬 Rani - Shopping Assistant', ru: '💬 Рани - Помощник по покупкам' },
    'rani_placeholder': { he: 'שאלו על מוצרים, המלצות...', en: 'Ask about products, recommendations...', ru: 'Спросите о товарах, рекомендациях...' },
    'rani_tool_search': { he: 'מחפש מוצרים...', en: 'Searching for products...', ru: 'Ищу товары...' },
    'rani_tool_details': { he: 'מאחזר פרטי מוצר...', en: 'Getting product details...', ru: 'Получаю детали товара...' },
    'rani_tool_add_cart': { he: 'מוסיף לעגלה...', en: 'Adding to cart...', ru: 'Добавляю в корзину...' },
    'rani_tool_get_cart': { he: 'בודק את עגלת הקניות שלך...', en: 'Checking your cart...', ru: 'Проверяю вашу корзину...' },
    'rani_error': { he: 'מצטער, נתקלתי בשגיאה. אפשר לנסות שוב?', en: 'I\'m sorry, I encountered an error. Could you please try again?', ru: 'Извините, произошла ошибка. Не могли бы вы попробовать еще раз?' },

    // Breadcrumbs
    'breadcrumb_home': { he: 'דף הבית', en: 'Home', ru: 'Главная' },

    // Reviews
    'based_on_reviews': { he: 'מבוסס על {count} חוות דעת', en: 'Based on {count} reviews', ru: 'На основе {count} отзывов' },
    'no_reviews_yet': { he: 'אין עדיין חוות דעת', en: 'No reviews yet', ru: 'Отзывов пока нет' },
    'validation_required': { he: 'שדה חובה', en: 'This field is required', ru: 'Это поле обязательно' },
    'review_submitted_thanks': { he: 'תודה על חוות הדעת!', en: 'Thank you for your review!', ru: 'Спасибо за ваш отзыв!' },
    'reviews_title': { he: 'חוות דעת של לקוחות', en: 'Customer Reviews', ru: 'Отзывы клиентов' },
    'be_the_first_review': { he: 'עדיין אין חוות דעת. היו הראשונים לכתוב אחת!', en: 'There are no reviews yet. Be the first to write one!', ru: 'Отзывов пока нет. Будьте первым, кто его напишет!' },
    'review_form_title': { he: 'כתבו חוות דעת', en: 'Write a Review', ru: 'Написать отзыв' },
    'your_name': { he: 'השם שלכם', en: 'Your Name', ru: 'Ваше имя' },
    'review_title': { he: 'כותרת', en: 'Title', ru: 'Заголовок' },
    'your_review': { he: 'חוות הדעת שלכם', en: 'Your Review', ru: 'Ваш отзыв' },
    'submit_review': { he: 'שלח חוות דעת', en: 'Submit Review', ru: 'Отправить отзыв' },
    'summarize_reviews': { he: 'סכם חוות דעת עם AI ✨', en: 'Summarize Reviews with AI ✨', ru: 'Суммировать отзывы с помощью ИИ ✨' },
    'ai_summary_title': { he: 'סיכום חוות דעת (AI)', en: 'AI Review Summary', ru: 'Обзор отзывов (ИИ)' },
    'summary_pros': { he: 'יתרונות', en: 'Pros', ru: 'Плюсы' },
    'summary_cons': { he: 'חסרונות', en: 'Cons', ru: 'Минусы' },
    'summarizing_loading': { he: 'מסכם חוות דעת...', en: 'Summarizing reviews...', ru: 'Суммирование отзывов...' },
    'summary_error': { he: 'לא ניתן היה ליצור סיכום. אנא נסו שוב.', en: 'Could not generate summary. Please try again.', ru: 'Не удалось создать сводку. Пожалуйста, попробуйте еще раз.' },

    // About Page
    'about_page_title': { he: 'הסיפור שלנו', en: 'Our Story', ru: 'Наша история' },
    'about_intro_title': { he: 'ברוכים הבאים ל-NOVATRA', en: 'Welcome to NOVATRA', ru: 'Добро пожаловать в NOVATRA' },
    'about_intro_p1': { he: 'ב-NOVATRA, אנו מאמינים שלכל תינוק מגיעה התחלה בטוחה, נוחה ומעוצבת. לכן בחרנו להיות היבואן הרשמי של מותג ריהוטי התינוקות האירופאי המוביל - Veres. אנו מביאים לישראל את האיכות הבלתי מתפשרת, העיצוב המוקפד והבטיחות המחמירה שמאפיינים את Veres כבר עשרות שנים.', en: 'At NOVATRA, we believe every baby deserves a safe, comfortable, and stylish start. That\'s why we chose to be the official importer of the leading European baby furniture brand - Veres. We bring to Israel the uncompromising quality, meticulous design, and strict safety standards that have characterized Veres for decades.', ru: 'В NOVATRA мы верим, что каждый ребенок заслуживает безопасного, комфортного и стильного начала. Вот почему мы решили стать официальным импортером ведущего европейского бренда детской мебели - Veres. Мы привозим в Израиль бескомпромиссное качество, продуманный дизайн и строгие стандарты безопасности, которые характеризуют Veres на протяжении десятилетий.' },
    'about_veres_title': { he: 'למה Veres?', en: 'Why Veres?', ru: 'Почему Veres?' },
    'about_veres_p1': { he: 'Veres הוא מותג בעל שם עולמי, הידוע בשימוש בחומרים טבעיים וידידותיים לסביבה, טכנולוגיות ייצור מתקדמות ועמידה בתקני הבטיחות האירופאיים המחמירים ביותר (ISO 9001). כל מוצר מתוכנן בקפידה כדי לספק פונקציונליות מקסימלית ונוחות להורים ולתינוקות כאחד.', en: 'Veres is a world-renowned brand, known for using natural and environmentally friendly materials, advanced manufacturing technologies, and compliance with the strictest European safety standards (ISO 9001). Each product is carefully designed to provide maximum functionality and comfort for both parents and babies.', ru: 'Veres - всемирно известный бренд, известный использованием натуральных и экологически чистых материалов, передовыми технологиями производства и соответствием самым строгим европейским стандартам безопасности (ISO 9001). Каждый продукт тщательно разработан для обеспечения максимальной функциональности и комфорта как для родителей, так и для детей.' },
    'about_commitment_title': { he: 'המחויבות שלנו', en: 'Our Commitment', ru: 'Наши обязательства' },
    'about_commitment_p1': { he: 'המחויבות שלנו ב-NOVATRA היא להעניק לכם, ההורים, שקט נפשי. אנו מציעים שירות לקוחות אישי, ייעוץ מקצועי, והבטחה שאתם רוכשים את הטוב ביותר עבור היקרים לכם מכל. אנו מזמינים אתכם להצטרף למשפחת הלקוחות המרוצים שלנו וליצור יחד את חדר החלומות עבור תינוקכם.', en: 'Our commitment at NOVATRA is to give you, the parents, peace of mind. We offer personal customer service, professional advice, and the assurance that you are purchasing the best for your most precious ones. We invite you to join our family of satisfied customers and create the dream room for your baby together.', ru: 'Наше обязательство в NOVATRA - дать вам, родителям, душевное спокойствие. Мы предлагаем персональное обслуживание клиентов, профессиональные консультации и уверенность в том, что вы покупаете лучшее для своих самых дорогих. Мы приглашаем вас присоединиться к нашей семье довольных клиентов и вместе создать комнату мечты для вашего ребенка.' },
    
    // Contact Page
    'contact_page_title': { he: 'דברו איתנו', en: 'Contact Us', ru: 'Свяжитесь с нами' },
    'contact_intro': { he: 'יש לכם שאלה? צריכים ייעוץ? אנחנו כאן בשבילכם. מלאו את הטופס או השתמשו באחת הדרכים ליצירת קשר, ונחזור אליכם בהקדם.', en: 'Have a question? Need advice? We\'re here for you. Fill out the form or use one of the contact methods, and we\'ll get back to you soon.', ru: 'Есть вопрос? Нужен совет? Мы здесь для вас. Заполните форму или воспользуйтесь одним из способов связи, и мы скоро с вами свяжемся.' },
    'contact_info_title': { he: 'פרטי יצירת קשר', en: 'Contact Information', ru: 'Контактная информация' },
    'contact_email': { he: 'אימייל', en: 'Email', ru: 'Электронная почта' },
    'contact_form_title': { he: 'שלחו לנו הודעה', en: 'Send Us a Message', ru: 'Отправьте нам сообщение' },
    'contact_message': { he: 'ההודעה שלכם', en: 'Your Message', ru: 'Ваше сообщение' },
    'contact_send_button': { he: 'שלח הודעה', en: 'Send Message', ru: 'Отправить сообщение' },
    'contact_success_message': { he: 'ההודעה נשלחה בהצלחה! ניצור קשר בהקדם.', en: 'Message sent successfully! We will contact you soon.', ru: 'Сообщение успешно отправлено! Мы скоро с вами свяжемся.' },

    // Shipping Policy
    'shipping_policy_title': { he: 'מדיניות משלוחים', en: 'Shipping Policy', ru: 'Политика доставки' },
    'shipping_policy_p1': { he: 'אנו ב-NOVATRA עושים כל מאמץ לספק את הזמנתכם במהירות וביעילות האפשרית. אנו מציעים שירותי משלוח והרכבה מקצועיים לכל רחבי הארץ.', en: 'At NOVATRA, we make every effort to deliver your order as quickly and efficiently as possible. We offer professional delivery and assembly services throughout the country.', ru: 'В NOVATRA мы прилагаем все усилия, чтобы доставить ваш заказ как можно быстрее и эффективнее. Мы предлагаем профессиональные услуги по доставке и сборке по всей стране.' },
    'shipping_policy_zones_title': { he: 'אזורי שילוח ועלויות', en: 'Shipping Zones & Costs', ru: 'Зоны и стоимость доставки' },
    'shipping_policy_zones_p1': { he: 'המשלוחים מתבצעים באמצעות חברת שילוח חיצונית. עלויות המשלוח משתנות בהתאם לאזור:', en: 'Deliveries are made through an external shipping company. Shipping costs vary by region:', ru: 'Доставка осуществляется через внешнюю транспортную компанию. Стоимость доставки зависит от региона:' },
    'shipping_policy_zone1': { he: 'אזור המרכז (גדרה עד חדרה): 350₪', en: 'Central Region (Gedera to Hadera): ₪350', ru: 'Центральный регион (от Гедеры до Хадеры): 350₪' },
    'shipping_policy_zone2': { he: 'אזורים צפוניים ודרומיים: 450₪', en: 'Northern and Southern Regions: ₪450', ru: 'Северные и южные регионы: 450₪' },
    'shipping_policy_zone3': { he: 'אילת והערבה: 600₪', en: 'Eilat and Arava: ₪600', ru: 'Эйлат и Арава: 600₪' },
    'shipping_policy_times_title': { he: 'זמני אספקה', en: 'Delivery Times', ru: 'Сроки доставки' },
    'shipping_policy_times_p1': { he: 'זמן האספקה המשוער הוא עד 14 ימי עסקים מרגע אישור ההזמנה. נציג חברת השילוח ייצור עמכם קשר לתיאום מועד האספקה.', en: 'Estimated delivery time is up to 14 business days from order confirmation. A representative from the shipping company will contact you to coordinate a delivery date.', ru: 'Ориентировочное время доставки - до 14 рабочих дней с момента подтверждения заказа. Представитель транспортной компании свяжется с вами для согласования даты доставки.' },
    'shipping_policy_contact_title': { he: 'שאלות נוספות?', en: 'Further Questions?', ru: 'Дополнительные вопросы?' },
    'shipping_policy_contact_p1': { he: 'לכל שאלה בנוגע למשלוחים, אנא צרו קשר עם שירות הלקוחות שלנו.', en: 'For any questions regarding shipping, please contact our customer service.', ru: 'По любым вопросам, касающимся доставки, пожалуйста, свяжитесь с нашей службой поддержки клиентов.' },

    // Returns Policy
    'returns_policy_title': { he: 'מדיניות החזרות', en: 'Return Policy', ru: 'Политика возврата' },
    'returns_policy_p1': { he: 'אנו מקווים שאתם מרוצים מהרכישה שלכם. אם מסיבה כלשהי אינכם שבעי רצון, ניתן להחזיר מוצרים בהתאם למדיניות הבאה.', en: 'We hope you are satisfied with your purchase. If for any reason you are not satisfied, products can be returned according to the following policy.', ru: 'Мы надеемся, что вы довольны своей покупкой. Если по какой-либо причине вы не удовлетворены, товары можно вернуть в соответствии со следующей политикой.' },
    'returns_policy_conditions_title': { he: 'תנאים להחזרה', en: 'Conditions for Return', ru: 'Условия возврата' },
    'returns_policy_condition1': { he: 'ניתן להחזיר מוצר תוך 14 יום מיום קבלתו.', en: 'A product can be returned within 14 days of receipt.', ru: 'Товар можно вернуть в течение 14 дней с момента получения.' },
    'returns_policy_condition2': { he: 'המוצר חייב להיות באריזתו המקורית, ללא שימוש, ובמצב חדש לחלוטיн.', en: 'The product must be in its original packaging, unused, and in brand new condition.', ru: 'Товар должен быть в оригинальной упаковке, неиспользованным и в абсолютно новом состоянии.' },
    'returns_policy_condition3': { he: 'לא ניתן להחזיר מוצרים שהורכבו.', en: 'Assembled products cannot be returned.', ru: 'Собранные товары возврату не подлежат.' },
    'returns_policy_process_title': { he: 'תהליך ההחזרה', en: 'Return Process', ru: 'Процесс возврата' },
    'returns_policy_process_p1': { he: 'כדי ליזום החזרה, יש ליצור קשר עם שירות הלקוחות שלנו. עלות איסוף המוצר מבית הלקוח תחול על הלקוח.', en: 'To initiate a return, please contact our customer service. The cost of collecting the product from the customer\'s home will be borne by the customer.', ru: 'Для оформления возврата, пожалуйста, свяжитесь с нашей службой поддержки. Стоимость забора товара из дома клиента оплачивается клиентом.' },
    'returns_policy_refunds_title': { he: 'החזר כספי', en: 'Refunds', ru: 'Возврат средств' },
    'returns_policy_refunds_p1': { he: 'לאחר קבלת המוצר ובדיקתו, יבוצע החזר כספי לאמצעי התשלום המקורי, בניכוי 5% דמי ביטול ועלויות המשלוח.', en: 'Upon receipt and inspection of the product, a refund will be issued to the original payment method, minus a 5% cancellation fee and shipping costs.', ru: 'После получения и проверки товара, будет произведен возврат средств на первоначальный способ оплаты, за вычетом 5% комиссии за отмену и стоимости доставки.' },
};