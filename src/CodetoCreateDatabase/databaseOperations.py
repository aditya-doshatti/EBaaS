import mysql.connector
from flask import Flask, request, jsonify

app = Flask(__name__)
app.run()

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
    except e:
        return "Got Exception"  + e

@app.route('/connectToDatabase', methods=['POST'])
def connectToDatabase():
    data = request.json
    requestBody = jsonify(data)
    try:
        cursor = databaseCursor(requestBody)
        return "Connection Successful"
    except e:
        return "Got Exception"  + e

@app.route('/createDatabase', methods=['POST'])
def createDatase():
    data = request.json
    requestBody = jsonify(data)
    try:
        cursor = databaseCursor(requestBody)
        cursor.execute("CREATE DATABASE " + requestBody["database"])
        return "Database creation Successful"
    except e:
        return "Got Exception"  + e
    
@app.route('/createTable', methods=['POST'])
def createTable():
    data = request.json
    requestBody = jsonify(data)
    cursor = databaseCursor(requestBody)
    cursor.execute("CREATE TABLE " + requestBody["tableName"] +" (id INT AUTO_INCREMENT PRIMARY KEY)")

@app.route('/addColumn', methods=['POST'])
def addColumnToTable():
    data = request.json
    requestBody = jsonify(data)
    cursor = databaseCursor(requestBody)
    cursor.execute("ALTER TABLE " + requestBody["tableName"] + " ADD COLUMN " + requestBody["column"] + " " + datatypes[requestBody["datatype"]])

@app.route('/deleteTable', methods=['POST'])
def deleteTable(cursor, tableName):
    data = request.json
    requestBody = jsonify(data)
    cursor = databaseCursor(requestBody)
    cursor.execute("DROP TABLE IF EXISTS" + requestBody["tableName"])