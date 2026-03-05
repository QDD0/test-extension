CREATE TABLE person
(
    id_person  SERIAL PRIMARY KEY,
    first_name VARCHAR(30)  NOT NULL,
    last_name  VARCHAR(40)  NOT NULL,
    surname    VARCHAR(50),
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   TEXT         NOT NULL,
    enabled    BOOLEAN      NOT NULL DEFAULT false,
    role       VARCHAR(30)  NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test
(
    id_test          SERIAL PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    duration_minutes INTEGER      NOT NULL,
    created_by       INTEGER REFERENCES person (id_person),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE question
(
    id_question   SERIAL PRIMARY KEY,
    id_test       INTEGER REFERENCES test (id_test) ON DELETE CASCADE,
    question_text TEXT        NOT NULL,
    type_question VARCHAR(50) NOT NULL
        CHECK (type_question IN ('SINGLE', 'MULTIPLE', 'TEXT')),
    points        INTEGER DEFAULT 1
);

CREATE TABLE answer
(
    id_answer   SERIAL PRIMARY KEY,
    id_question INTEGER REFERENCES question (id_question) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct  BOOLEAN DEFAULT FALSE
);

CREATE TABLE test_attempt
(
    id_attempt SERIAL PRIMARY KEY,
    id_person  INTEGER REFERENCES person (id_person) ON DELETE CASCADE,
    id_test    INTEGER REFERENCES test (id_test) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time   TIMESTAMP,
    score      INTEGER,
    status     VARCHAR(30) DEFAULT 'IN_PROGRESS'
        CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'BLOCKED'))
);

CREATE TABLE activity_event
(
    id_event   SERIAL PRIMARY KEY,
    id_attempt INTEGER REFERENCES test_attempt (id_attempt) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_time TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event_data JSONB
);

CREATE TABLE violation
(
    id_violation   SERIAL PRIMARY KEY,
    id_attempt     INTEGER REFERENCES test_attempt (id_attempt) ON DELETE CASCADE,
    id_event       INTEGER REFERENCES activity_event (id_event),
    violation_type VARCHAR(50),
    severity       INTEGER CHECK (severity BETWEEN 1 AND 10),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attempt_answer
(
    id_attempt_answer SERIAL PRIMARY KEY,
    id_attempt        INTEGER REFERENCES test_attempt (id_attempt) ON DELETE CASCADE,
    id_question       INTEGER REFERENCES question (id_question) ON DELETE CASCADE,
    id_answer         INTEGER REFERENCES answer (id_answer),
    text_answer       TEXT,
    answered_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_attempt, id_question, id_answer)
);