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

INSERT INTO tutor_times
	(tutor_id, id, day_of, start_time)
VALUES
	('4905cbf3-29b6-451d-a135-3c6808ecc17f',
	'16200a38-f391-48c3-a38e-db68294b933b',
	'2024-01-01',
	'00:00'
	),

	('4905cbf3-29b6-451d-a135-3c6808ecc17f',
	'332a5c8e-ced8-4a05-a970-893a1ebf5128',
	'2024-01-31',
	'18:00'
	),

	('4905cbf3-29b6-451d-a135-3c6808ecc17f',
	'f104e833-f4cb-40de-a429-772171abaef6',
	'2024-07-21',
	'06:00'
	),

	('efc3c96e-584a-4312-bf2d-7e89fdece0cf',
	'6224020b-e28c-4487-89a1-fc23bcbbc041',
	'2024-06-09',
	'03:00'
	),

	('efc3c96e-584a-4312-bf2d-7e89fdece0cf',
	'3b0f6672-8184-42d7-8c4f-6f7cf037bba6',
	'2024-07-21',
	'06:00'
	);

INSERT INTO sessions
	(id, student_id, tutor_id, appointment)
VALUES
	('cd55a930-d30e-11ed-afa1-0242ac120002', 
	'80d4ec4b-9037-4496-8b18-96d4f4f50073', 
	'4905cbf3-29b6-451d-a135-3c6808ecc17f', 
	'16200a38-f391-48c3-a38e-db68294b933b'),

	('1f19e528-d310-11ed-afa1-0242ac120002',
	'709ecb74-375e-4a19-a98e-3e7f5b8ea361',
	'efc3c96e-584a-4312-bf2d-7e89fdece0cf',
	'3b0f6672-8184-42d7-8c4f-6f7cf037bba6'),
	
	('2b055d00-d314-11ed-afa1-0242ac120002',
	'82a0cbd7-2f53-421e-bc40-8c03fb9d9f2c',
	'efc3c96e-584a-4312-bf2d-7e89fdece0cf',
	'6224020b-e28c-4487-89a1-fc23bcbbc041');
