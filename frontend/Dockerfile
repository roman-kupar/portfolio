FROM node:22-alpine
LABEL authors="Roman Kupar"

WORKDIR /app

COPY package.json package-lock.json ./

RUN rm package-lock.json && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]