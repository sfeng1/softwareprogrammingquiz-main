CREATE OR REPLACE TABLE Accounts (
    account_id int(10) NOT NULL AUTO_INCREMENT,
    user_name varchar(50) NOT NULL,
    password varchar(20) NOT NULL,
    PRIMARY KEY (account_id) 
);

INSERT INTO Accounts (user_name, password) 
VALUES
('feng@gmail.com','12345'),
('kyrne@yahoo.com.', 'abcde'),
('tauiliil@oregonstate.edu', 'GoodPassword');

CREATE OR REPLACE TABLE Profiles (
    profile_id int(10) NOT NULL AUTO_INCREMENT,
    profile_name char(30), 
    email varchar(30), 
    state char(2),
    account_id int(10) NOT NULL,
    sec_question varchar(50) NOT NULL,
    sec_answer varchar(50) NOT NULL,
    PRIMARY KEY (profile_id),
    FOREIGN KEY (account_id) REFERENCES Accounts(account_id)
    ON DELETE CASCADE
);

INSERT INTO Profiles (profile_name, email, state, account_id, sec_question, sec_answer) 
VALUES
('Lorraine Tauiliili', 'tauiliil@oregonstate.edu', 'WA', 3);
('Sheng Feng', 'feng@gmail.com', 'NV', 1, 'First Pet Name?', 'Lando'),
('profile2', 'profile2@outlook.com', 'OR', 2, 'Middle School Name?', 'Blevins');

CREATE OR REPLACE TABLE Quizzes (
    quiz_id int(10) NOT NULL,
    quiz_version_id int(10) NOT NULL,
    account_id int(10) NOT NULL,
    time_limit int(5) NOT NULL,
    modified_date datetime, 
    name varchar(50) NOT NULL,
    description text, 
    total_points int(11) NOT NULL,
    PRIMARY KEY (quiz_id, quiz_version_id),
    FOREIGN KEY (account_id) REFERENCES Accounts(account_id)
    ON DELETE CASCADE
);

INSERT INTO Quizzes (quiz_id, quiz_version_id, account_id, time_limit, modified_date, name, description, total_points) 
VALUES
(1249352191, 1, 1, 50, '2024-12-10 12:23:32', "Strange JS", "", 1),
(1204680850, 1, 2, 80, '2021-05-15 10:23:32', "SQL Assessment", "Assessment for SQL", 5),
(1231812150, 1, 3, 30, '2020-08-10 20:23:32', "Forms Tests", "Quizzing on different forms", 10),
(1231812150, 2, 3, 30, '2023-08-10 20:23:32', "Forms Tests", "Quizzing on different forms", 20),
(1231812151, 1, 3, 6, '2020-08-10 20:23:32', "Cap Stone", "Quick assessment on HTML", 16);

CREATE OR REPLACE TABLE Candidates (
    candidate_id int(10) NOT NULL AUTO_INCREMENT,
    quiz_id int(10) NOT NULL, 
    quiz_version_id int(10) NOT NULL,
    quiz_key varchar(36) NOT NULL,
    email_sent_date datetime,
    email_complete_date datetime,
    quiz_expiration_date datetime NOT NULL,
    candidate_email varchar(30) NOT NULL,
    nickname varchar(20),
    PRIMARY KEY (candidate_id),
    FOREIGN KEY (quiz_id, quiz_version_id) REFERENCES Quizzes(quiz_id, quiz_version_id)
    ON DELETE CASCADE
);

INSERT INTO Candidates (quiz_id, quiz_version_id, quiz_key, email_sent_date, email_complete_date, quiz_expiration_date, candidate_email, nickname) 
VALUES
(1249352191, 1, 'ebHQSS9KlylOR087o0JzmSHYoNKWehrt1234', '2024-12-05 12:23:32', '2024-12-10 12:23:32', '2024-12-15 12:23:32', 'fake@gmail.com', 'Jboy'),
(1204680850, 1, 'Q2ATRkDTbWUEjM1FjfXk0In1wUVkTbpM1234', '2021-08-15 10:23:32','2021-08-16 10:23:32', '2021-08-20 10:23:32', 'flamb@hotmail.com','Flamb'),
(1231812150, 1, 'hcmW5sb3Z7gwYNQN8ZwQI3OmOFNzgNap1234', '2020-12-10 20:23:32', '2020-12-12 20:23:32', '2020-12-24 20:23:32', 'cool@yahoo.com','CoolGirl'),
(1231812151, 1, 'caab0359-24a1-469c-bd80-03befe266e6d', '2023-12-10 20:23:32', '2024-02-10 20:28:32', '2024-03-01 20:23:32', 'kakarot@gmail.com','Kakarot1986'),
(1231812151, 1, 'a813dc9e-c955-11ee-a506-0242ac120002', '2024-01-10 20:23:32', null, '2024-04-01 20:23:32', 'son.goku@gmail.com','SonGoku'),
(1231812151, 1, '60bda418-ced9-11ee-a506-0242ac120002', '2024-01-10 20:23:32', null, '2024-04-01 20:23:32', 'briefs.vegeta@gmail.com','PrinceVegeta'),
(1231812151, 1, '899ff3d2-3afc-4476-8ebf-442db8455aae', '2024-01-10 20:23:32', null, '2024-04-01 20:23:32', 'briefs.bulma@capsulecorp.com','BulmaBriefs');


CREATE OR REPLACE TABLE Attempts (
    attempt_id int(10) NOT NULL AUTO_INCREMENT,
    quiz_id int(10) NOT NULL, 
    quiz_version_id int(10) NOT NULL,
    quiz_key varchar(36) NOT NULL,
    start_time datetime NOT NULL,
    submit_time datetime,
    total_score int(10),
    timeout int(1),
    PRIMARY KEY (attempt_id),
    FOREIGN KEY (quiz_id, quiz_version_id) REFERENCES Quizzes(quiz_id, quiz_version_id)
    ON DELETE CASCADE
);

