from flask import Flask, request, redirect, url_for, jsonify, send_file,make_response,send_from_directory
import mysql.connector
import requests
import json
import random
import bcrypt

from flask_cors import CORS
from mysql.connector import Error
from Class_prepareApiFiles import PrepareApiFiles
from prepareZipFolder import PrepareZipFolder

import os
import urllib.request
from werkzeug.utils import secure_filename
import pandas as pd
import re
from sqlalchemy import create_engine
from tablib import Dataset
import datetime




app = Flask(__name__, static_url_path='/static')
CORS(app)


app.secret_key = "secret key"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['xlsx', 'sql'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


datatypes = {
    "String" : "VARCHAR(255)",
    "Int" : "INT",
    "Boolean" : "BINARY",
    "Float": "FLOAT",
    "Date" : "DATE",
    "DateTime" : "DATETIME"
}


@app.route('/')
def hello():
    return "Welcome to EBaaS Backend Service in Python"



############################# USER OPERATIONS ################################################


@app.route('/login',methods=["POST"])
def userLogin():
    req_data = request.get_json()
    resp_data = {}
    emailid = req_data['emailid']
    password = req_data['password']
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        cursor.execute("SELECT * FROM USER WHERE emailid=\""+emailid+"\"" )
        result = cursor.fetchall();
        if(len(result)==0):
            return make_response({"error":"Invalid Email"},
                         500)
        else:
            row = result[0]
            if(bcrypt.checkpw(password.encode('utf-8'),row[2].encode('utf-8'))):
                resp_data["id"]=row[0]
                resp_data["emailid"]=row[1]
                resp_data["name"]=row[3]
                resp_data["country"]=row[4]
                resp_data["organisation"]=row[5] 
                return make_response(jsonify(resp_data),
                         200)
            else:
                return make_response({"error":"Invalid Password"},
                         500)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)

@app.route('/register',methods=["POST"])
def userRegister():
    req_data = request.get_json()
    emailid = req_data['emailid']
    password = req_data['password']
    name = req_data['name']
    encodedPassword = password.encode('utf-8')
    encodedPassword = bcrypt.hashpw(encodedPassword,bcrypt.gensalt())
    password = encodedPassword.decode('utf-8')
    print("hashed pwd is: ",password)

    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        cursor.execute("SELECT COUNT(emailid) FROM USER WHERE emailid=\""+emailid+"\"")
        result = cursor.fetchone();
        print(result[0])
        if(result[0]):
            return make_response({"error":"Email Already Exists"},
                         500)
        else:
            print("inside else")
            cursor.execute("INSERT INTO USER(emailid,password,name) VALUES(\""+emailid+"\",\""+password+"\",\""+name+"\")")
            mydb.commit()
            return make_response({"msg":"Registered Successfully"},
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)
        
############################# APPLICATION OPERATIONS ################################################
@app.route('/application',methods=['POST'])
def create_app():
    req_data = request.get_json()
    userid = req_data['userid']
    name = req_data["name"]
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        cursor.execute("INSERT INTO application(userid,name) VALUES(\""+userid+"\",\""+name+"\")")
        mydb.commit()
        return make_response({"msg":"New Application Created"},
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)

@app.route('/application/user/<userid>',methods=['GET'])
def get_users_app(userid):
    resp_data = []
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        cursor.execute("SELECT * FROM application where userid="+userid)
        result = cursor.fetchall()
        for row in result:
            temp = {}
            temp["id"] = row[0]
            temp["userid"] = row[1]
            temp["name"] = row[2]
            temp["description"] = row[3]
            temp["server"] = row[4]
            temp["launched"] = row[5]
            resp_data.append(temp)
        return make_response(jsonify(resp_data),
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)

