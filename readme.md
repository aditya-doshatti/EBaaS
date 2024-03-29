# Enterprise Backend as a Service (EBaaS) - A code that writes code

  

Why do we need this in today's world?  
-


Today, most applications need a backend to bring applications features alive. Most applications today are using REpresentational State Transfer(REST) architechture to develop their APIs. RESTful API, for the majority of the part, are nothing but manipulation of database entities using Create, Retreive, Update and Delete(CRUD) operations. These CRUD operations are basically the database queries that is handled effectively by these APIs.

  

Now, approximately 3-5 days are taken up to build an API with simple CRUD operations, leaving out the testing part. That is a lot of time especially in the world of start-ups and automation, where there is this constant pressure on developers to provide results faster. So what if we have an automation tool which helps developer create a code given the requirements?

  

Hence.

  

Enterprise Backend as a Service - A Backend Generator
-

Enterprise Backend as a Service is a code generation tool that is bringing the automation exactly where it is required in the real world. EBaaS asks user to provide simple requirements related to the backend application which is then mapped to the database and its entities. With the database setup, EBaaS automates the whole process of creating models from entities and APIs that handles CRUD operations on those particular models.

  

Setup and Usage : For making EBaaS run on a local machine:
-

#### Need:  

 
		NodeJS >= 8.0.
		Python - any version of 3 or greater.
		mysql - Windows users can use XAMPP server.

  

#### Setup:


- Sequelize: To allow our backend to create models from database entities.

		- npm install -g sequelize-auto  
		- npm install -g mysql
	 
	

- Express-generator: To allow our backend to create an express structure to provide backend.

	
		- npm install -g express-generator
	
	
	
- Backend Database: Database that helps our backend do necessary operations

	
		- Navigate to /ref folder.   
		- Download the ebaas.sql file to get our database schema.  
		- In your database console:  
			create database ebaas;  
		- Import ebaas.sql file in the database created above  
	
	
	
	
#### Running the application

	
- Start the backend server

	
		- Navigate to /src/app folder  
		- Install required libraries using pip install  
		- run python ./api.py  
	 
	
	
- Start the frontend server

	
		- Navigate to /src/Frontend folder  
		- run npm install (downloads the dependencies)  
		- run npm start  

	
	
	
#### Usage

- Running the generated backend code:
	

		- Unzip the zipped file downloaded.  
		- Navigate to /static/YOUR_APPLICATION_NAME folder  
		- run npm install  
		- run node index.js  
	  
	

Setup - Using Docker  
-

#### Create a Docker Network  
	docker network create ebaas-network
#### Database Setup  
- Start a mysql docker container with "root" as the password for the root user.  
				
		- docker run -d --name mysql --network ebaas-network -td -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:5.7   
		- docker ps  
		

- Connect to the mysql docker bash.  
		
		- docker exec -it mysql bash  
		

- Start mysql console.  

		- mysql --host=localhost --user=root --password=root  
		

- Create the database and required tables.  

		- create database ebaas;  
		- use ebaas;  
		- CREATE  TABLE  application ( id bigint(20) NOT  NULL, userid bigint(20) NOT  NULL, name varchar(255) NOT  NULL, description varchar(255) DEFAULT NULL, server varchar(255) DEFAULT NULL, launched tinyint(1) NOT  NULL DEFAULT 0, created_on timestamp  NOT  NULL DEFAULT current_timestamp(), launched_on timestamp  NULL DEFAULT NULL)  
		- CREATE  TABLE  user_info (id bigint(20) NOT  NULL, emailid varchar(255) NOT  NULL, password varchar(255) NOT  NULL, name varchar(255) DEFAULT NULL, country varchar(255) DEFAULT NULL, organisation varchar(255) DEFAULT NULL)   
		- CREATE  TABLE  user_databases (id bigint(11) NOT  NULL, userid bigint(20) NOT  NULL, applicationid bigint(20) NOT  NULL, connectionname varchar(255) NOT  NULL, hostname varchar(255) NOT  NULL, username varchar(255) NOT  NULL, password varchar(255) NOT  NULL, dbname varchar(255) NOT  NULL)  
		- ALTER  TABLE application ADD PRIMARY  KEY (`id`), ADD UNIQUE KEY  userid (userid,name);  
		- ALTER  TABLE  user_info ADD PRIMARY  KEY (id), ADD UNIQUE KEY  emailid (emailid);
		- ALTER  TABLE  user_databases ADD PRIMARY  KEY (id), ADD UNIQUE KEY userid(userid,applicationid,hostname,username,password,dbname), ADD UNIQUE KEY  userid_2 (userid,connectionname), ADD KEY  application_database (applicationid);  
		- ALTER  TABLE  user_info MODIFY id bigint(20) NOT  NULL AUTO_INCREMENT, AUTO_INCREMENT=9;  
		- ALTER  TABLE  user_databases MODIFY  id  bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;  
		- ALTER  TABLE application ADD CONSTRAINT  userId FOREIGN KEY (userid) REFERENCES  user_info (id) ON DELETE CASCADE ON UPDATE CASCADE;  
		- ALTER  TABLE user_databases ADD CONSTRAINT  application_database FOREIGN KEY (applicationid) REFERENCES  application (id) ON DELETE CASCADE  ON UPDATE CASCADE, ADD CONSTRAINT  user_database FOREIGN KEY (userid) REFERENCES  user_info (id) ON DELETE CASCADE ON  UPDATE CASCADE;   
	
	
