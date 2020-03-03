
import mysql.connector
from mysql.connector import Error

try:
    connection = mysql.connector.connect(host='localhost',
                                         database='test',
                                         user='admin',
                                         password='')
    if connection.is_connected():
        
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        cursor = connection.cursor()
        cursor.execute("select database();")
        record1 = cursor.fetchone()
        print("You're connected to database: ", record1)

        #cursor.execute("USE database") # select the database
        cursor.execute("SHOW TABLES")    # execute 'SHOW TABLES' (but data is not returned)
        #record = cursor.fetchall()
        print('List Of Tables: ')
        for (record,) in cursor:
            print(record)

        #query = '''SELECT * FROM information_schema.columns WHERE table_schema = canvasapplication'''
        #print("You're connected to database: ", record)
        cursor.execute("select CONSTRAINT_NAME,TABLE_NAME,COLUMN_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_SCHEMA like '%test%' and POSITION_IN_UNIQUE_CONSTRAINT = 1")
        rows = cursor.fetchall()
        for row in rows:
            print("{0}        {1}".format(row[1], row[3]))

        cursor.execute("select `TABLE_NAME`,`COLUMN_NAME` from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_schema = 'test' AND POSITION_IN_UNIQUE_CONSTRAINT is NULL AND CONSTRAINT_NAME != 'PRIMARY'")
        rs = cursor.fetchall()
        for r in rs:
            print("{0}        {1}".format(r[0], r[1]))

        

except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")