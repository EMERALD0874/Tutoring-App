INSERT INTO departments
	(name) 
VALUES
	('Engineering'),
	('Computer Science'),
	('Mathematics'),
	('Music and Arts'),
	('History'),
	('Economics'),
	('Philosophy');
	
INSERT INTO subjects
	(name, department)
VALUES
	('ECS1100', 'Engineering'),
	('ENGR2250', 'Engineering'),
	('CS3300', 'Computer Science'),
	('CS2317', 'Computer Science'),
	('MATH2020', 'Mathematics'),
	('MATH2120', 'Mathematics'),
	('ART1123', 'Music and Arts'),
	('MUSC2200', 'Music and Arts'),
	('HIST2300', 'History'),
	('HIST3314', 'History'),
	('ECON1010', 'Economics'),
	('ECON2230', 'Economics'),
	('PHIL2337', 'Philosophy'),
	('PHIL2423', 'Philosophy');

INSERT INTO users
	(id, first_name, last_name, about, email, birthdate)
VALUES
	('4905cbf3-29b6-451d-a135-3c6808ecc17f', 'Adem', 'Odza', 'CS Student 1', 'adem@utdallas.edu', '2001-05-11'),
	('efc3c96e-584a-4312-bf2d-7e89fdece0cf', 'Saul', 'Goodman', 'Philosophy student 1', 'jm@utdallas.edu', '2002-07-19'),
	('80d4ec4b-9037-4496-8b18-96d4f4f50073', 'TestUser1', 'Dummy', 'Engineering student 1', 'test1@utdallas.edu', '2003-10-27'),
	('709ecb74-375e-4a19-a98e-3e7f5b8ea361', 'TestUser2', 'Dummier', 'CS Student 2', 'test2@utdallas.edu', '2002-02-02'),
	('39e316a1-ba14-4eb8-b560-5164a40a701c', 'TestUser3', 'Dummiest', 'Economics Student 1', 'test3@utdallas.edu', '2001-06-15'),
	('82a0cbd7-2f53-421e-bc40-8c03fb9d9f2c', 'TestUser4', 'Dummy', 'Music and Arts Student 1', 'test4@utdallas.edu', '2002-09-22');
	
INSERT INTO tutors 
	(id) 
VALUES 
	('4905cbf3-29b6-451d-a135-3c6808ecc17f'),
	('efc3c96e-584a-4312-bf2d-7e89fdece0cf'),
	('39e316a1-ba14-4eb8-b560-5164a40a701c');
