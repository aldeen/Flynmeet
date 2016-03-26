'''
models.py
Created on Feb 2, 2016

@author: aldeen berluti
Model class and funtions handling the different ressources and business operations
'''
from __future__ import unicode_literals
from django.db import models
from skyscanner import FlightsCache
from function_tools import get_api_key
import requests
import json
KEY_API = get_api_key ()

#class Place (models.Model):
##    """ Describe a place and its attributes """
#    id = models.CharField('Place ID', max_length=15, primary_key=True)
#    name = models.CharField('Place name', max_length=15, primary_key=True)
#    country_name = ManyToManyField(Country)
#    city_id = 


# Create your models here.


class Language (models.Model):
    """ Language of the website """
    name = models.CharField('Site language', max_length=50)
    code = models.CharField('Site language code', max_length=5, primary_key=True)


class Currency (models.Model):
    """ Describe the different currencies that are going to be managed and their attributes"""
    Code = models.CharField('Currency code', max_length=3, primary_key=True)
    Symbol = models.CharField('Currency symbol', max_length=10)
    SpaceBetweenAmountAndSymbol = models.BooleanField('Currency syntax')
    SymbolOnLeft = models.BooleanField('Currency Symbol syntax')
    DecimalSeparator = models.CharField('Currency Decimal Separator', max_length=1, null=True, blank=True)
    ThousandsSeparator = models.CharField('Currency Decimal Separator', max_length=1, null=True, blank=True)
    RoundingCoefficient = models.IntegerField('Currency Rounding Coefficient')
    DecimalDigits = models.IntegerField('Currency Decimal Digit')


class Country (models.Model):
    """ Describe a country and its attribute """
    #Uppercase here is important as it MAPS skyscanner json key objects
    Name = models.CharField('Site language', max_length=50)
    Code = models.CharField('Country code', max_length=2)
    Locale = models.ForeignKey(Language, null=True)


class Route (models.Model):
    """ Describe a Route with all attributes """
#    origin = models.ManyToManyField(Airport, blank=False, related_name='trip_origin')
    origin = models.CharField('Origin departure',  max_length=30)
#    destination = models.ManyToManyField(Airport, blank=False, related_name='trip_destination')
    destination = models.CharField('Destination departure', max_length=30, blank=True, null=True)
    departure_date = models.DateTimeField('Departure date', blank=True, null=True)
    return_date = models.DateTimeField('Return date', blank=True, null=True)
     
    
class Search (models.Model):
    """ Describe a search with all attributes """
    api_search = FlightsCache(KEY_API)
    market = models.CharField('search market', max_length=10)
#     currency = models.ManyToManyField(Currency)
    currency = models.CharField('search currency', max_length=10)
    locale = models.CharField('search locale', max_length=10)
    routes = models.ManyToManyField(Route)
    
    def get_search_results (self):
        """ Returns results of the browse search by calling the Airfare API """
        #print self.departure_date.strftime("%Y/%m/%d")
        # These below will have to be set according to the cookies, 
        data_res = {}
        i = 0
        for route in self.routes.all():
            if (route.departure_date and route.return_date) :
                route.destination = 'ANYWHERE'
                r = self.api_search.get_cheapest_quotes(market=self.market,
                    currency=self.currency,
                    locale=self.locale,
                    originplace=route.origin,
                    destinationplace=route.destination,
                    outbounddate=route.departure_date.strftime("%Y-%m-%d"),
                    inbounddate=route.return_date.strftime("%Y-%m-%d"),
                )
                if r.status_code == requests.codes.ok:
                    data_res[i] = json.loads(r.text)
                    i+=1
                else :
                    print 'The request to search to skyscanner failed'
                    return False
            else:
                print 'The request for searching quote cannot be proceeded with no departure/return dates set'
        return data_res
    
    def get_location (self):
        """ Returns results of the different location that can match the origin """
        for route in self.routes.all():
            r = self.api_search.location_autosuggest(market=self.market,
            currency=self.currency,
            locale=self.locale, 
            query=route.origin)
        if r.status_code == requests.codes.ok:
            return r.json()
        else :
            return False