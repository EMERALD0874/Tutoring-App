CREATE TABLE users (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    about TEXT,
    email TEXT,
    birthdate DATE,
    username TEXT UNIQUE,
    password_hash TEXT
);

CREATE TABLE tutors (
    id UUID PRIMARY KEY REFERENCES users(id)
);

CREATE TABLE tutors_subjects (
    tutor_id UUID PRIMARY KEY REFERENCES tutors(id) ON DELETE CASCADE,
    subject_id TEXT references SUBJECTS(id)
)

CREATE TABLE tutor_times (
    tutor_id UUID REFERENCES tutors(id),
    id UUID PRIMARY KEY,
    day_of DATE,
    start_time TIME
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES users(id),
    tutor_id UUID REFERENCES tutors(id),
    appointment UUID REFERENCES tutor_times(id)
);

CREATE TABLE departments (
    name TEXT PRIMARY KEY
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY,
    name TEXT,
    department TEXT REFERENCES departments(name)
);

CREATE TABLE auth_tokens ( 
    user_id UUID REFERENCES users(id),
    token TEXT NOT NULL,
    expires TIMESTAMP NOT NULL
);
