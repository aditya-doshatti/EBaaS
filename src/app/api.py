from flask import Flask, request, redirect, url_for, jsonify, send_file
import requests
import json
import random
from flask_cors import CORS
from Class_prepareApiFiles import PrepareApiFiles
from prepareZipFolder import PrepareZipFolder
app = Flask(__name__, static_url_path='/static')
CORS(app)

@app.route('/')
def hello():
    return "Welcome to EBaaS Backend Service in Python"


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
        return jsonify(resp_obj)
    except:
        print ("some error")
        return "failed due to error",500


@app.route('/zip',methods=['POST'])
def zip_app():
    req_data = request.get_json()
    project = request.args['project']
    print("Got the project name: ",project)
    try:
        zipObject = PrepareZipFolder('../'+project)
        print("Till here everything is fine")
        zipObject.zip(project)
        print("function called")
        resp_obj = "Hello this is zipping for "+project
        return jsonify(resp_obj)
    except:
        print ("some error")
        return "failed due to error",500

if __name__ == '__main__':
    app.run(host='0.0.0.0')