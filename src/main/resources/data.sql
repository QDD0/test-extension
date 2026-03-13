-- 5 тестов с разным временем выполнения
INSERT INTO test (title, description, duration_minutes, created_by, created_at)
VALUES ('Английский язык - Уровень Intermediate',
        'Тест на знание английского языка среднего уровня (B1-B2). Включает грамматику, лексику и понимание текста.',
        25, 1, NOW()),
       ('Основы SQL', 'Тест на знание базовых запросов SQL, JOIN-ов, агрегатных функций и нормализации баз данных.', 20,
        1, NOW()),
       ('Java Core', 'Проверка знаний основ Java: ООП, коллекции, исключения, многопоточность.', 25, 1, NOW()),
       ('Математика и логика', 'Тест на математические способности и логическое мышление. Включает задачи и примеры.',
        15, 1, NOW()),
       ('История искусств', 'Тест по истории мирового искусства: художники, стили, известные произведения.', 20, 1,
        NOW());

-- Вопросы для теста "Английский язык" (id_test = 1)
INSERT INTO question (id_test, question_text, type_question, points)
VALUES (1, 'Выберите правильную форму глагола: She _____ to music right now.', 'SINGLE', 1),
       (1, 'Какие из этих слов являются синонимами к "happy"?', 'MULTIPLE', 2),
       (1, 'Переведите на английский: "Я никогда не был в Лондоне".', 'TEXT', 3),
       (1, 'Выберите правильный артикль: _____ elephant is a large animal.', 'SINGLE', 1),
       (1, 'Какие из этих неправильных глаголов имеют одинаковые формы для всех трех форм?', 'MULTIPLE', 2),
       (1, 'Напишите антоним к слову "generous".', 'TEXT', 2),
       (1, 'Выберите правильный предлог: I''m interested _____ learning Spanish.', 'SINGLE', 1),
       (1, 'Какие из этих слов являются исчисляемыми существительными?', 'MULTIPLE', 2),
       (1, 'Составьте предложение в Present Perfect: (I / finish / homework).', 'TEXT', 2),
       (1, 'Выберите правильную степень сравнения: This is _____ film I''ve ever seen.', 'SINGLE', 1),
       (1, 'Какие из этих фраз являются идиомами?', 'MULTIPLE', 2),
       (1, 'Напишите форму множественного числа слова "child".', 'TEXT', 1),
       (1, 'Выберите правильное местоимение: _____ car is parked outside.', 'SINGLE', 1),
       (1, 'Какие из этих слов являются наречиями?', 'MULTIPLE', 2),
       (1, 'Переведите: "Она выглядит уставшей".', 'TEXT', 2),
       (1, 'Выберите правильный союз: I''ll call you _____ I arrive.', 'SINGLE', 1),
       (1, 'Какие из этих предложений в Passive Voice?', 'MULTIPLE', 2),
       (1, 'Напишите три формы глагола "go".', 'TEXT', 2),
       (1, 'Выберите правильный модальный глагол: You _____ smoke here, it''s forbidden.', 'SINGLE', 1),
       (1, 'Какие из этих слов являются прилагательными?', 'MULTIPLE', 2);

-- Вопросы для теста "Основы SQL" (id_test = 2)
INSERT INTO question (id_test, question_text, type_question, points)
VALUES (2, 'Какой SQL-оператор используется для извлечения данных из базы?', 'SINGLE', 1),
       (2, 'Какие из этих команд относятся к DDL (Data Definition Language)?', 'MULTIPLE', 2),
       (2, 'Напишите SQL-запрос для выборки всех пользователей старше 18 лет из таблицы "users".', 'TEXT', 3),
       (2, 'Что делает оператор JOIN?', 'SINGLE', 1),
       (2, 'Какие типы JOIN существуют в SQL?', 'MULTIPLE', 2),
       (2, 'Напишите запрос для подсчета количества записей в таблице "orders".', 'TEXT', 2),
       (2, 'Что означает аббревиатура ACID?', 'SINGLE', 1),
       (2, 'Какие из этих функций являются агрегатными?', 'MULTIPLE', 2),
       (2, 'Напишите запрос для добавления нового столбца "phone" в таблицу "clients".', 'TEXT', 3),
       (2, 'Что такое первичный ключ (PRIMARY KEY)?', 'SINGLE', 1),
       (2, 'Какие ограничения (CONSTRAINTS) можно использовать в SQL?', 'MULTIPLE', 2),
       (2, 'Напишите запрос для обновления email пользователя с id=5.', 'TEXT', 2),
       (2, 'Что делает оператор GROUP BY?', 'SINGLE', 1),
       (2, 'Какие из этих операторов используются для фильтрации?', 'MULTIPLE', 2),
       (2, 'Напишите запрос для удаления всех записей из таблицы "logs", которые старше 2023 года.', 'TEXT', 2),
       (2, 'Что такое внешний ключ (FOREIGN KEY)?', 'SINGLE', 1),
       (2, 'Какие из этих типов данных существуют в PostgreSQL?', 'MULTIPLE', 2),
       (2, 'Напишите запрос для создания индекса на поле "email" таблицы "users".', 'TEXT', 2),
       (2, 'Что делает оператор HAVING?', 'SINGLE', 1),
       (2, 'Какие из этих утверждений о NULL верны?', 'MULTIPLE', 2);

