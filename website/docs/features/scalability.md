---
sidebar_position: 5
---

# Scalability

Cromwell CMS is designed to be scalable. CMS consists of three independent services which could be deployed separately.
You see more info about services in [development document](https://github.com/CromwellCMS/Cromwell/tree/master/system).

By default command `npx cromwell start` will launch all services, but it's possible to launch services independently via CLI.

- Run `npx crw s --sv s` to start API server.
- Run `npx crw s --sv r` to start Next.js server.
- Run `npx crw s --sv s` to start admin panel server.

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
For heavily loaded websites you will need to distribute traffic between instances on multiple machines. 


Using [Nginx load-balancer](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/) you need to modify Nginx config to enable Round Robin method:
```diff title="diff: nginx.conf"
 http {
   upstream api {
-    server 127.0.0.1:4016;
+    server srv1.example.com;
+    server srv2.example.com;
   }
```

:::note
If any service cannot be found at default location, you need to provide a URL to it in the config, so other services will know where to find it. As in the example above, Next.js will still look for API server at default `http://localhost:4016`. To fix the issue specify `apiUrl` in the [cmsconfig.json](/docs/overview/configuration#config-options).
In example with load balancing, you need to set public address of Nginx webserver. 
:::

Another thing you need to do is to configure authentication. Data requests from Next.js server contain a token in headers, so API server can serve private data (settings of Plugins configured in admin panel may contain API tokens for integrated services: Stripe, etc, so it is protected by authentication). For authentication to work you need to place `cmsconfig.json` with the same value of `serviceSecret` as described in [configuration doc](/docs/overview/configuration#config-options).  

Same instruction can be applied to Next.js server. 


### Caveats

For now, there are two limitations with load balancing setup:

1. Admin cannot install plugins in GUI. Since a request to install a Plugin will be processed by only one server in a group, other servers will not have installed this Plugin. It can be solved by installing Plugins in terminal via `npm install`.
2. Uploaded content via file manager GUI will appear in public directories of only one serve. For now solution is the same as before: copy public content across servers manually.  
In future updates we're planning to implement distributing API, so public content will be copied over all servers specified in config.