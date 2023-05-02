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

CREATE TABLE departments (
    name TEXT PRIMARY KEY
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY,
    name TEXT,
    department TEXT REFERENCES departments(name)
);

CREATE TABLE tutors_subjects (
    tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id)
);

CREATE TABLE tutor_times (
    tutor_id UUID REFERENCES tutors(id),
    id UUID PRIMARY KEY,
    date_time TIMESTAMP,
    duration_hours FLOAT(2)
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES users(id),
    tutor_id UUID REFERENCES tutors(id),
    appointment UUID REFERENCES tutor_times(id)
);

CREATE TABLE auth_tokens ( 
    user_id UUID REFERENCES users(id),
    token TEXT NOT NULL,
    expires TIMESTAMP NOT NULL
);

CREATE TABLE profile_pictures (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    profile_picture BYTEA,
    file_type TEXT
);