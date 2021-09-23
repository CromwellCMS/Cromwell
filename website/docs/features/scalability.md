---
sidebar_position: 5
---

# Deployment and Scalability

Cromwell CMS is designed to be scalable. CMS consists of three independent services which could be deployed separately.
You can see more info about services in [development document](https://github.com/CromwellCMS/Cromwell/tree/master/system).

By default command `npx cromwell start` will launch all three services, but it's possible to launch services independently via CLI.

- Run `npx crw s --sv s` to start API server.
- Run `npx crw s --sv r` to start Next.js server.
- Run `npx crw s --sv s` to start admin panel server.

## Deployment

Install Nginx and place default config at `/etc/nginx/nginx.conf` to proxy CMS services and serve static files:
```nginx title="nginx.conf"
worker_processes 5;
worker_rlimit_nofile 8192;

events {
    worker_connections 4096;
}

http {
  upstream api {
    server 127.0.0.1:4016;
  }

  upstream admin {
    server 127.0.0.1:4064;
  }

  upstream nextjs {
    server 127.0.0.1:4128;
  }

  server {
    listen 80;
    listen [::]:80;

    absolute_redirect off;
    root /path/to/your/project/;

    location / {
      try_files /public/$uri @frontend;
    }

    location /bundled-modules/ {
      try_files /.cromwell/$uri =404;
    }

    location @frontend {
      proxy_pass http://nextjs;
      add_header X-Frame-Options SAMEORIGIN;
      add_header X-Content-Type-Options nosniff;
      add_header X-XSS-Protection "1; mode=block";
    }

    location /api/ {
      add_header 'Access-Control-Allow-Credentials' 'true';
      proxy_hide_header 'Access-Control-Allow-Origin';
      add_header 'Access-Control-Allow-Origin' "$host";

      proxy_pass http://api;
      default_type application/json;
    }

    location /admin {
      proxy_pass http://admin;
      add_header X-Frame-Options SAMEORIGIN;
      add_header X-Content-Type-Options nosniff;
      add_header X-XSS-Protection "1; mode=block";
    }
  }
}
```
Replace root path by your path to the project.

## Load balancing
For heavily loaded websites you will need to distribute traffic between instances on multiple machines. Even if it's not the case for you, it is still recommended to do if you have enough RAM on you server. It will provide higher fault-tolerance (in case if one server goes down).  

For group of server to work together in load balancing we need to make proper configurations.  
In this example let's configure multiple instances of API server.

#### 1. Create and run projects on all machines
Run `npx @cromwell/cli create my-website-name`. Connect to a database server, as in [configuration guide](/docs/overview/configuration#nodejs)

#### 2. Provide URL to server group

If any CMS service cannot be found at default location, you need to provide a URL to it in the config, so other services will know where to find it. As in the example, Next.js server will still look for API server at default `http://localhost:4016`. To fix the issue specify `apiUrl` in the [cmsconfig.json](/docs/overview/configuration#config-options).
In example with load balancing, you need to set public address of Nginx webserver. Place this config on machines with other services, such as Next.js or Admin panel.
If you configured Nginx with your domain, and you planning for it to do load-balancing then:
```diff title="diff: cmsconfig.json"
 {
+  "apiUrl": "example.com",
   "orm": {
```

#### 3. Setup interservice authentication

Data requests from Next.js server contain a token in headers, so API server can serve private data (settings of Plugins configured in admin panel may contain secret API tokens for integrated services: Stripe, etc, so it is protected by authentication). For authentication to work you need to add `serviceSecret` in `cmsconfig.json` as described in [configuration doc](/docs/overview/configuration#config-options).  

```diff title="diff: cmsconfig.json"
 {
   "apiUrl": "example.com",
+  "serviceSecret": "your-secret",
   "orm": {
```

Place this config on all machines


#### 4. User authentication

User authentication, such as in Admin panel, works via JWT. This method requires to have same secrets on all machines with API server.

```diff title="diff: cmsconfig.json"
 {
   "apiUrl": "example.com",
   "serviceSecret": "your-secret",
+  "accessTokenSecret": "your-secret1",
+  "refreshTokenSecret": "your-secret2",
   "orm": {
```

#### 5. Run servers on all machines

Run `npx crw s --sv s` to launch only API server. First time you can launch it this way to see server logs and ensure there's no errors. To run the server in background add flag `-d` to start in detached from terminal mode: `npx crw s --sv s -d`.

#### 6. Configure load balancer

If you are decided to use [Nginx as load-balancer](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/) then you need to modify Nginx config to enable Round Robin method:
```diff title="diff: nginx.conf"
 http {
   upstream api {
-    server 127.0.0.1:4016;
+    server server1-address:4016;
+    server server2-address:4016;
   }
```


## Multiple instances on one machine

For smaller websites it also can be beneficial to set up load balancing on one machine if it has enough RAM. 2 GB or more can be sufficient. 

In one project just run servers on different ports with commands:
```sh
npx crw s --sv s -p 4016
npx crw s --sv s -p 4017
```
Edit Nginx config:
```diff title="diff: nginx.conf"
 http {
   upstream api {
     server 127.0.0.1:4016;
+    server 127.0.0.1:4017;
   }
```

Provide URL to the server group:
```diff title="diff: cmsconfig.json"
 {
+  "apiUrl": "example.com",
   "orm": {
```

No further configuration with tokens is required, since tokens will be synchronized inside one project.

## Caveats

For now, there are two limitations with load balancing setup:

1. Admin cannot install plugins in GUI. Since a request to install a Plugin will be processed by only one server in a group, other servers will not have installed this Plugin. It can be solved by installing Plugins in terminal via `npm install` on all machines.  
In future updates we are planning to distribute installation requests among a group to make automatic installation possible.
2. Uploaded content via file manager (Media) GUI will appear in the public directory of only one API server. For now solution is to copy public content across servers manually.  
Same as before, with distributing API, content can be copied over all servers specified in a config.


While full scaling support will be added natively later, there are other options available that solve the limitation above. 
For example, EFS and AWS Fargate. [See the introduction and an example of scaling with Wordpress](https://pages.awscloud.com/Modernize-Content-Management-Systems-with-EFS-and-AWS-Fargate_2021_0407-CON_OD.html)