INSERT INTO Attempts (attempt_id, quiz_id, quiz_version_id, quiz_key, start_time, submit_time, total_score, timeout) 
VALUES
(1, 1231812151, 1, 'caab0359-24a1-469c-bd80-03befe266e6d', '2024-03-10 20:23:32', '2024-03-10 20:28:32', 6, 0),
(2, 1231812151, 1, 'a813dc9e-c955-11ee-a506-0242ac120002', '2024-02-18 21:59:10', '2024-02-18 22:01:12', 16, 0),   
(3, 1231812151, 1, '60bda418-ced9-11ee-a506-0242ac120002', '2024-02-18 22:57:19', '2024-02-18 23:03:45', 11, 0); 

CREATE OR REPLACE TABLE Responses (
    response_id  int(10) NOT NULL AUTO_INCREMENT,
    attempt_id int(10) NOT NULL, 
    question_number int(3),
    answer_text varchar(1000),
    points_earned int(10),
    PRIMARY KEY (response_id),
    FOREIGN KEY (attempt_id) REFERENCES Attempts(attempt_id)
    ON DELETE CASCADE
);

INSERT INTO Responses (attempt_id, question_number, answer_text, points_earned) 
VALUES
(1, 1, '[{"Selected":"True","Points":1}]', 1),
(1, 2, '[{"Selected":"Grace","Points":0}]', 0),
(1, 3, '[{"Selected":"Nevada","Points":5},{"Selected":"Namek","Points":0}]', 5),
(1, 4, '[{"AnswerText":"I am a OSU student.","Points":0}]', 0),
(2, 1, '[{"Selected":"True","Points":1}]', 1),
(2, 2, '[{"Selected":"Green","Points":5}]', 5),
(2, 3, '[{"Selected":"Nevada","Points":5},{"Selected":"California","Points":5}]', 10),
(2, 4, '[{"AnswerText":"I grew up on planet Earth","Points":0}]', 0),
(3, 1, '[{"Selected":"True","Points":1}]', 1),
(3, 2, '[{"Selected":"Goblin","Points":0}]', 0),
(3, 3, '[{"Selected":"Nevada","Points":5},{"Selected":"California","Points":5}]', 10),
(3, 4, '[{"AnswerText":"I grew up on Planet Vegeta under the rule of Frieza.","Points":0}]', 0); 

CREATE OR REPLACE TABLE Questions (
    question_id int(10) NOT NULL AUTO_INCREMENT,
    quiz_id int(10) NOT NULL,
    quiz_version_id int(10) NOT NULL,
    question_number int(3) NOT NULL,
    question_type ENUM('TF', 'MC', 'CB', 'FR') NOT NULL,
    answer_quantity int(2),
    question_text varchar(300) NOT NULL,
    correct_answer varchar(1000) NOT NULL,
    max_points int(3) NOT NULL,
    modified_date datetime,
    PRIMARY KEY (question_id),
    FOREIGN KEY (quiz_id, quiz_version_id) REFERENCES Quizzes(quiz_id, quiz_version_id)
    ON DELETE CASCADE
);

INSERT INTO Questions (quiz_id, quiz_version_id, question_number, question_type, answer_quantity, question_text, correct_answer, max_points, modified_date) 
VALUES
(1249352191, 1, 1, 'TF', 2, 'True or False, blood is red.', '[{"Choice":"True", "Points": 1}, {"Choice":"False", "Points":0}]', 1, '2020-12-10 20:23:32'),
(1204680850, 1, 1, 'MC', 3, 'Multiple Choice, what does G stand for in RGB?', '[{"Choice":"Green", "Points": 5}, {"Choice":"Grace", "Points":0}, {"Choice":"Goblin", "Points":0}]', 5, '2022-12-10 20:23:32'),
(1231812150, 1, 1, 'CB', 3, 'Check all that apply, which are states?', '[{"Choice":"Nevada", "Points": 5}, {"Choice":"California", "Points":5}, {"Choice":"Namek", "Points":0}]', 10, '2020-12-24 20:23:32'),
(1231812150, 2, 1, 'CB', 3, 'Check all that apply, which are states?', '[{"Choice":"Nevada", "Points": 5}, {"Choice":"California", "Points":5}, {"Choice":"Namek", "Points":0}]', 10, '2023-12-24 20:23:32'),
(1231812150, 2, 2, 'CB', 3, 'Check all that apply, which are continents?', '[{"Choice":"Africa", "Points": 5}, {"Choice":"North America", "Points":5}, {"Choice":"Oceania", "Points":0}]', 10, '2023-12-24 20:23:32'),
(1231812151, 1, 1, 'TF', 2, 'True or False, blood is red.', '[{"Choice":"True", "Points": 1}, {"Choice":"False", "Points":0}]', 1, '2020-12-10 20:23:32'),
(1231812151, 1, 2, 'MC', 3, 'Multiple Choice, what does G stand for in RGB?', '[{"Choice":"Green", "Points": 5}, {"Choice":"Grace", "Points":0}, {"Choice":"Goblin", "Points":0}]', 5, '2022-12-10 20:23:32'),
(1231812151, 1, 3, 'CB', 3, 'Check all that apply, which are states?', '[{"Choice":"Nevada", "Points": 5}, {"Choice":"California", "Points":5}, {"Choice":"Namek", "Points":0}]', 10, '2020-12-24 20:23:32'),
(1231812151, 1, 4, 'FR', 0, 'Tell us about yourself.', '', 0, '2020-12-24 20:23:32');
