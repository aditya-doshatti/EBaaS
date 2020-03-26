# importing required modules
from zipfile import ZipFile
import os


class PrepareZipFolder:
    def __init__(self, directory):
        self.directory = directory

    def get_all_file_paths(self):

        print("Inside getting file paths()")
        # initializing empty file paths list
        paths = []

        # crawling through directory and subdirectories
        for root, directories, files in os.walk(self.directory):
            for filename in files:
                # join the two strings in order to form the full filepath.
                filepath = os.path.join(root, filename)
                paths.append(filepath)

        # returning all file paths
        print("After for loop")
        return paths

    def zip(self,project):
        print("Inside zip(), directory is: ",self.directory)
        # calling function to get all file paths in the directory
        file_paths = self.get_all_file_paths()
        
        print("Inside zip(),")
        # printing the list of all files to be zipped
        print('Following files will be zipped:')
        for file_name in file_paths:
            print(file_name)

        # writing files to a zipfile
        with ZipFile('./static/'+project+'.zip', 'w') as zip:
            # writing each file one by one
            for file in file_paths:
                zip.write(file)

        print('All files zipped successfully!')