-- Вопросы для теста "Java Core" (id_test = 3)
INSERT INTO question (id_test, question_text, type_question, points)
VALUES (3, 'Какие принципы ООП существуют в Java?', 'MULTIPLE', 2),
       (3, 'Что такое JVM?', 'SINGLE', 1),
       (3, 'Напишите сигнатуру метода main в Java.', 'TEXT', 2),
       (3, 'Какие из этих коллекций реализуют интерфейс List?', 'MULTIPLE', 2),
       (3, 'Что означает ключевое слово "final" для класса?', 'SINGLE', 1),
       (3, 'Какие из этих исключений являются проверяемыми (checked)?', 'MULTIPLE', 2),
       (3, 'Напишите код создания ArrayList и добавления в него 3 элементов.', 'TEXT', 3),
       (3, 'Что такое перегрузка методов (overloading)?', 'SINGLE', 1),
       (3, 'Какие модификаторы доступа существуют в Java?', 'MULTIPLE', 2),
       (3, 'Напишите конструктор класса Person с полями name и age.', 'TEXT', 2),
       (3, 'Что такое интерфейс в Java?', 'SINGLE', 1),
       (3, 'Какие из этих утверждений о String правильны?', 'MULTIPLE', 2),
       (3, 'Напишите код try-catch-finally для обработки исключения.', 'TEXT', 3),
       (3, 'Что такое полиморфизм?', 'SINGLE', 1),
       (3, 'Какие из этих классов являются обертками (wrappers)?', 'MULTIPLE', 2),
       (3, 'Напишите код для создания HashMap и добавления пары ключ-значение.', 'TEXT', 2),
       (3, 'Что делает метод equals()?', 'SINGLE', 1),
       (3, 'Какие из этих операторов используются для работы с потоками?', 'MULTIPLE', 2),
       (3, 'Напишите код создания и запуска потока через Runnable.', 'TEXT', 3),
       (3, 'Что такое абстрактный класс?', 'SINGLE', 1);

-- Вопросы для теста "Математика и логика" (id_test = 4)
INSERT INTO question (id_test, question_text, type_question, points)
VALUES (4, 'Сколько будет 15 × 7?', 'SINGLE', 1),
       (4, 'Какие из этих чисел являются простыми?', 'MULTIPLE', 2),
       (4, 'Решите уравнение: 2x + 5 = 15. Введите ответ.', 'TEXT', 2),
       (4, 'Чему равен квадратный корень из 144?', 'SINGLE', 1),
       (4, 'Какие из этих дробей эквивалентны 1/2?', 'MULTIPLE', 2),
       (4, 'Вычислите: 25% от 200.', 'TEXT', 1),
       (4, 'Что больше: 0.8 или 3/4?', 'SINGLE', 1),
       (4, 'Какие из этих утверждений логически верны?', 'MULTIPLE', 2),
       (4, 'Найдите следующее число в последовательности: 2, 4, 8, 16, ...', 'TEXT', 2),
       (4, 'Чему равен sin(90°)?', 'SINGLE', 1),
       (4, 'Какие из этих фигур являются четырехугольниками?', 'MULTIPLE', 2),
       (4, 'Вычислите площадь прямоугольника со сторонами 5 и 8 см.', 'TEXT', 2),
       (4, 'Сколько градусов в прямом угле?', 'SINGLE', 1),
       (4, 'Какие из этих чисел делятся на 3?', 'MULTIPLE', 2),
       (4, 'Решите: (8 + 2) × 3', 'TEXT', 1),
       (4, 'Что такое простое число?', 'SINGLE', 1),
       (4, 'Какие из этих операций имеют приоритет в математике?', 'MULTIPLE', 2),
       (4, 'Вычислите среднее арифметическое: 5, 7, 9, 11', 'TEXT', 2),
       (4, 'Чему равен объем куба со стороной 3 см?', 'SINGLE', 1),
       (4, 'Какие из этих утверждений о треугольнике верны?', 'MULTIPLE', 2);

