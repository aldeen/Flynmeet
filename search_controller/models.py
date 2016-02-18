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
from django.db.models.fields.related import ManyToManyField
KEY_API = get_api_key ()

#class Place (models.Model):
##    """ Describe a place and its attributes """
#    id = models.CharField('Place ID', max_length=15, primary_key=True)
#    name = models.CharField('Place name', max_length=15, primary_key=True)
#    country_name = ManyToManyField(Country)
#    city_id = 

# Create your models here.
class Currency (models.Model):
    """ Describe the different currencies that are going to be managed and their attributes"""
    code = models.CharField('Currency code', max_length=3, primary_key=True)
    symbol = models.CharField('Currency symbol', max_length=5)
    exchange_rate = models.FloatField('Exchange rate') 

#class Country (models.Model):
#    """ Describe a country and its attribute """
#    places = models.ManyToManyField(Place)
#    currency = models.ForeignKey (Currency)
    

class Route (models.Model):
    """ Describe a Route with all attributes """
#    origin = models.ManyToManyField(Airport, blank=False, related_name='trip_origin')
    origin = models.CharField('Origin departure',  max_length=30)
#    destination = models.ManyToManyField(Airport, blank=False, related_name='trip_destination')
    destination = models.CharField('Destination departure', max_length=30, blank=True, null=True)
    departure_date = models.DateTimeField('Departure date')
    return_date = models.DateTimeField('Return date')
     
    
class Search (models.Model):
    """ Describe a search with all attributes """
    market = models.CharField('search market', max_length=10)
#     currency = models.ManyToManyField(Currency)
    currency = models.CharField('search currency', max_length=10)
    locale = models.CharField('search locale', max_length=10)
    api_search = FlightsCache(KEY_API)
    routes = models.ManyToManyField(Route)
    
    def get_search_results (self):
        """ Returns results of the browse search by calling the Airfare API """
        #print self.departure_date.strftime("%Y/%m/%d")
        # These below will have to be set according to the cookies, 
        data_res = {}
        i = 0
        print self.routes.all();
        for route in self.routes.all():
            print route 
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
        return data_res
    
    def get_location (self):
        """ Returns results of the different location that can match the origin """
        # These below will have to be set according to the cookies, 
        # but so far, they are hardcoded for feature testing purpose
        #TODO
        self.market = 'GB'
        self.currency ='SGD'
        self.locale = 'GB-en'
        r = self.api_search.location_autosuggest(market=self.market, 
            currency=self.currency,
            locale=self.locale, 
            query=self.origin)
            
        if r.status_code == requests.codes.ok:
            return r.json()
        else :
            return False

            