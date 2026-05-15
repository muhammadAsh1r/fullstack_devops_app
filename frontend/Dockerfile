FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Expose host to allow access from outside the container
CMD ["npm", "run", "dev"]
