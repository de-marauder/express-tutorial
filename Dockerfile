FROM node:alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .
# ENV DATABASE_URL=mongodb+srv://de-marauder:qhv9qaHFbsF1Bkjp@zombrary.8rod4.mongodb.net/?retryWrites=true&w=majority
EXPOSE 5000

CMD ["npm", "run", "devStart"]
