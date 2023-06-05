FROM node:17-alpine
COPY src /src
WORKDIR /src

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN apk update && apk upgrade
RUN apk add chromium 
RUN npm install express puppeteer --registry=https://registry.npmmirror.com/

EXPOSE 3000

CMD ["node", "server.js"]
