# -*- coding: utf-8 -*-
'''
db_management.py
Created on Feb 26, 2016

@author: aldeen berluti
Fill and update database
'''
from models import Country, Language, Currency
from serializers import CountrySerializer, CurrencySerializer
from function_tools import get_exception_info
from skyscanner import Flights
import requests
import time



def CountriesSerializer (data_to_validate, locale):
    """Serializer for the all the countries at once """
    for country_data in data_to_validate:
        print country_data
        serializer = CountrySerializer(data=country_data)
        try:
            if serializer.is_valid():
                country = serializer.save()
                print country
                country.Locale = locale
                country.save()
            else :
                return {'status':False, 'message': serializer.errors}
        except Exception as E:
            #TODO Proper error management inside logs
            print(get_exception_info(E))
            return {'status':False, 'message': get_exception_info(E)}
    return {'status':True, 'message':'Update succeeded'}

def CurrenciesSerializer (data_to_validate):
    """

    :param data_to_validate:
    :return:
    """
    for currency_data in data_to_validate:
        print currency_data
        serializer = CurrencySerializer(data=currency_data)
        try:
            if serializer.is_valid():
                currency = serializer.save()
            else :
                return {'status':False, 'message': serializer.errors}
        except Exception as E:
            #TODO Proper error management inside logs
            print(get_exception_info(E))
            return {'status':False, 'message': get_exception_info(E)}
    return {'status':True, 'message':'Update succeeded'}


def update_countries_db (locale_code, api_search):
    """ Get all the countries that are accepted and managed by Skyscanner and update de DB """
    # Get the info from Skyscanner
    r = api_search.get_markets(locale_code)
    # Erase the current table of countries
    if r.status_code == requests.codes.ok:
        locale = Language.objects.get(code=locale_code)
        if locale:
            # Country.objects.filter(Locale=locale).delete()
            # time.sleep(5)
            res = CountriesSerializer(r.parsed['Countries'], locale)
            if res['status'] is True:
                return True
            else :
                print res['message']
                print 'Serializer for countries is not valid'
                return False
        else:
            'The locale requested does not exist'
            return False
    else :
        print 'The request to retrieve Market handled by skyscanner failed'
        return False


def update_currencies_db (api_search):
    """
    :return:
    """
    # Get the info from Skyscanner
    r = api_search.get_currencies()
    # Erase the current table of countries
    if r.status_code == requests.codes.ok:
        Currency.objects.all().delete()
        time.sleep(5)
        res = CurrenciesSerializer(r.parsed['Currencies'])
        if res['status'] is True:
            return True
        else :
            print res['message']
            print 'Serializer for currencies is not valid'
            return False
    else :
        print 'The request to retrieve Currencies handled by skyscanner failed'
        return False

def update_locales_db (api_search):
    """

    :return:
    """
    try:
        Language.objects.all().delete()
        English = Language(name='English (United Kingdom)', code='en-GB')
        English.save()
        French = Language(name='Français (France)', code='fr-FR')
        French.save()
        return True
    except Exception as E:
        #TODO Proper error management inside logs
        print(get_exception_info(E))
        return {'status':False, 'message': get_exception_info(E)}

class ExtendedFlights (Flights):

    API_HOST = 'http://partners.api.skyscanner.net'
    CURRENCIES_URL = '{api_host}/apiservices/reference/v1.0/currencies'.format(
        api_host=API_HOST)

    def get_currencies(self):
        """
        Get the list of currencies
        http://business.skyscanner.net/portal/en-GB/Documentation/Currencies
        """
        url = "{url}".format(url=self.CURRENCIES_URL)
        return self.make_request(url, headers=self._headers())