-- Вопросы для теста "История искусств" (id_test = 5)
INSERT INTO question (id_test, question_text, type_question, points)
VALUES (5, 'Кто написал "Мону Лизу"?', 'SINGLE', 1),
       (5, 'Какие из этих художников относятся к эпохе Возрождения?', 'MULTIPLE', 2),
       (5, 'В каком стиле рисовал Ван Гог?', 'TEXT', 2),
       (5, 'Где находится Лувр?', 'SINGLE', 1),
       (5, 'Какие из этих картин принадлежат кисти Сальвадора Дали?', 'MULTIPLE', 2),
       (5, 'Назовите автора скульптуры "Давид".', 'TEXT', 2),
       (5, 'К какому направлению относится кубизм?', 'SINGLE', 1),
       (5, 'Какие из этих музеев находятся в России?', 'MULTIPLE', 2),
       (5, 'Кто написал "Черный квадрат"?', 'TEXT', 2),
       (5, 'В каком стиле построен собор Святого Петра в Риме?', 'SINGLE', 1),
       (5, 'Какие из этих художников были импрессионистами?', 'MULTIPLE', 2),
       (5, 'Где родился Микеланджело?', 'TEXT', 2),
       (5, 'Что такое фреска?', 'SINGLE', 1),
       (5, 'Какие из этих картин написал Рембрандт?', 'MULTIPLE', 2),
       (5, 'Кто создал скульптуру "Мыслитель"?', 'TEXT', 2),
       (5, 'К какому веку относится творчество Леонардо да Винчи?', 'SINGLE', 1),
       (5, 'Какие из этих стилей относятся к архитектуре?', 'MULTIPLE', 2),
       (5, 'Назовите самого известного художника-сюрреалиста.', 'TEXT', 2),
       (5, 'Что такое "барокко"?', 'SINGLE', 1),
       (5, 'Какие из этих картин находятся в Эрмитаже?', 'MULTIPLE', 2);

-- Варианты ответов для вопросов типа SINGLE и MULTIPLE

