'''
Created on Feb 2, 2016

@author: aldeen berluti
'''
import os


def get_api_key ():
    PROJECT_PATH = os.path.abspath(os.path.dirname(__name__))
    key_file = open(PROJECT_PATH + "/key_api.txt", "r")
    return (key_file.read()).rstrip('\n')
    
