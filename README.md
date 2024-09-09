## Team Members and Contribution Scores:
1. Nguyen Anh Duy (s3878141) - Contribution Score: 5
2. Ton Nu Ngoc Khanh (s3932105) - Contribution Score: 5
3. Tran Vu Quang Anh (s3916566) - Contribution Score: 5
4. Tran Nhat Tien (s3919657) - Contribution Score: 5

## Link video:
https://youtu.be/LnfX38xT1l8

## Github Organization's link: 
https://github.com/DatabaseApplication-Group8 

#### 1. Install Database Server using Docker
(You can install MySQL Community Server and MongoDB Community Server as an alternative for the below approach)
Follow the Docker installation instructions specific to your operating system from the Docker website (https://www.docker.com/)

Run docker command
- Install Database Servers:
mysql:
```bash
$ docker run --name server-isys2099 -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mysql
```
mongodb: 
```bash
$ docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=group8 -e MONGO_INITDB_ROOT_PASSWORD=1234  --name mongo-isys2099 mongo
```

- Insert SQL script from file "db_isys2099_source.sql" from the backend source:

#### 3. Open Backend Folder
(you can clone it from our repository)

- Clone Repository:
    git clone https://github.com/DatabaseApplication-Group8/isys2099_backend.git
    cd isys2099_backend

- Initialise prisma: 
    npx prisma db pull
    npx prisma generate

- Start server: npm run start:dev

#### 4. Open Frontend Folder
- Clone Repository:
    git clone https://github.com/DatabaseApplication-Group8/isys2099_frontend.git
    cd isys2099_frontend

- Install packages: npm i

- Start server: npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to the home of Hospital Management System

## Supported Libraries:
1. FontAwesome
2. Axios 
3. Tailwind
