'''
serializers.py
Created on Feb 2, 2016

@author: aldeen berluti
Serializers class and funtions transforming the JSON ressources into instances
'''
from rest_framework import serializers
from models import Search, Currency

#class CurrencySerializer(serializers.ModelSerializer):
    #""""""
    #class Meta:
    #    model = Currency
    #    fields = ('symbol')
#    
#    def create(self, validated_data):
#        """
#        Create and return a new `Currency` instance, given the validated data.
#        """
#        return Currency.objects.create(**validated_data)

class SearchSerializer(serializers.ModelSerializer):
    """Serializer for the fare search """
    class Meta:
        model = Search
        fields = ('origin', 'departure_date', 'return_date')
        
    def create(self, validated_data):
        """
        Create and return a new `Search` instance, given the validated data.
        """
        instance = Search(**validated_data)
        return instance

    