FROM node:9-slim

RUN apt-get update || : && apt-get install -y \
    python3.4 \
    python3-pip

WORKDIR /app
COPY ./app /app
RUN pip3 install mysql-connector-python
RUN python3 prepareApifiles.py
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
