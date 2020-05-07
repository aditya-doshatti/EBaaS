FROM nikolaik/python-nodejs

RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN pip install mysql-connector-python
RUN pip install flask
RUN pip install flask_cors
RUN pip install pandas
RUN pip install bcrypt
RUN pip install requests
RUN pip install sqlalchemy
RUN pip install tablib
RUN npm install -g sequelize-auto
RUN npm install -g mysql
RUN npm install -g express-generator
RUN npm install
EXPOSE 5000
#RUN chmod +x start.sh
CMD ["python", "api.py"]
