insert into departments
	(name) 
values
	('Engineering'),
	('Computer Science'),
	('Mathematics'),
	('Music and Arts'),
	('History'),
	('Economics'),
	('Philosophy');
	
insert into subjects
	(id, name, department)
values
	('d786a168-2ca3-4ada-8298-ef1bba7db754', 'ECS1100', 'Engineering'),
	('1e4efb4d-13f6-4a13-b304-a67fefd66124', 'ENGR2250', 'Engineering'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d08', 'CS3300', 'Computer Science'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d09', 'CS2317', 'Computer Science'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d00', 'MATH2020', 'Mathematics'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d01', 'MATH2120', 'Mathematics'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d02', 'ART1123', 'Music and Arts'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d03', 'MUSC2200', 'Music and Arts'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d04', 'HIST2300', 'History'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d05', 'HIST3314', 'History'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d06', 'ECON1010', 'Economics'),
	('74b3bff1-6bb6-4dad-9b59-ce440e9c4d07', 'ECON2230', 'Economics'),
	('d786a168-2ca3-4ada-8298-ef1bba7db755', 'PHIL2337', 'Philosophy'),
	('d786a168-2ca3-4ada-8298-ef1bba7db753', 'PHIL2423', 'Philosophy');

insert into users
	(id, first_name, last_name, about, email, birthdate)
values
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

INSERT INTO tutors_subjects 
	(tutor_id, subject_id)
VALUES 
	('4905cbf3-29b6-451d-a135-3c6808ecc17f', '74b3bff1-6bb6-4dad-9b59-ce440e9c4d08'),
	('4905cbf3-29b6-451d-a135-3c6808ecc17f', '74b3bff1-6bb6-4dad-9b59-ce440e9c4d04'),
	('4905cbf3-29b6-451d-a135-3c6808ecc17f', 'd786a168-2ca3-4ada-8298-ef1bba7db753'),
	('efc3c96e-584a-4312-bf2d-7e89fdece0cf', '74b3bff1-6bb6-4dad-9b59-ce440e9c4d08'),
	('efc3c96e-584a-4312-bf2d-7e89fdece0cf', 'd786a168-2ca3-4ada-8298-ef1bba7db754'),
	('39e316a1-ba14-4eb8-b560-5164a40a701c', '74b3bff1-6bb6-4dad-9b59-ce440e9c4d04');