FROM node:20.9.0-bullseye-slim
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm ci --only=production
USER node
ENV NODE_ENV production
EXPOSE 3000
CMD "bash" "run.sh"