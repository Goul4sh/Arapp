FROM node:22-alpine
LABEL authors="goul4sh"

WORKDIR /app

COPY . .
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]