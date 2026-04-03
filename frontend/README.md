# Основное info

## БД
В ***compose.yaml*** указываем порт и тд <br> ***application.properties*** настраиваем тоже <br>
Далее вставляем в бд таблицы, ***находятся в tables.sql***, для того чтобы вставить данные ***data.sql***, *сначала нужно создать человека с формы регистрации*, поэтому запускаем frontend и регистрируем юсера

## Frontend
- Используется ***Angular***
- Убедитесь, что есть ***Node.js*** и ***npm*** (чтобы проверить - ```ng version```)
- Для запуска, сначала переходим в ```cd \frontend``` и прописываем ```ng serve``` для запуска и переходим в <http://localhost:4200/>

## Backend
Чтобы запустить полноценно, нужно выполнить указания с бд, а также понадобиться **jwtSecret** (для примера: ```ThisIsAVeryLongSecretKeyThatIsAtLeastSixtyFourCharactersLongForHS512AlgorithmSecurity987654321```)
- Остальное разбито по пакетам 
