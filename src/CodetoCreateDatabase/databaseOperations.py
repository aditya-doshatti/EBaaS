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
    try:
        mydb = mysql.connector.connect(
            host=data["hostname"],
            user=data["username"],
            passwd=data["password"],
            database=data["database"]
            )
        cursor = mydb.cursor()
        return "Connection established"
    except Exception as e:
        return "Got exception", e

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
        return "Got exception " + str(e), 500
    
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
        return "Got exception " + str(e), 500

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
        return "Columns added successfuly"
    except Exception as e:
        return "Got exception " + str(e), 500 

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
        return "Got exception " + str(e), 500

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
        return resp_data

    except Exception as e:
        return "Got exception " + str(e), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0')