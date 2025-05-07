PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE discipline (
	id INTEGER NOT NULL, 
	name VARCHAR NOT NULL, 
	date_start VARCHAR NOT NULL, 
	date_end VARCHAR NOT NULL, 
	PRIMARY KEY (id)
);
INSERT INTO discipline VALUES(1,'ТППО','2025-01-01','2025-05-01');
INSERT INTO discipline VALUES(2,'Интерфейсы','2025-01-01','2025-05-01');
INSERT INTO discipline VALUES(3,'Моделирование ПО','2025-01-01','2025-05-01');
CREATE TABLE IF NOT EXISTS "group" (
	id INTEGER NOT NULL, 
	name VARCHAR NOT NULL, 
	PRIMARY KEY (id)
);
INSERT INTO "group" VALUES(1,'22301');
INSERT INTO "group" VALUES(2,'22302');
INSERT INTO "group" VALUES(3,'22303');
INSERT INTO "group" VALUES(4,'22204');
INSERT INTO "group" VALUES(5,'22205');
INSERT INTO "group" VALUES(6,'22206');
INSERT INTO "group" VALUES(7,'22307');
CREATE TABLE user (
	id INTEGER NOT NULL, 
	name VARCHAR NOT NULL, 
	surname VARCHAR NOT NULL, 
	patronymic VARCHAR NOT NULL, 
	role VARCHAR NOT NULL, 
	login VARCHAR NOT NULL, 
	password VARCHAR NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (login)
);
INSERT INTO user VALUES(1,'Виктория','Афанасьева','Валентиновна','Староста','vika','12345');
INSERT INTO user VALUES(2,'Елизавета','Гасова','Алексеевнавроде','Студент','liza','12345');
INSERT INTO user VALUES(3,'Анатолий','Каргин','Павлович','Студент','tolja','12345');
INSERT INTO user VALUES(4,'Кирилл','Кулаков','Александрович','Преподаватель','kirill','12345');
CREATE TABLE lesson (
	id INTEGER NOT NULL, 
	discipline_id BIGINT NOT NULL, 
	date VARCHAR NOT NULL, 
	time_start VARCHAR NOT NULL, 
	time_end VARCHAR NOT NULL, 
	group_id BIGINT NOT NULL, 
	teacher_id BIGINT NOT NULL, 
	subgroup BIGINT NOT NULL, 
	type VARCHAR NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(discipline_id) REFERENCES discipline (id) ON DELETE CASCADE, 
	FOREIGN KEY(group_id) REFERENCES "group" (id) ON DELETE CASCADE, 
	FOREIGN KEY(teacher_id) REFERENCES user (id) ON DELETE SET NULL
);
INSERT INTO lesson VALUES(1,1,'2025-04-28','8:00','9:45',7,4,1,'Практика');
INSERT INTO lesson VALUES(2,1,'2025-04-28','8:00','9:45',7,4,2,'Практика');
CREATE TABLE elective (
	student_id BIGINT NOT NULL, 
	discipline_id BIGINT NOT NULL, 
	PRIMARY KEY (student_id, discipline_id), 
	FOREIGN KEY(student_id) REFERENCES user (id) ON DELETE CASCADE, 
	FOREIGN KEY(discipline_id) REFERENCES discipline (id) ON DELETE CASCADE
);
CREATE TABLE attendance (
	lesson_id BIGINT NOT NULL, 
	student_id BIGINT NOT NULL, 
	mark VARCHAR NOT NULL, 
	PRIMARY KEY (lesson_id, student_id), 
	FOREIGN KEY(lesson_id) REFERENCES lesson (id) ON DELETE CASCADE, 
	FOREIGN KEY(student_id) REFERENCES user (id) ON DELETE CASCADE
);
INSERT INTO attendance VALUES(1,1,'Не был');
INSERT INTO attendance VALUES(2,2,'Был');
CREATE TABLE student_group (
	group_id BIGINT NOT NULL, 
	student_id BIGINT NOT NULL, 
	device_address VARCHAR NOT NULL, 
	academic_leave BOOLEAN NOT NULL, 
	subgroup BIGINT NOT NULL, 
	PRIMARY KEY (group_id, student_id), 
	FOREIGN KEY(group_id) REFERENCES "group" (id) ON DELETE CASCADE, 
	FOREIGN KEY(student_id) REFERENCES user (id) ON DELETE CASCADE
);
INSERT INTO student_group VALUES(7,1,'string',0,1);
INSERT INTO student_group VALUES(7,2,'string',0,2);
INSERT INTO student_group VALUES(7,3,'string',1,1);
COMMIT;
