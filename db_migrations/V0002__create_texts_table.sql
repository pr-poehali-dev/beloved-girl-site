CREATE TABLE IF NOT EXISTS t_p9288329_beloved_girl_site.texts (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO t_p9288329_beloved_girl_site.texts (key, value) VALUES
('hero_title', 'Моей единственной'),
('hero_subtitle', 'Этот сайт создан специально для тебя'),
('wishes_1_title', 'Моя любовь'),
('wishes_1_text', 'Ты — самое дорогое, что есть в моей жизни. Каждый день с тобой — это подарок.'),
('wishes_2_title', 'Моя мечта'),
('wishes_2_text', 'Мечтаю о том, чтобы мы всегда были вместе, преодолевая любые препятствия рука об руку.'),
('wishes_3_title', 'Наше будущее'),
('wishes_3_text', 'Впереди нас ждёт столько прекрасных моментов: путешествия, дом нашей мечты и вечера у камина.'),
('future_title', 'Наши планы на будущее'),
('future_1_title', 'Наш дом'),
('future_1_text', 'Мечтаю о доме, где каждое утро мы будем просыпаться вместе, а вечера проводить у камина.'),
('future_2_title', 'Путешествия'),
('future_2_text', 'Хочу показать тебе весь мир: от романтичного Парижа до тёплых пляжей Бали.'),
('future_3_title', 'Вместе навсегда'),
('future_3_text', 'Главное — это быть рядом с тобой каждый день, радоваться мелочам и поддерживать друг друга.'),
('footer_title', 'С любовью, только для тебя'),
('footer_subtitle', 'Каждый день — это новая страница нашей истории')
ON CONFLICT (key) DO NOTHING;