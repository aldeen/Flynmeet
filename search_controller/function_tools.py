'''
function_tools.py
Created on Feb 2, 2016

@author: aldeen berluti
Random various functions that are going to be used in the project and have no reason to appear in other files
'''
import os


def get_api_key ():
    """ Get the API key from a file that has to be at the root of the Django project"""
    PROJECT_PATH = os.path.abspath(os.path.dirname(__name__))
    key_file = open(PROJECT_PATH + "/key_api.txt", "r")
    return (key_file.read()).rstrip('\n')
    
