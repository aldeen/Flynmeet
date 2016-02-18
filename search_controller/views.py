'''
views.py
Created on Feb 2, 2016

@author: aldeen berluti
Views for the model MVC, here being the direct API end point 
'''
from django.shortcuts import render
from serializers import GlobalSearchSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from function_tools import get_exception_info
# Create your views here.

@api_view(['POST'])
def SearchView(request):
    """
    Get result of a Route search
    """
    if request.method == 'POST':
        print request.data
        serializer = GlobalSearchSerializer(data=request.data)
        if serializer.is_valid():
            try:
                search = serializer.save()
                results = search.get_search_results()
            except Exception as E:
                #TODO Proper error management inside logs
                print(get_exception_info(E))
                return Response('Internal Error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(results, status=status.HTTP_200_OK)
        else:
            print serializer.errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST'])
def OriginEntriesView(request):
     """
#     Get all the entries that are available for origin  
#     """
#     if request.method == 'POST':
#         serializer = SearchSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 search = serializer.save()
#                 results = search.get_location()
#             except Exception as E:
#                 print E
#                 return Response('Internal Error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#             return Response(results, status=status.HTTP_200_OK)
#         else:
#             print serializer.errors
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)