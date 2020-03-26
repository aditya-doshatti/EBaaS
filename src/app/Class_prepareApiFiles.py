import mysql.connector
import argparse
import os
import shutil
from mysql.connector import Error


class PrepareApiFiles:
    def __init__(self, project, hostname, username, password, database):
        self.project = project
        self.hostname = hostname
        self.username = username
        self.password = password
        self.database = database

    def creatingApiFiles(self):
        command_to_get_model_file = 'sequelize-auto --host ' + self.hostname+ ' \
                                                    --database ' + self.database+ ' \
                                                    --user ' + self.username+' \
                                                    --pass ' + self.password+ ' --port 3306 \
                                                    -o ../'+self.project+'/models'

        command_to_get_express_structure = 'express ../'+self.project
        command_to_create_config_folder = 'mkdir ..\\'+self.project+'\\config'
        os.system(command_to_get_express_structure)
        os.system(command_to_create_config_folder)
        os.system(command_to_get_model_file)
        os.remove("../"+self.project+"/app.js")
        os.remove("../"+self.project+"/routes/index.js")
        os.remove("../"+self.project+"/routes/users.js")
        shutil.rmtree("../"+self.project+"/bin")
        shutil.rmtree("../"+self.project+"/views")
        # Editing config.json
        lines = open('./config/configSkeleton.json', 'r').readlines()
        lines[2] = '\t\"DB_HOSTNAME\" : \"' + self.hostname + '\", \n'
        lines[3] = '\t\"DB_USERNAME\" : \"' + self.username + '\", \n'
        lines[4] = '\t\"DB_PASSWORD\" : \"' + self.password + '\", \n'
        lines[5] = '\t\"DB_PORT\" : \"3306\", \n'
        lines[6] = '\t\"DB_NAME\" : \"' + self.database + '\" \n'
        out = open('../'+self.project+'/config/config.json', 'w')
        out.writelines(lines)
        out.close()

        shutil.copyfile('connection.js','../'+self.project+'/connection.js')



        try:
            connection = mysql.connector.connect(host=self.hostname,
                                                database=self.database,
                                                user=self.username,
                                                password=self.password)
            if connection.is_connected():
                
                db_Info = connection.get_server_info()
                print("Connected to MySQL Server version ", db_Info)
                cursor = connection.cursor()
                cursor.execute("select database();")
                record1 = cursor.fetchone()
                print("You're connected to database: ", record1)

                # creating index.js in app folder.
                contents = open('index.js','r').readlines()
                indexFile = open('../'+self.project+'/index.js','w')
                indexFile.write("".join(contents))
                indexFile.close()
                # package.json in app folder
                contents = open('package.json','r').readlines()
                indexFile = open('../'+self.project+'/package.json','w')
                indexFile.write("".join(contents))
                indexFile.close()

                cursor.execute("select TABLE_NAME,COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_schema = 'test' AND POSITION_IN_UNIQUE_CONSTRAINT is NULL AND CONSTRAINT_NAME = 'PRIMARY'")
                rs = cursor.fetchall()
                print('List Of Tables: ')
                for r in rs:
                    print(r[0])
                    # Editing routes/skeleton file with the table name
                    lines = open('./routes/skeleton.js', 'r').readlines()
                    lines[5] = "var entity = Conn.import(__dirname + '/../models/"+r[0]+".js'); \n"
                    lines[95] = "\t\t\t\t\t{ where:{ "+r[1]+": id} },\n"
                    lines[122] = "\t\tentity.destroy({ where:{ "+r[1]+": id} },{ raw: true })\n"    
                    out = open('../'+self.project+'/routes/'+r[0]+'.js', 'w')
                    out.writelines(lines)
                    out.close()
                    

                    contents = open('../'+self.project+'/index.js','r').readlines()
                    contents.insert(6,"var "+r[0]+" = require('./routes/"+r[0]+".js')\n")
                    contents.insert(len(contents)-3,'app.use("/'+r[0]+'",'+r[0]+')\n')

                    indexFile = open('../'+self.project+'/index.js','w')
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

                    contents = open('../'+self.project+'/routes/'+r[0]+'.js','r').readlines()
                    contents.insert(len(contents)-2,"".join(skeletonContents))
                    contents.insert(len(contents)-2,"\n")

                    file = open('../'+self.project+'/routes/'+r[0]+'.js','w')
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

                    contents = open('../'+self.project+'/routes/'+row[3]+'.js','r').readlines()
                    contents.insert(len(contents)-2,"".join(skeletonContents))
                    contents.insert(len(contents)-2,"\n")

                    file = open('../'+self.project+'/routes/'+row[3]+'.js','w')
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
