FROM node:9-slim

RUN apt-get update || : && apt-get install -y \
    python3.4 \
    python3-pip

COPY . /.
WORKDIR /app
RUN pip3 install mysql-connector-python
RUN npm install -g mysql
RUN npm install -g sequelize-auto
RUN npm install
EXPOSE 3000
RUN chmod +x start.sh
CMD ["sh", "start.sh"]
