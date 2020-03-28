import mysql.connector
from flask import Flask, request, jsonify
from mysql.connector import Error
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

datatypes = {
    "String" : "VARCHAR(255)",
    "Int" : "INT",
    "Boolean" : "BINARY",
    "Float": "FLOAT",
    "Date" : "DATE",
    "DateTime" : "DATETIME"
}

def databaseServerCursor(requestBody):
    mydb = mysql.connector.connect(
    host=requestBody["host"],
    user=requestBody["username"],
    passwd=requestBody["password"]
    )
    mycursor = mydb.cursor()
    return mycursor

def databaseCursor(requestBody):
    mydb = mysql.connector.connect(
    host=requestBody["host"],
    user=requestBody["username"],
    passwd=requestBody["password"],
    database=requestBody["database"]
    )
    mycursor = mydb.cursor()
    return mycursor

@app.route('/connectToServer', methods=['POST'])
def connectToServer():
    data = request.json
    requestBody = jsonify(data)
    try:
        mycursor = databaseCursor(requestBody)
        return "Connection Successful"
    except:
        return "Got Exception"

@app.route('/connectToDatabase', methods=['POST'])
def connectToDatabase():
    data = request.json
    # requestBody = jsonify(data)
    # print("Json body: ",requestBody,data)
    try:
        cursor = databaseCursor(data)
        return "Connection Successful"
    except Error as e:
        return "Got Exception" + e

@app.route('/createDatabase', methods=['POST'])
def createDatabase():
    data = request.json
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"]
            )
        cursor = mydb.cursor()
        cursor.execute("CREATE DATABASE " + data["database"])
        return "Database created successfully"
    except Exception as e:
        return "Got exception", e
    
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
        return "Tables created successfuly"
    except Exception as e:
        return "Got exception", e

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
        cursor.execute("ALTER TABLE " + data["tableName"] + " ADD COLUMN " + data["column"] + " " + datatypes[data["datatype"]])
        return "Table created successfuly"
    except Exception as e:
        return "Got exception", e

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
        return "Table deleted successfuly"
    except Exception as e:
        return "Got exception", e

if __name__ == '__main__':
    app.run(host='0.0.0.0')