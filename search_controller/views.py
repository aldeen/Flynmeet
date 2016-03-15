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
from django.forms import model_to_dict
from rest_framework.decorators import api_view
from function_tools import get_exception_info, get_api_key
from db_management import update_countries_db, update_currencies_db, update_locales_db, ExtendedFlights
from models import Currency, Country, Language
import json
# Create your views here.

KEY_API = get_api_key ()


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


@api_view(['POST','GET','PUT'])
def UpdateDB_API(request):
    """ Retrieve Markets, Currencies, and Locales from Skyscanner API and update the DB """
    if (request.method == 'POST') or (request.method == 'GET') or (request.method == 'PUT'):
        try:
            r = False
            api_search = ExtendedFlights(KEY_API)
            r ^= update_locales_db(api_search)
            r ^= update_countries_db('en-GB',api_search)
            r ^= update_countries_db('fr-FR',api_search)
            r ^= update_currencies_db(api_search)
            print r
        except Exception as E:
            print (get_exception_info(E))
            return Response('Internal Error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if r:
            return Response(status=status.HTTP_200_OK)
        else :
            Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def ContextInfo(request):
    """ Retrieve and return Markets, Currencies, and Locales from DB """
    if (request.method == 'POST') and ('locale' in request.data):
        try:
            current_locale = Language.objects.filter(code=request.data['locale'])
            currencies = Currency.objects.all()
            countries = Country.objects.filter(Locale=current_locale)
            locales = Language.objects.all()
            locales_dict = []
            countries_dict = []
            currencies_dict = []
            for currency_object in currencies :
                currencies_dict.append(model_to_dict(currency_object))
            for country_object in countries :
                countries_dict.append(model_to_dict(country_object))
            for locale_object in locales :
                locales_dict.append(model_to_dict(locale_object))
            return Response({'currencies': currencies_dict, 'countries':  countries_dict, \
                'locales':  locales_dict}, status=status.HTTP_200_OK)
        except Exception as E:
            print (get_exception_info(E))
            return Response('Internal Error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)