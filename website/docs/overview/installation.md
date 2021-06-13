---
sidebar_position: 2
---

# Installation

There are multiple ways of how to install and run the CMS

## 1. Docker single container
For most use-cases the recommended way is to to run the CMS insde a Docker container. Our image goes with already installed MariaDB and Nginx, so you only need to install Docker on your OS.
[You can install Docker on Windows, Linux or other supported platform](https://docs.docker.com/engine/install/)

After installation run a single command in your terminal / command prompt to create and run a container:
```sh
docker run -d -p 80:80 --name my-website cromwell:latest
```
Open http://127.0.0.1/ if you installed locally or your web-server IP adress in a web browser. For the fist time it needs to run some configuration scripts, so it will be up and running under one minute    
Open http://127.0.0.1/admin to see admin panel.  

Stop the container: 
```
docker stop my-website
```

Run again:
```
docker start my-website
```


## 2. Docker compose

For more advanced usage and more granular control you can configure your docker compose file. For this scenario we have another image which contains CMS and Nginx, without database.  

Create a new directory and place in it docker-compose.yml file with the following content: 
```yml title="docker-compose.yml"
version: "3"
services:

  db:
    image: mariadb:latest
    container_name: mariadb_container
    volumes: 
      - ./db_data:/var/lib/mysql
    ports:
      - 3306:3306
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: cromwell
      MYSQL_USER: cromwell
      MYSQL_PASSWORD: somepassword

  phpmyadmin:
    depends_on:
      - db
    image: phpmyadmin/phpmyadmin
    container_name: phpadmin_container
    environment:
      PMA_HOST: db
    links:
      - db:db
    ports:
      - 8081:80
    restart: unless-stopped

  cromwell:
    image: cromwell:latest
    container_name: cromwell_container
    depends_on:
      - db
    volumes:
      - ./nginx:/app/nginx
      - ./public:/app/public
      - ./.cromwell/server:/app/.cromwell/server
      - ./.cromwell/logs:/app/.cromwell/logs
    ports:
      - 8080:80
    restart: unless-stopped
    environment:
      DB_TYPE: mariadb
      DB_HOST: db
      DB_PORT: 3306
      DB_DATABASE: cromwell
      DB_USER: cromwell
      DB_PASSWORD: somepassword
```

Apart of Cromwell CMS the file configures MariaDB and phpMyAdmin to run in separate containers.  
Another key feature is that it has volumes, so all data will be stored in your current directory, outside of Docker containers. Now you can safely remove containers or images and keep all the data.  

Before start, place your password in environment variables: MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD, DB_PASSWORD.  
MYSQL_PASSWORD and DB_PASSWORD must have the same value  

Start all services:
```sh
docker-compose up -d
```

Open http://127.0.0.1/ in a web browser to see your web site.   
Open http://127.0.0.1/admin to see admin panel.  
Open http://127.0.0.1:8081 to see phpMyAdmin. 

As you can see in your current directory appeared new files:
- Database will be stored in "db_data"  
- Images and other files updloaded via file manager in "public"  
- CMS logs in ".cromwell/logs"  
- CMS e-mailing templates in ".cromwell/server/emails"  
- Nginx settings in "nginx"  

For example, if you want to change HTML template that sends to your customers when they place a new order in your store you can modify file at .cromwell/server/emails/order.html  

If you want to edit Nginx settings such as add SLL (https), you need to edit nginx/nginx.conf and restart container with CMS.


## 3. NPM

Since CMS is a set of packages, you can simply install them via npm.  
First download and install latest Node.js v14 from https://nodejs.org/en/  

Create a new directory and open terminal / command prompt
```sh
cd /path/to/your/dir
```

Run init command to create a new project:
```sh
npm init
```

Install the CMS:
```sh
npm i @cromwell/cms --save-exact
```

You also can specify what themes and plugins your want to use. Usually we install following by default (but you also will be able to install them later in the admin panel):
```sh
npm i @cromwell/theme-store @cromwell/theme-blog @cromwell/plugin-main-menu @cromwell/plugin-newsletter @cromwell/plugin-product-filter @cromwell/plugin-product-showcase --save-exact
```

Run the CMS:
```sh
npx cromwell start -d
```

Open [`http://localhost:4016`](http://localhost:4016) in a web browser to see your web site.  

In this example we do not launch a proxy server (Nginx) or a database service, but Cromwell CMS can work without them. As well as without any config.  
The CMS has its Node.js proxy to manage traffic to API server, Next.js server and admin panel.  
And if there's no config provided CMS will create and use a new SQLite database in ./.cromwell/server/db.sqlite3  

** Note that SQLite is not supported by us for production usage! ** You still can use it for preview or development but later you must switch to MySQL/MariaDB/PostgreSQL.  
If you try to upgrade CMS to a new version with SQLite in future, system can possibly crash.

