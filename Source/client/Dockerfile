FROM node:22-alpine

WORKDIR /app
COPY pakage*.json .
RUN npm install
COPY . .
EXPOSE 5173

CMD ["npm","run","dev"]