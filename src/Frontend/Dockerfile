FROM node:13.12.0-alpine


RUN mkdir /app
COPY . /app/
WORKDIR /app

RUN npm install --silent
# RUN npm install react-scripts@3.4.1 -g --silent

ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 3000
# start app
CMD ["npm", "start"]