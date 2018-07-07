FROM node:latest

WORKDIR /frontend
COPY package*.json ./
RUN npm install --no-progress --ignore-optional
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]