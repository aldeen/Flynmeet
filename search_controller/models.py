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
KEY_API = get_api_key ()


# Create your models here.
class Currency (models.Model):
    """ Describe the different currencies that are going to be managed and their attributes"""
    code = models.CharField('Currency code', max_length=3, primary_key=True)
    symbol = models.CharField('Currency symbol', max_length=5)
    exchange_rate = models.FloatField('Exchange rate') 

class Route (models.Model):
    """ Describe a Route with all attributes """
#    origin = models.ManyToManyField(Airport, blank=False, related_name='trip_origin')
    origin = models.CharField('Origin departure',  max_length=30)
#    destination = models.ManyToManyField(Airport, blank=False, related_name='trip_destination')
    destination = models.CharField('Destination departure',  max_length=30)
    departure_date = models.DateTimeField('Departure date')
    return_date = models.DateTimeField('Return date', blank=True, null=True)
    duration = models.DurationField('Trip Duration')
    
    
class Search (Route):
    """ Describe a search with all attributes """
    #route = models.ManyToManyField(Route)
    one_way_arrival_date = models.DateTimeField('One way arrival date')
    return_arrival_date = models.DateTimeField('Return arrival date')
    #currency = models.ManyToManyField(Currency)
    #market =
    #locale =
    
    def get_search_result (self):
        """ Returns results of the browse search by calling the Airfare API """
        print self.departure_date.strftime("%Y/%m/%d")
        # These below will have to be set according to the cookies, 
        # but so far, they are hardcoded for feature testing purpose
        #TODO
        self.market = 'GB'
        self.currency ='SGD'
        self.locale = 'GB-en'
        self.destination = 'ANYWHERE'
        api_search = FlightsCache(KEY_API);
        r = api_search.get_cheapest_quotes(market=self.market, 
            currency=self.currency,
            locale=self.locale, 
            originplace=self.origin,
            destinationplace=self.destination,
            outbounddate=self.departure_date.strftime("%Y-%m-%d"),
            inbounddate=self.return_date.strftime("%Y-%m-%d"),
            )
        if r.status_code == requests.codes.ok:
            return r.json()
        else :
            return False       
        