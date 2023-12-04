--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT exists Customer (
	
	id uuid DEFAULT gen_random_uuid(),
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	email VARCHAR(256),
	username VARCHAR(30),
	password VARCHAR(256),
	gender CHAR(1),
	birth_date DATE,
	active BOOL,
	is_confirmed BOOL,
	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),
	img_url VARCHAR(2000),
	constraint PK_Customer primary key (id)
);

/*

CREATE TABLE IF NOT exists Address(
	id SERIAL,

	customer_id uuid,

	street VARCHAR(50),

	number VARCHAR(4),

	postal_code VARCHAR(12),

	parish VARCHAR(30),

	city VARCHAR(30),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	constraint PK_Address primary key (id),
	
	constraint FK_AddressCustomer 
	FOREIGN KEY (customer_id) REFERENCES customer (id)  ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE if not exists Documentation (
	customer_id uuid,

	id_card VARCHAR(10),
	id_tax VARCHAR(10),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_Documenatation PRIMARY KEY (customer_id),
	CONSTRAINT FK_DocumentationCustomer FOREIGN KEY (customer_id) REFERENCES Customer(id)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE LoginAccess(
	
	id SERIAL,
	customer_id uuid,

	ip_address VARCHAR(100),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),
	
	CONSTRAINT PK_LoginAcess PRIMARY KEY(id),
	CONSTRAINT FK_LoginCustomer FOREIGN KEY(customer_id) REFERENCES Customer(id)  ON DELETE CASCADE ON UPDATE CASCADE

);

CREATE TABLE LoginAttempt(
	id SERIAL,
	ip_address VARCHAR(40),

	ip_version CHAR(4),

	email VARCHAR(80),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_LoginAttempt PRIMARY KEY(id)
);
*/

CREATE TABLE Subject(
	
	id SERIAL,

	name VARCHAR(50),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_Subject PRIMARY KEY (id)
);


CREATE TABLE Course (

	id SERIAL,

	subject_id INT,

	name VARCHAR(50),
	description TEXT,
	price INT,
	active  BOOL,
	img_url VARCHAR(2000),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_Course PRIMARY KEY (id),
	CONSTRAINT FK_CourseSubject FOREIGN KEY(subject_id) REFERENCES Subject(id)  ON DELETE CASCADE ON UPDATE CASCADE
	
);



CREATE TABLE Chapter (

	id SERIAL,

	course_id INT,

	title VARCHAR(50),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),


	CONSTRAINT PK_Chapter PRIMARY KEY (id),
	CONSTRAINT FK_ChapterCourse FOREIGN KEY(course_id) REFERENCES Course(id)  ON DELETE CASCADE ON UPDATE CASCADE

);


CREATE TABLE Lesson (

	id SERIAL,

	chapter_id INT,

	title VARCHAR(50),
	description TEXT,

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_Lesson PRIMARY KEY (id),
	CONSTRAINT FK_Lessonhapter FOREIGN KEY(chapter_id) REFERENCES Chapter(id)  ON DELETE CASCADE ON UPDATE CASCADE

);


CREATE TABLE TextLesson (

	id SERIAL,

	lesson_id INT,

	title VARCHAR(50),
	content TEXT,

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_TextLesson PRIMARY KEY (id),
	CONSTRAINT FK_TextLessonLesson FOREIGN KEY(lesson_id) REFERENCES Lesson(id)  ON DELETE CASCADE ON UPDATE CASCADE

);


CREATE TABLE ResourceLesson (

	id SERIAL,

	lesson_id INT,

	title VARCHAR(50),
	link VARCHAR(2000),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_ResourceLesson PRIMARY KEY (id),
	CONSTRAINT FK_ResourceLessonLesson FOREIGN KEY(lesson_id) REFERENCES Lesson(id)  ON DELETE CASCADE ON UPDATE CASCADE

);


CREATE TABLE VideoLesson (

	id SERIAL,

	lesson_id INT,

	title VARCHAR(50),
	url VARCHAR(2000),

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_VideoLesson PRIMARY KEY (id),
	CONSTRAINT FK_VIdeoLessonLesson FOREIGN KEY(lesson_id) REFERENCES Lesson(id)  ON DELETE CASCADE ON UPDATE CASCADE

);

CREATE TABLE AccomplishedLesson (

	lesson_id INT,
	customer_id uuid,


	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_AccomplishedLesson PRIMARY KEY (customer_id,lesson_id),
	CONSTRAINT FK_AccomplishedLessonCustomer FOREIGN KEY (customer_id) REFERENCES Customer(id)  ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FK_AccomplishedLessonLesson FOREIGN KEY (lesson_id) REFERENCES Lesson(id)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Question(

	id SERIAL,
	customer_id uuid,
	course_id INT,

	title VARCHAR(30),
	content TEXT,

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),


	CONSTRAINT PK_Question PRIMARY KEY (id),
	CONSTRAINT FK_QuestionCustomer FOREIGN KEY (customer_id) REFERENCES Customer(id)  ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FK_QuestionCourse FOREIGN KEY (course_id) REFERENCES Course(id)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Comment (
	
	id SERIAL,
	question_id  INT, 
	customer_id uuid,

	content TEXT,

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_Comment PRIMARY KEY (id),
	CONSTRAINT FK_CommentCustomer FOREIGN KEY (customer_id) REFERENCES Customer(id)  ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FK_CommentQuestion FOREIGN KEY (question_id) REFERENCES Question(id)  ON DELETE CASCADE ON UPDATE CASCADE
)
;

CREATE TABLE CustomerCourse(

	id SERIAL,

	customer_id uuid,
	course_id INT,

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),

	CONSTRAINT PK_CustomerCourse PRIMARY KEY (id),
	CONSTRAINT FK_CustomerCourseCustomer FOREIGN KEY (customer_id) REFERENCES Customer(id)  ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FK_CustomerCourseCourse FOREIGN KEY (course_id) REFERENCES Course(id)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Certificate(
	customerCourse_id INT, 
	url VARCHAR(2000),
	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),
	CONSTRAINT PK_Certificate PRIMARY KEY(customerCourse_id),
	CONSTRAINT FK_CertificateCustomerCourse FOREIGN KEY (customerCourse_id) REFERENCES CustomerCourse(id)  ON DELETE CASCADE ON UPDATE CASCADE 
)
;

CREATE TABLE Employee(
	
	id uuid DEFAULT gen_random_uuid(),

	name VARCHAR(50),

	email VARCHAR(255),

	password VARCHAR(256),

	gender CHAR(1),

	birth_date DATE,

	created_at TIMESTAMP default NOW(),
	updated_at TIMESTAMP default NOW(),
	
	employee_role VARCHAR(10),

	CONSTRAINT PK_Employee PRIMARY KEY(id)
	

)
;

-- insert first employee with password Senha@123
insert into employee 
	(name,email,password,gender,birth_date,employee_role) 
	values('admin','admin@mylearning.com','$2a$11$LxvAvKD/g8D2h.gFpH4LSeItMgfz9jtmOCO5IV0wFlJksvPLB95XG','M','2003-05-10','Admin')
;





