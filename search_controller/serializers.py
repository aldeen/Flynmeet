'''
serializers.py
Created on Feb 2, 2016

@author: aldeen berluti
Serializers class and funtions transforming the JSON ressources into instances
'''
from rest_framework import serializers
from models import Search, Currency, Route

class CurrencySerializer(serializers.ModelSerializer):
    """"""
    class Meta:
        model = Currency
        fields = ('code')
    
    def create(self, validated_data):
        """
        Create and return a new `Currency` instance, given the validated data.
        """
        return Currency.objects.create(**validated_data)



class RouteSerializer(serializers.ModelSerializer):
    """ Serializer for a route """
    class Meta:
        model = Route
        fields = ('origin', 'departure_date', 'return_date')

#     def create(self, validated_data):
#         """
#         Create and return a new `Search` instance, given the validated data.
#         """
#         return Route(**validated_data)
         

class GlobalSearchSerializer(serializers.ModelSerializer):
    """Serializer for the global fare search """
    routes = RouteSerializer(many=True)
    #currency = CurrencySerializer (read_only=True)
    class Meta:
        model = Search
        fields = ('currency', 'market', 'locale', 'routes')
#         
    def create(self, validated_data):
        """
        Create and return a new `Search` instance, given the validated data.
        """
        routes_data = validated_data.pop('routes') 
        search = Search.objects.create(**validated_data)
#         Currency.objects.create(search=instance, **currency_data)
#         print 'hello'
        for route_data in routes_data:
            route = Route.objects.create(**route_data)
            search.routes.add(route)
        search.save()
        return search


    