#### Backend Setup    
	
	- docker run -td --name ebaas-backend --network ebaas-network -p 5000:5000 darshilpk3/ebaas:backend  

#### Frontend Setup    
	
	- docker run -td --name ebaas-frontend --network ebaas-network -p 3000:3000 darshilpk3/ebaas:frontend   


	
APIs Generated
- 

|API-Type|HTTP - Method|Description
|--|--|--|
|/tableName/  | GET |Get all the records/rows present in that particular table.  |
|/tableName/|POST|Inserts a record provided as json in the request body in a particular table.|
|/tableName/:id|GET|Get the information based on ID from a particular table.|
|/tableName/:id|PUT|Edits the information based on ID and the request body from a particular table.|
|/tableName/:id|DELETE|Deletes a particular record based on ID from a particular table.|
|/tableName/unique  
KeyName/:unique_key|GET|Get the information based on unique key present in a particular table.|
|/tableName/unique  
KeyName/:unique_key|PUT|Edits the information of a record based on unique key present in a particular table.|
|/tableName/unique  
KeyName/:unique_key|DELETE|Deletes the record based on unique key present in a particular table.|
|/parentTable/:id/childTable/|GET|Get all the records of the child table that has relation with the parent table on the ID specified.|
|/parentTable/:id/childTable/|POST|Create a new record in the child table that relates to parent table based on the specified ID. |

Features
-
- **Database Manipulation**
	EBaaS allows users to manipulate with the database. Compared to other backend generator/providers, EBaaS doesn't just allow user to connect to an exisiting database but also allows users to create a new database in the application itself. Users have an Excel or SQL Import file? EBaaS allows that as well. Summarizing  
	
	
		
		- Connect to an existing database and modify it further before launching the backend  
		- Create a whole new database and add tables, columns and relationships  
		- Create a new database from an Excel file with multiple sheets.  
		- Create a new database from a SQL file.  
	
	
	
- **API Code- On Hand**
	Compared to other backend generators, EBaaS does not start a backend as a service which can be utilized, but instead provides a well-structured code that can be downloaded and used as a base for further advancements. Summarizing
	
	
		- Not a server, but actually a code.  
		- Code that follows the most trusted frameworks like Express and NodeJS.  
		- Code that follows the best practices from folder structure to modularity within the code.  
	
	
	
- **Ease Of Use**
	EBaaS is pretty easy to setup and use and does not make user indulge in any complex technologies for generating the backend. Compared to other tools, EBaaS allows user to interact with a UI rather than command line. Summarizing
	
	
		- Easy Setup and Usage.  
		- UI rather than command-line interface, allowing users to navigate through the steps easily.  
	
	
	
- **Security**
	EBaaS works on the user databases but never actually stores any of the data regarding that database, making it the most-secure way of providing backend. Summarizing
	   
	
		- Database data, schema and details are never stored on the backend side.   
		- Only the database name and its connection is stored, which can be modified once created by changing the credentials.  
	
	   
	
Documentation and Videos
-
- Demonstration Video: [Link](https://bitbucket.org/devashish_nyati/2020s_ebaas/raw/master/doc/8.%20Project%20Demonstration%20Video/EBaaS%20Demo.mp4)     
- Project Presentation: [Link](https://bitbucket.org/devashish_nyati/2020s_ebaas/raw/master/doc/9.%20Project%20Presentation/EBaaS%20Presentation.pptx)  
- Paper: [Link](https://bitbucket.org/devashish_nyati/2020s_ebaas/raw/master/doc/5.%20Research%20Paper%20(Project%20Report)/EBaaS.pdf)     
- Work-Flows: [Model_Generation](https://bitbucket.org/devashish_nyati/2020s_ebaas/raw/master/ref/Models2.PNG) ,  [Code_Generation](https://bitbucket.org/devashish_nyati/2020s_ebaas/raw/master/ref/Code2.PNG)     

When to use?
-
- While developing a prototype or an application with strict deadline and you need to focus on more important features than CRUD operations.  
- When you need a backend in a blink of an eye, seriously.  
- New to backend coding.  
- Working on assignments or demos.  

What's coming next?
-
- We are working on bringing the feature to allow users to have a backend in Python language using Flask framework.  
- Docker support for our frontend and backend.  
- Support for NoSQL databases and its manipulation.  
- APIs that provides insights into the database using Machine Learning.  



Team
- 

**Aditya Doshatti** - San Jose State University, MSSE Fall 2018.  
**Darshil Kapadia** - San Jose State University, MSSE Fall 2018.  
**Devashish Nyati** - San Jose State University, MSSE Fall 2018.  
**Maulin Bodiwala** - San Jose State University, MSCE Fall 2018.   

- Mentor:  
**Gokay Saldamli** - San Jose State University, Assistant Professor, Computer Engineering


***Please watch/star this repo for keeping a check on updates - and for encouraging us further.***
