js
framework - Next js
code - typescript 
tsx,ts -> typecode jsx,js - jsvascript
[
default files -
next.config.mjs
next-env.d.ts
The .eslintrc.json file is a configuration file for ESLint, which is a popular JavaScript/TypeScript linting tool.
package.json -> package-lock json [description of dependedcies installed], node modules [dir where dependencies are insatll, ]
postcss.config.mjs is the configuration file for PostCSS, a tool used in modern front-end builds (like Next.js, Vite, or CRA) to process your CSS after you write it.

tsconfig.json -> makes sure ts config runs in src path

]
db - mongodb
catching - redis

locally run - docker


DOCKER CONTAINERS
ragaai_user@aadarsh CodeSensei % docker-compose up
WARN[0000] /Users/ragaai_user/github/CodeSensei/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 4/4
 ✔ Container codesensei-mongo-1          Running                                                                                                                                                    0.0s 
 ✔ Container codesensei-redis-1          Running                                                                                                                                                    0.0s 
 ✔ Container codesensei-mongo-express-1  Running                                                                                                                                                    0.0s 
 ✔ Container codesensei-app-1            Running    

dockerfile helps to create container images of app -> then we run these images
Docker compose.yaml [/Users/ragaai_user/github/CodeSensei/docker-compose.yml]

docker compose is used to run multi container application - [mongo , redis, app]

.env -> environment var
- mongodb or redis urls
- GEMINI API KEY
- piston api -> Provides compiler to compile dsa code 


mongo-express - is ui for mongodb 


2 -> Docker way
code -> Dockerfile -> it creates create image 
Dockerfile -> image -> container [PORT]

mongo-init -> initialize db 



MAIN APP CODE -

.NEXT -> NPM I this will be created contains next build details , cahe, and all stuff build related

/PUBLIC -
ASSETS - IMAGES 

/SRC -

/app
API 

api.ts -
This code generates and manages coding questions dynamically. It first fetches user interest topics (from cache or API), then asks an AI service to create a question based on a random topic and difficulty. If AI fails, it uses predefined fallback questions. It can also execute code using the Piston API. The system caches questions and topics for faster performance, saves generated questions to a backend API, and measures performance for each major task.



/components -> /ui
CODE FOR COMPONENTS - BUTTONS, SHEET , BADGE, CARD 


/lib