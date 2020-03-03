import mysql.connector
import argparse
import os
from mysql.connector import Error
'''
parser = argparse.ArgumentParser(description='Process some inputs.')
parser.add_argument('--hostname', action='store', dest='hostname', required=True, help='Hostname or ip address of database')
parser.add_argument('--username', action='store', dest='username', required=True,  help='Username of database')
parser.add_argument('--password', action='store', dest='password', required=False,  help='Password of database')
parser.add_argument('--database', action='store', dest='database', required=True,  help='Name of database')
# parser.add_argument('--table', action='store', dest='table', required=True,  help='Name of table')
args = parser.parse_args()
'''
hostname = os.environ['HOSTNAME']
database = os.environ['DATABASE']
username = os.environ['USERNAME']
password = os.environ['PASSWORD']

command_to_get_model_file = 'sequelize-auto --host ' + hostname+ ' \
                                            --database ' + database+ ' \
                                            --user ' + username+' \
                                            --pass ' + password+ ' --port 3306 \
                                            -C ./models/'
os.system(command_to_get_model_file)

# Editing config.json
lines = open('./config/configSkeleton.json', 'r').readlines()
lines[1] = '\t\"DB_HOSTNAME\" : \"' + hostname + '\", \n'
lines[2] = '\t\"DB_USERNAME\" : \"' + username + '\", \n'
lines[3] = '\t\"DB_PASSWORD\" : \"' + password + '\", \n'
lines[4] = '\t\"DB_PORT\" : \"3306\", \n'
lines[5] = '\t\"DB_NAME\" : \"' + database + '\" \n'
out = open('./config/config.json', 'w')
out.writelines(lines)
out.close()




try:
    connection = mysql.connector.connect(host=hostname,
                                         database=database,
                                         user=username,
                                         password=password)
    if connection.is_connected():
        
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        cursor = connection.cursor()
        cursor.execute("select database();")
        record1 = cursor.fetchone()
        print("You're connected to database: ", record1)

        
        cursor.execute("SHOW TABLES")
        record = cursor.fetchmany()
        print('List Of Tables: ')
        for (record,) in cursor:
            print(record)
            # Editing routes/skeleton file with the table name
            lines = open('./routes/skeleton.js', 'r').readlines()
            lines[5] = "var entity = Conn.import(__dirname + '/../models/"+record+".js'); \n"
            out = open('./routes/'+record+'.js', 'w')
            out.writelines(lines)
            out.close()

            contents = open('index.js','r').readlines()
            contents.insert(6,"var "+record+" = require('./routes/"+record+".js')\n")
            contents.insert(len(contents)-3,'app.use("/'+record+'",'+record+')\n')

            indexFile = open('index.js','w')
            contents = "".join(contents)
            indexFile.write(contents)
            indexFile.close()

except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")
