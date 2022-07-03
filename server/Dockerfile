FROM node:16-alpine

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

COPY prisma ./prisma/

COPY .env ./

COPY tsconfig.json ./

COPY . .

RUN npm i

RUN npx prisma generate


EXPOSE 5050

CMD ["npm", "run", "start"]