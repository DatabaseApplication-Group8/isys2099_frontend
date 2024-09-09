## Team Members and Contribution Scores:
1. Nguyen Anh Duy (s3878141) - Contribution Score: 5
2. Ton Nu Ngoc Khanh (s3932105) - Contribution Score: 5
3. Tran Vu Quang Anh (s3916566) - Contribution Score: 5
4. Tran Nhat Tien (s3919657) - Contribution Score: 5

## Link video:
https://youtu.be/LnfX38xT1l8

## Github Organization's link: 
https://github.com/DatabaseApplication-Group8 

(You can install MySQL Community Server and MongoDB Community Server as an alternative for Step1 and Step2 below)
#### 1. Install Database Server using Docker
Follow the Docker installation instructions specific to your operating system from the Docker website (https://www.docker.com/)

#### 2. Run docker command
- Install Database Servers:
mysql:
```bash
$ docker run --name server-isys2099 -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mysql
```
mongodb: 
```bash
$ docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=group8 -e MONGO_INITDB_ROOT_PASSWORD=1234  --name mongo-isys2099 mongo
```
If you does not use Docker, make sure that your default database server has the write port: 3306, and THE DATABASE NAME you create before injecting the SQL source will be: db_isys2099
- Insert SQL script from the backend source code (after open it or clone from the repository below):
    + You can choose any tool to open the database server
    + You can import SQL file "db_isys2099_source.sql" to get the data

(Please do this before continuing to the backend folder)

#### 3. Open Backend Folder
(you can clone it directly from our repository)

- Clone Repository:
```bash
$ git clone https://github.com/DatabaseApplication-Group8/isys2099_backend.git
```
- Install packages:
```bash
$ cd backend
$ npm i
```
- Create .env file and place it OUTSITE the src file, same level with package.json file
```bash
// copy the below attributes to your -> .env file 
SECRET_KEY="G08"
DATABASE_URL="mysql://root:1234@localhost:3306/db_isys2099"
JWT_SECRET=35ffa7f8-6545-4215-a575-c2e51c01f614
JWT_ACCESS_TOKEN_EXPIRED=10d
MONGODB_URI=mongodb://group8:1234@localhost:27017/hospital?authSource=admin
```
- Initialise Prisma Client:
(IMPORTANT: Please do this only after you have inject the mysql script into your database server!!!)
```bash
$ npx prisma db pull
$ npx prisma generate
```
- Start server:
```bash
$ npm run start:dev
```

#### 4. Open Frontend Folder
(you can clone it directly from our repository)

- Clone Repository:
```bash
$ git clone https://github.com/DatabaseApplication-Group8/isys2099_frontend.git
```
- Install packages:
```bash
$ cd frontend
$ npm i
```
- Start server:
```bash
$ npm run dev
```
-> Open [http://localhost:3000](http://localhost:3000) with your browser to navigate to the Home Page of our Hospital Management System Website!

#### 5. Other notes:
- In our backend source code, there is a folder mysql containing the SQL scripts to create index, partitions, grant roles, create transactions and procedures. You can find 3 mysql file there
- However, since our website have converted from database model to ORM model using prisma, please create another database with different name, insert the same structure from "db_isys2099_source.sql", and then you can run the scripts to test there. 
- If you try to run these 3 files with the same database, the website could not start!!! Please remember this.


## Supported Libraries:
1. FontAwesome
2. Axios 
3. Tailwind

