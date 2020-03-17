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

        
        cursor.execute("select TABLE_NAME,COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_schema = \'" + database + "\' AND POSITION_IN_UNIQUE_CONSTRAINT is NULL AND CONSTRAINT_NAME = 'PRIMARY'")
        rs = cursor.fetchall()
        print('List Of Tables: ')
        for r in rs:
            print(r[0])
            # Editing routes/skeleton file with the table name
            lines = open('./routes/skeleton.js', 'r').readlines()
            lines[5] = "var entity = Conn.import(__dirname + '/../models/"+r[0]+".js'); \n"
            lines[95] = "\t\t\t\t\t{ where:{ "+r[1]+": id} },\n"
            lines[122] = "\t\tentity.destroy({ where:{ "+r[1]+": id} },{ raw: true })\n"    
            out = open('./routes/'+r[0]+'.js', 'w')
            out.writelines(lines)
            out.close()

            contents = open('index.js','r').readlines()
            contents.insert(6,"var "+r[0]+" = require('./routes/"+r[0]+".js')\n")
            contents.insert(len(contents)-3,'app.use("/'+r[0]+'",'+r[0]+')\n')

            indexFile = open('index.js','w')
            contents = "".join(contents)
            indexFile.write(contents)
            indexFile.close()

        #
        cursor.execute("select `TABLE_NAME`,`COLUMN_NAME` from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_schema = 'test' AND POSITION_IN_UNIQUE_CONSTRAINT is NULL AND CONSTRAINT_NAME != 'PRIMARY'")
        rs = cursor.fetchall()
        for r in rs:
            print("{0}        {1}".format(r[0], r[1]))
            skeletonContents = open('./routes/tableUniqueSkeleton.js','r').readlines()
            skeletonContents[1] = "router.get('/"+r[1]+"/:uniqueKey', function (req, res, next) {\n"
            skeletonContents[5] = "\t\tentity.findOne({where:{"+r[1]+":uniqueKey}},{ raw: true })\n"
            skeletonContents[28] = "router.put('/"+r[1]+"/:uniqueKey', function (req, res, next) {\n"
            skeletonContents[34] = "\t\t\t\t\t{ returning: true, where:{ "+r[1]+": uniqueKey} },\n"
            skeletonContents[57] = "router.delete('/"+r[1]+"/:uniqueKey', function (req, res, next) {\n"
            skeletonContents[60] = "\t\tentity.destroy({where:{"+r[1]+":uniqueKey}},{ raw: true })\n"

            contents = open('./routes/'+r[0]+'.js','r').readlines()
            contents.insert(len(contents)-2,"".join(skeletonContents))
            contents.insert(len(contents)-2,"\n")

            file = open('./routes/'+r[0]+'.js','w')
            contents = "".join(contents)
            file.write(contents)
            file.close()

        ###################################################################################################
        cursor.execute("select CONSTRAINT_NAME,TABLE_NAME,COLUMN_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_SCHEMA like '%test%' and POSITION_IN_UNIQUE_CONSTRAINT = 1")
        rows = cursor.fetchall()
        for row in rows:
            print("{0}        {1}".format(row[1], row[3]))
            skeletonContents = open('./routes/parentChildSkeletonWithId.js','r').readlines()
            skeletonContents[1] = "router.get('/:id/"+row[1]+"', function (req, res, next) {\n"
            skeletonContents[2] = "\tvar childEntity = Conn.import(__dirname + `/../models/"+row[1]+".js`);\n"
            skeletonContents[5] = "\t\tchildEntity.findAll({where:{"+row[2]+":id}},{ raw: true })\n"
            skeletonContents[28] = "router.post('/:id/"+row[1]+"', function (req, res, next) {\n"
            skeletonContents[29] = "\tvar childEntity = Conn.import(__dirname + `/../models/"+row[1]+".js`);\n"
            skeletonContents[32] = "\tbody['"+row[2]+"'] = id\n"

            contents = open('./routes/'+row[3]+'.js','r').readlines()
            contents.insert(len(contents)-2,"".join(skeletonContents))
            contents.insert(len(contents)-2,"\n")

            file = open('./routes/'+row[3]+'.js','w')
            contents = "".join(contents)
            file.write(contents)
            file.close()

except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")
