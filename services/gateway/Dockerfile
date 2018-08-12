FROM node:8

WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 54321/udp
EXPOSE 1234/udp
CMD [ "npm", "start" ]