@app.route('/application/<id>',methods=['GET'])
def get_app(id):
    resp_data = {}
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        cursor.execute("SELECT * FROM application where id="+id)
        result = cursor.fetchone()            
        resp_data["id"] = result[0]
        resp_data["userid"] = result[1]
        resp_data["name"] = result[2]
        resp_data["description"] = result[3]
        resp_data["server"] = result[4]
        resp_data["launched"] = result[5]
        resp_data["created_on"] = result[6]
        resp_data["launched_on"] = result[7]
        return make_response(jsonify(resp_data),
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


@app.route('/application/<id>',methods=['PUT'])
def edit_app(id):
    resp_data = {}
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas",
            autocommit=True
            )
        cursor = mydb.cursor()
        now = datetime.datetime.now()
        print ("Current date and time : ")
        print (now.strftime("%Y-%m-%d %H:%M:%S"))
        print('UPDATE application SET launched = 1, launched_on = "'+now.strftime("%Y-%m-%d %H:%M:%S")+'" WHERE id='+id)
        cursor.execute('UPDATE application SET launched = TRUE, launched_on = "'+now.strftime("%Y-%m-%d %H:%M:%S")+'" WHERE id='+id)
        # cursor.execute('UPDATE application SET launched_on = "'+now.strftime("%Y-%m-%d %H:%M:%S")+'" WHERE id='+id)
        mydb.commit()
        print(cursor.rowcount)
        return make_response(jsonify("Updated Successfully"),
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


@app.route('/launch',methods=['POST'])
def launch_app():
    req_data = request.get_json()
    project = req_data['project']
    print("Got the project name: ",project)
    hostname = req_data['hostname']
    username = req_data['username']
    password = req_data['password']
    database = req_data['database']
    try:
        script = PrepareApiFiles(project,hostname,username,password,database)
        print("Till here everything is fine")
        script.creatingApiFiles()
        print("function called")
        resp_obj = "Hello this is posting for "+project
        return make_response({"msg":"Application Launched"},
                         200)
    except Exception as e:
        print ("some error: ",e.__str__())
        return make_response({"error":e.__str__()},
                         500)


@app.route('/zip/<project>',methods=['POST'])
def zip_app(project):
    # req_data = request.get_json()
    # project = request.args['project']
    print("Got the project name: ",project)
    try:
        zipObject = PrepareZipFolder('./static/'+project+"/")
        print("Till here everything is fine")
        zipObject.zip(project)
        print("function called")
        resp_obj = "Hello this is zipping for "+project
        return make_response({"msg":"Launched Application Zipped"},
                         200)
    except Exception as e:
        print ("some error")
        return make_response({"error":e.__str__()},
                         500)

@app.route('/zip/<project>',methods=['GET'])
def get_zip_app(project):
    # req_data = request.get_json()
    # project = request.args['project']
    print("Got the project name: ",project)
    try:
        return send_from_directory('./static/', project+'.zip', as_attachment=True)
    except Exception as e:
        print ("some error")
        return make_response({"error":e.__str__()},
                         500)

############################# DATABASE OPERATIONS ################################################
@app.route('/database',methods=['POST'])
def save_database_details():
    data = request.get_json()
    userid = data["userid"]
    applicationid = data["applicationid"]
    connectionname = data["connectionname"]
    hostname=data["hostname"]
    username=data["username"]
    password=data["password"]
    dbname=data["database"]
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        print(type(userid))
        print(type(applicationid))
        print(type(connectionname))
        print(hostname)
        print(username)
        print(password)
        print(dbname)
        str = "INSERT INTO user_databases(userid,applicationid,connectionname,hostname,username,password,dbname) VALUES("+userid + ","+applicationid+",\""+connectionname+"\",\""+hostname+"\",\""+username+"\",\""+password+"\",\""+dbname+"\")"
        print("sql string is: ",str)
        cursor.execute("INSERT INTO user_databases(userid,applicationid,connectionname,hostname,username,password,dbname) VALUES("+userid + ","+applicationid+",\""+connectionname+"\",\""+hostname+"\",\""+username+"\",\""+password+"\",\""+dbname+"\")")
        mydb.commit()
        return make_response({"msg":"Database Saved"},
                         200)
    except Exception as e:
        print("Error while adding a user database")
        print(e)
        return make_response({"error":e.__str__()},
                         500)

@app.route('/database/<id>',methods=['GET'])
def get_database_details(id):
    resp_data = {}
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        cursor.execute("SELECT * FROM user_databases where id="+id)
        result = cursor.fetchone()
        resp_data["id"] = result[0]
        resp_data["userid"] = result[1]
        resp_data["applicationid"] = result[2]
        resp_data["connectionname"] = result[3]
        resp_data["hostname"] = result[4]
        resp_data["username"] = result[5]
        resp_data["password"] = result[6]
        resp_data["dbname"] = result[7]
        return make_response(jsonify(resp_data),
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


@app.route('/database/user/<userid>',methods=['GET'])
def get_user_databases(userid):
    resp_data = []
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        cursor.execute("SELECT * FROM user_databases where userid="+userid)
        result = cursor.fetchall()
        for row in result:
            temp = {}
            temp["id"] = row[0]
            temp["userid"] = row[1]
            temp["applicationid"] = row[2]
            temp["connectionname"] = row[3]
            temp["hostname"] = row[4]
            temp["username"] = row[5]
            temp["password"] = row[6]
            temp["dbname"] = row[7]
            resp_data.append(temp)
        return make_response(jsonify(resp_data),
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


@app.route('/database/application/<applicationid>',methods=['GET'])
def get_application_databases(applicationid):
    resp_data = []
    try:
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="ebaas"
            )
        cursor = mydb.cursor()
        cursor.execute("SELECT * FROM user_databases where applicationid="+applicationid)
        result = cursor.fetchall()
        for row in result:
            temp = {}
            temp["id"] = row[0]
            temp["userid"] = row[1]
            temp["applicationid"] = row[2]
            temp["connectionname"] = row[3]
            temp["hostname"] = row[4]
            temp["username"] = row[5]
            temp["password"] = row[6]
            temp["dbname"] = row[7]
            resp_data.append(temp)
        return make_response(jsonify(resp_data),
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)

@app.route('/connectToDatabase', methods=['POST'])
def connectToDatabase():
    data = request.json
  
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        return make_response({"msg":"Connection Established"},
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


@app.route('/excel-upload/<databasename>', methods=['POST'])
def upload_excel(databasename):
    file = request.files['file']
    hostname = request.form.get('hostname')
    username = request.form.get('username')
    password = request.form.get('password')
    try:
        filename = secure_filename(file.filename)
        path = os.path.join('./uploads/', filename)
        file.save(os.path.join('./uploads/', filename))
        df = pd.ExcelFile(file)
        sn = df.sheet_names
        engine = create_engine('mysql://'+username+':'+password+'@'+hostname+'/'+databasename)
        for s in sn:
            a  = pd.read_excel(file ,sheet_name= s, header= 0) 
            with engine.connect() as conn, conn.begin():
                a.to_sql(name=s, con=conn, if_exists= 'replace')
         
        if os.path.exists(path):
            os.remove(path)
        else:
            print("The file does not exist")

        return make_response({"msg":"File successfully uploaded"},
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


@app.route('/sql-upload/<databasename>', methods=['POST'])
def upload_sql(databasename):
    file = request.files['file']
    hostname = request.form.get('hostname')
    username = request.form.get('username')
    password = request.form.get('password')

    try:
        filename = secure_filename(file.filename)
        path = os.path.join('./uploads/', filename)
        file.save(os.path.join('./uploads/', filename))
        cnx = mysql.connector.connect(user= username , password= password, host= hostname, database=databasename)
        cursor = cnx.cursor()
        fd = open('./uploads/'+filename, 'r')
        sqlFile = fd.read()
        fd.close()
        sqlCommands = sqlFile.split(';')
        for command in sqlCommands:
            try:
                if command.rstrip() != '':
                    cursor.execute(command)
            except ValueError as msg:
                print ("Command skipped: ", msg)
        if os.path.exists(path):
            os.remove(path)
        else:
            print("The file does not exist")
        return make_response({"msg":"File successfully uploaded"},
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


# @app.route('/file-upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         resp = jsonify({'message' : 'No file part in the request'})
#         resp.status_code = 400
#         return resp
#     file = request.files['file']
#     if file.filename == '':
#         resp = jsonify({'message' : 'No file selected for uploading'})
#         resp.status_code = 400
#         return resp
#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         file.save(os.path.join('./uploads/', filename))
#         df = pd.ExcelFile(file)
#         sn = df.sheet_names
#         engine = create_engine('mysql://admin:admin@localhost/test')
#         for s in sn:
#             a  = pd.read_excel(file ,sheet_name= s, header= 0) 
#             with engine.connect() as conn, conn.begin():
#                 a.to_sql(name=s, con=conn, if_exists= 'replace')
#         resp = jsonify({'message' : 'File successfully uploaded'})
#         resp.status_code = 201
#         return resp
#     else:
#         resp = jsonify({'message' : 'Allowed file types are xlsx and sql'})
#         resp.status_code = 400
#         return resp



@app.route('/createDatabase', methods=['POST'])
def createDatabase():
    data = request.json
    print("My Data:::::::::::::",data)
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"]
            )
        cursor = mydb.cursor()
        cursor.execute("CREATE DATABASE " + data["database"])
        return make_response({"msg":"Database Created"},
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)
    
@app.route('/createTable', methods=['POST'])
def createTable():
    data = request.json
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        tables = data["tables"]
        for table in tables:
            cursor.execute("CREATE TABLE " + table["name"] +" (id INT AUTO_INCREMENT PRIMARY KEY)")
        return make_response({"msg":"Tables Created Successfully"},
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)

@app.route('/addColumn', methods=['POST'])
def addColumnToTable():
    data = request.json
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        columns = data["columns"]
        for column in columns:
            cursor.execute("ALTER TABLE " + data["tableName"] + " ADD COLUMN " + column["name"] + " " + datatypes[column["type"]])
        return make_response({"msg":"Columns Added Successfully"},
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


@app.route('/getInformation', methods=['POST'])
def getTableInformation():
    data = request.json
    resp_data = {}
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        cursor.execute("SELECT DISTINCT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA LIKE \'%" +data["database"] +"%\'")
        result = cursor.fetchall()
        print("result is: ",result)
        for row in result:
            resp_data[row[0]] = []
        for row in result:
            resp_data[row[0]].append(row[1])
        print("resp_data is: ",resp_data)
        return make_response(jsonify(resp_data),
                         200)

    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)


@app.route('/deleteTable', methods=['POST'])
def deleteTable():
    data = request.json
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        cursor.execute("DROP TABLE IF EXISTS " + data["tableName"])
        return make_response(jsonify("Table Deleted Successfully"),
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)

@app.route('/deleteColumn', methods=['POST'])
def deleteColumn():
    data = request.json
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        cursor.execute("ALTER TABLE " + data["tableName"] + " DROP " + data["columnName"])
        mydb.commit()
        return make_response(jsonify("Table Updated Successfully"),
                         200)
    except Exception as e:
        return "Got exception " + str(e), 500

@app.route('/addRelationShip', methods=['POST'])
def addRelationShip():
    data = request.json
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        print("ALTER TABLE " + data["table1"] + " ADD CONSTRAINT Fk_"+data["table1"]+"_"+data["ForeignKeyName"]+"_"+data["table2"]+" FOREIGN KEY (" + data["ForeignKeyName"] + ") REFERENCES "+ data["table2"]+"(" + data["table2Column"] +")")
        cursor.execute("ALTER TABLE " + data["table1"] + " ADD CONSTRAINT Fk_"+data["table1"]+"_"+data["ForeignKeyName"]+"_"+data["table2"]+" FOREIGN KEY (" + data["ForeignKeyName"] + ") REFERENCES "+ data["table2"]+"(" + data["table2Column"] +")")
        return make_response(jsonify("Relationship added succesfully"),
                         200)
    except Exception as e:
        print(e.__str__())
        return make_response({"error":e.__str__()},
                         500)

@app.route('/dropRelationShip', methods=['POST'])
def dropRelationShip():
    data = request.json
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        cursor.execute("ALTER TABLE " + data["table1"] + " DROP  FOREIGN KEY Fk_" + data["table1"] + data["tabel2"])
        return make_response(jsonify("Relationship dropped and table altered"),
                         200)
    except Exception as e:
        return make_response({"error":e.__str__()},
                         500)

if __name__ == '__main__':
    app.run(host='0.0.0.0')