-- Ответы для теста 1 (Английский)
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (1, 'is listening', true),
       (1, 'listening', false),
       (1, 'listens', false),
       (1, 'are listening', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (2, 'joyful', true),
       (2, 'sad', false),
       (2, 'cheerful', true),
       (2, 'glad', true),
       (2, 'angry', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (4, 'a', false),
       (4, 'an', true),
       (4, 'the', false),
       (4, 'no article', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (5, 'cut-cut-cut', true),
       (5, 'go-went-gone', false),
       (5, 'put-put-put', true),
       (5, 'read-read-read', true),
       (5, 'see-saw-seen', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (7, 'in', false),
       (7, 'on', false),
       (7, 'at', false),
       (7, 'for', false),
       (7, 'about', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (8, 'book', true),
       (8, 'water', false),
       (8, 'car', true),
       (8, 'rice', false),
       (8, 'apple', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (10, 'more interesting', false),
       (10, 'most interesting', true),
       (10, 'the most interesting', false),
       (10, 'interestingest', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (11, 'It''s raining cats and dogs', true),
       (11, 'I have a book', false),
       (11, 'Break a leg', true),
       (11, 'She is happy', false),
       (11, 'Piece of cake', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (13, 'My', true),
       (13, 'Mine', false),
       (13, 'Me', false),
       (13, 'I', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (14, 'quickly', true),
       (14, 'beautiful', false),
       (14, 'very', true),
       (14, 'house', false),
       (14, 'loudly', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (16, 'if', false),
       (16, 'when', true),
       (16, 'because', false),
       (16, 'while', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (17, 'The house was built', true),
       (17, 'She reads a book', false),
       (17, 'The letter is written', true),
       (17, 'They are playing', false),
       (17, 'The cake was eaten', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (19, 'must not', true),
       (19, 'can not', true),
       (19, 'should not', false),
       (19, 'have not', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (20, 'beautiful', true),
       (20, 'happily', false),
       (20, 'fast', true),
       (20, 'run', false),
       (20, 'wonderful', true);

-- Ответы для теста 2 (SQL)
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (21, 'SELECT', true),
       (21, 'INSERT', false),
       (21, 'UPDATE', false),
       (21, 'DELETE', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (22, 'CREATE', true),
       (22, 'ALTER', true),
       (22, 'SELECT', false),
       (22, 'DROP', true),
       (22, 'INSERT', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (24, 'Объединяет строки из двух таблиц', true),
       (24, 'Удаляет данные', false),
       (24, 'Создает новую таблицу', false),
       (24, 'Обновляет записи', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (25, 'INNER JOIN', true),
       (25, 'LEFT JOIN', true),
       (25, 'RIGHT JOIN', true),
       (25, 'FULL JOIN', true),
       (25, 'OUTER JOIN', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (27, 'Атомарность, Согласованность, Изоляция, Долговечность', true),
       (27, 'Ассоциация, Композиция, Инкапсуляция', false),
       (27, 'Создание, Чтение, Обновление, Удаление', false),
       (27, 'Группировка, Сортировка, Фильтрация', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (28, 'COUNT', true),
       (28, 'SUM', true),
       (28, 'AVG', true),
       (28, 'MAX', true),
       (28, 'MIN', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (30, 'Уникальный идентификатор записи', true),
       (30, 'Связь с другой таблицей', false),
       (30, 'Тип данных', false),
       (30, 'Индекс', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (31, 'NOT NULL', true),
       (31, 'UNIQUE', true),
       (31, 'CHECK', true),
       (31, 'DEFAULT', true),
       (31, 'PRIMARY KEY', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (33, 'Группирует строки с одинаковыми значениями', true),
       (33, 'Сортирует результат', false),
       (33, 'Фильтрует строки', false),
       (33, 'Объединяет таблицы', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (34, 'WHERE', true),
       (34, 'HAVING', true),
       (34, 'GROUP BY', false),
       (34, 'ORDER BY', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (36, 'Ссылается на первичный ключ другой таблицы', true),
       (36, 'Уникальный идентификатор', false),
       (36, 'Индекс для поиска', false),
       (36, 'Тип данных', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (37, 'INTEGER', true),
       (37, 'VARCHAR', true),
       (37, 'BOOLEAN', true),
       (37, 'JSON', true),
       (37, 'ARRAY', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (39, 'Фильтрует группы после GROUP BY', true),
       (39, 'Фильтрует строки', false),
       (39, 'Сортирует результат', false),
       (39, 'Объединяет таблицы', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (40, 'NULL означает отсутствие значения', true),
       (40, 'NULL = NULL', false),
       (40, 'NULL IS NULL', true),
       (40, 'NULL можно сравнивать через =', false),
       (40, 'NULL в вычислениях дает NULL', true);

-- Ответы для теста 3 (Java)
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (41, 'Инкапсуляция', true),
       (41, 'Наследование', true),
       (41, 'Полиморфизм', true),
       (41, 'Абстракция', true),
       (41, 'Сериализация', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (42, 'Виртуальная машина Java', true),
       (42, 'Среда разработки', false),
       (42, 'Библиотека классов', false),
       (42, 'Компилятор', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (44, 'ArrayList', true),
       (44, 'LinkedList', true),
       (44, 'HashSet', false),
       (44, 'Vector', true),
       (44, 'HashMap', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (45, 'Класс нельзя наследовать', true),
       (45, 'Класс нельзя изменять', false),
       (45, 'Класс нельзя инстанциировать', false),
       (45, 'Класс нельзя компилировать', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (46, 'IOException', true),
       (46, 'NullPointerException', false),
       (46, 'SQLException', true),
       (46, 'ArithmeticException', false),
       (46, 'ClassNotFoundException', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (48, 'Несколько методов с одинаковым именем', true),
       (48, 'Несколько методов с разными именами', false),
       (48, 'Переопределение метода', false),
       (48, 'Создание объекта', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (49, 'public', true),
       (49, 'private', true),
       (49, 'protected', true),
       (49, 'default', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (51, 'Контракт для реализации методов', true),
       (51, 'Готовый класс', false),
       (51, 'Абстрактный класс', false),
       (51, 'Объект', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (52, 'String immutable', true),
       (52, 'String можно изменять', false),
       (52, 'String хранится в пуле', true),
       (52, 'String это массив char', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (54, 'Способность объекта принимать разные формы', true),
       (54, 'Скрытие данных', false),
       (54, 'Наследование свойств', false),
       (54, 'Создание класса', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (55, 'Integer', true),
       (55, 'Double', true),
       (55, 'Boolean', true),
       (55, 'String', false),
       (55, 'Character', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (57, 'Сравнивает объекты', true),
       (57, 'Возвращает хэш-код', false),
       (57, 'Создает копию', false),
       (57, 'Преобразует в строку', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (58, 'synchronized', true),
       (58, 'wait()', true),
       (58, 'notify()', true),
       (58, 'sleep()', true),
       (58, 'run()', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (60, 'Класс, который нельзя инстанциировать', true),
       (60, 'Класс со всеми абстрактными методами', false),
       (60, 'Интерфейс', false),
       (60, 'Обычный класс', false);

-- Ответы для теста 4 (Математика)
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (61, '105', true),
       (61, '100', false),
       (61, '115', false),
       (61, '95', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (62, '17', true),
       (62, '21', false),
       (62, '23', true),
       (62, '27', false),
       (62, '29', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (64, '12', true),
       (64, '14', false),
       (64, '10', false),
       (64, '16', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (65, '2/4', true),
       (65, '3/6', true),
       (65, '4/8', true),
       (65, '5/10', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (67, '0.8', true),
       (67, '3/4', false),
       (67, 'они равны', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (68, 'Если A > B и B > C, то A > C', true),
       (68, 'Все кошки серые', false),
       (68, 'Если идет дождь, то мокро', true),
       (68, 'Квадрат имеет 4 стороны', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (70, '1', true),
       (70, '0', false),
       (70, '0.5', false),
       (70, 'не определен', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (71, 'Квадрат', true),
       (71, 'Треугольник', false),
       (71, 'Ромб', true),
       (71, 'Круг', false),
       (71, 'Трапеция', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (73, '90', true),
       (73, '180', false),
       (73, '45', false),
       (73, '360', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (74, '12', true),
       (74, '15', true),
       (74, '16', false),
       (74, '18', true),
       (74, '20', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (76, 'Число, которое делится только на 1 и на себя', true),
       (76, 'Четное число', false),
       (76, 'Число больше 10', false),
       (76, 'Дробное число', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (77, 'Скобки', true),
       (77, 'Умножение', true),
       (77, 'Сложение', false),
       (77, 'Деление', true),
       (77, 'Вычитание', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (79, '27', true),
       (79, '9', false),
       (79, '12', false),
       (79, '18', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (80, 'Сумма углов = 180°', true),
       (80, 'Все стороны равны', false),
       (80, 'Площадь = 1/2 * основание * высоту', true),
       (80, 'Диагонали равны', false);

-- Ответы для теста 5 (Искусство)
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (81, 'Леонардо да Винчи', true),
       (81, 'Микеланджело', false),
       (81, 'Рафаэль', false),
       (81, 'Тициан', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (82, 'Леонардо да Винчи', true),
       (82, 'Микеланджело', true),
       (82, 'Рафаэль', true),
       (82, 'Пикассо', false),
       (82, 'Боттичелли', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (84, 'В Париже', true),
       (84, 'В Лондоне', false),
       (84, 'В Риме', false),
       (84, 'В Мадриде', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (85, 'Постоянство памяти', true),
       (85, 'Мона Лиза', false),
       (85, 'Сон, вызванный полетом пчелы', true),
       (85, 'Подсолнухи', false),
       (85, 'Искушение святого Антония', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (87, 'Авангард', false),
       (87, 'Импрессионизм', false),
       (87, 'Сюрреализм', true),
       (87, 'Реализм', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (88, 'Эрмитаж', true),
       (88, 'Лувр', false),
       (88, 'Третьяковская галерея', true),
       (88, 'Прадо', false),
       (88, 'Русский музей', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (90, 'Барокко', false),
       (90, 'Ренессанс', true),
       (90, 'Готика', false),
       (90, 'Классицизм', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (91, 'Клод Моне', true),
       (91, 'Пьер Огюст Ренуар', true),
       (91, 'Эдгар Дега', true),
       (91, 'Пабло Пикассо', false),
       (91, 'Камиль Писсарро', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (93, 'Роспись по сырой штукатурке', true),
       (93, 'Скульптура', false),
       (93, 'Картина маслом', false),
       (93, 'Гравюра', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (94, 'Ночной дозор', true),
       (94, 'Даная', false),
       (94, 'Возвращение блудного сына', true),
       (94, 'Сирень', false),
       (94, 'Автопортрет', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (96, '15-16 век', true),
       (96, '17 век', false),
       (96, '18 век', false),
       (96, '14 век', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (97, 'Готика', true),
       (97, 'Романский', true),
       (97, 'Барокко', true),
       (97, 'Импрессионизм', false),
       (97, 'Классицизм', true);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (99, 'Стиль в искусстве 17-18 веков', true),
       (99, 'Архитектурный стиль', false),
       (99, 'Музыкальный жанр', false),
       (99, 'Скульптура', false);
INSERT INTO answer (id_question, answer_text, is_correct)
VALUES (100, 'Мадонна Литта', true),
       (100, 'Возвращение блудного сына', true),
       (100, 'Даная', true),
       (100, 'Подсолнухи', false),
       (100, 'Танец', false);

-- Добавим несколько попыток прохождения тестов для пользователя id_person = 1
INSERT INTO test_attempt (id_person, id_test, start_time, end_time, score, status)
VALUES (1, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '20 minutes', 35, 'COMPLETED'),
       (1, 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '15 minutes', 42, 'COMPLETED'),
       (1, 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '25 minutes', 38, 'COMPLETED'),
       (1, 4, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours' + INTERVAL '10 minutes', 28, 'COMPLETED'),
       (1, 5, NOW() - INTERVAL '6 hours', NULL, NULL, 'IN_PROGRESS'),
       (1, 1, NOW() - INTERVAL '1 hour', NULL, NULL, 'IN_PROGRESS'),
       (1, 2, NOW() - INTERVAL '30 minutes', NULL, NULL, 'IN_PROGRESS');

-- Добавим несколько событий активности
INSERT INTO activity_event (id_attempt, event_type, event_time, event_data)
VALUES (1, 'START_TEST', NOW() - INTERVAL '3 days', '{
  "browser": "Chrome",
  "os": "Windows"
}'),
       (1, 'ANSWER_QUESTION', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes', '{
         "question_id": 1,
         "answer_id": 2
       }'),
       (1, 'ANSWER_QUESTION', NOW() - INTERVAL '3 days' + INTERVAL '4 minutes', '{
         "question_id": 2,
         "answer_id": 5
       }'),
       (1, 'SWITCH_TAB', NOW() - INTERVAL '3 days' + INTERVAL '10 minutes', '{
         "tab_url": "google.com",
         "duration": 5
       }'),
       (1, 'FINISH_TEST', NOW() - INTERVAL '3 days' + INTERVAL '20 minutes', '{
         "total_time": 20,
         "score": 35
       }'),
       (4, 'START_TEST', NOW() - INTERVAL '12 hours', '{
         "browser": "Firefox",
         "os": "macOS"
       }'),
       (4, 'ANSWER_QUESTION', NOW() - INTERVAL '12 hours' + INTERVAL '3 minutes', '{
         "question_id": 61,
         "answer_id": 200
       }'),
       (4, 'MOUSE_LEFT_WINDOW', NOW() - INTERVAL '12 hours' + INTERVAL '5 minutes', '{
         "duration": 3
       }'),
       (4, 'ANSWER_QUESTION', NOW() - INTERVAL '12 hours' + INTERVAL '7 minutes', '{
         "question_id": 62,
         "answer_id": 203
       }'),
       (4, 'FINISH_TEST', NOW() - INTERVAL '12 hours' + INTERVAL '10 minutes', '{
         "total_time": 10,
         "score": 28
       }');

-- Добавим нарушения для некоторых попыток
INSERT INTO violation (id_attempt, id_event, violation_type, severity, created_at)
VALUES (1, 4, 'TAB_SWITCH', 3, NOW() - INTERVAL '3 days' + INTERVAL '10 minutes'),
       (4, 8, 'WINDOW_LEAVE', 2, NOW() - INTERVAL '12 hours' + INTERVAL '5 minutes');

-- Добавим ответы на вопросы для завершенных попыток
INSERT INTO attempt_answer (id_attempt, id_question, id_answer, text_answer, answered_at)
VALUES (1, 1, 2, NULL, NOW() - INTERVAL '3 days' + INTERVAL '2 minutes'),
       (1, 2, NULL, 'joyful, cheerful, glad', NOW() - INTERVAL '3 days' + INTERVAL '4 minutes'),
       (1, 4, 6, NULL, NOW() - INTERVAL '3 days' + INTERVAL '6 minutes'),
       (1, 7, 19, NULL, NOW() - INTERVAL '3 days' + INTERVAL '8 minutes'),
       (1, 10, 31, NULL, NOW() - INTERVAL '3 days' + INTERVAL '10 minutes'),
       (1, 13, 38, NULL, NOW() - INTERVAL '3 days' + INTERVAL '12 minutes'),
       (1, 16, 47, NULL, NOW() - INTERVAL '3 days' + INTERVAL '14 minutes'),
       (1, 19, 54, NULL, NOW() - INTERVAL '3 days' + INTERVAL '16 minutes');

INSERT INTO attempt_answer (id_attempt, id_question, id_answer, text_answer, answered_at)
VALUES (2, 21, 61, NULL, NOW() - INTERVAL '2 days' + INTERVAL '2 minutes'),
       (2, 22, NULL, 'CREATE, ALTER, DROP', NOW() - INTERVAL '2 days' + INTERVAL '4 minutes'),
       (2, 24, 68, NULL, NOW() - INTERVAL '2 days' + INTERVAL '6 minutes'),
       (2, 27, 75, NULL, NOW() - INTERVAL '2 days' + INTERVAL '8 minutes'),
       (2, 30, 86, NULL, NOW() - INTERVAL '2 days' + INTERVAL '10 minutes'),
       (2, 33, 97, NULL, NOW() - INTERVAL '2 days' + INTERVAL '12 minutes'),
       (2, 36, 105, NULL, NOW() - INTERVAL '2 days' + INTERVAL '14 minutes'),
       (2, 39, 114, NULL, NOW() - INTERVAL '2 days' + INTERVAL '16 minutes');

INSERT INTO attempt_answer (id_attempt, id_question, id_answer, text_answer, answered_at)
VALUES (3, 41, NULL, 'Инкапсуляция, Наследование, Полиморфизм, Абстракция',
        NOW() - INTERVAL '1 day' + INTERVAL '3 minutes'),
       (3, 42, 119, NULL, NOW() - INTERVAL '1 day' + INTERVAL '5 minutes'),
       (3, 44, NULL, 'ArrayList, LinkedList, Vector', NOW() - INTERVAL '1 day' + INTERVAL '8 minutes'),
       (3, 45, 126, NULL, NOW() - INTERVAL '1 day' + INTERVAL '10 minutes'),
       (3, 48, 140, NULL, NOW() - INTERVAL '1 day' + INTERVAL '12 minutes'),
       (3, 51, 150, NULL, NOW() - INTERVAL '1 day' + INTERVAL '15 minutes'),
       (3, 54, 163, NULL, NOW() - INTERVAL '1 day' + INTERVAL '18 minutes'),
       (3, 57, 176, NULL, NOW() - INTERVAL '1 day' + INTERVAL '20 minutes'),
       (3, 60, 188, NULL, NOW() - INTERVAL '1 day' + INTERVAL '23 minutes');

INSERT INTO attempt_answer (id_attempt, id_question, id_answer, text_answer, answered_at)
VALUES (4, 61, 190, NULL, NOW() - INTERVAL '12 hours' + INTERVAL '3 minutes'),
       (4, 62, NULL, '17, 23, 29', NOW() - INTERVAL '12 hours' + INTERVAL '5 minutes'),
       (4, 64, 199, NULL, NOW() - INTERVAL '12 hours' + INTERVAL '6 minutes'),
       (4, 65, NULL, '2/4, 3/6, 4/8, 5/10', NOW() - INTERVAL '12 hours' + INTERVAL '7 minutes'),
       (4, 67, 209, NULL, NOW() - INTERVAL '12 hours' + INTERVAL '8 minutes'),
       (4, 70, 215, NULL, NOW() - INTERVAL '12 hours' + INTERVAL '9 minutes'),
       (4, 73, 226, NULL, NOW() - INTERVAL '12 hours' + INTERVAL '10 minutes'),
       (4, 76, 236, NULL, NOW() - INTERVAL '12 hours' + INTERVAL '11 minutes');