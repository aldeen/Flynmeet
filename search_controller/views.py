from django.shortcuts import render
from serializers import SearchSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
# Create your views here.

@api_view(['POST'])
def SearchView(request):
    """
    Get result of a Route search
    """
    if request.method == 'POST':
        serializer = SearchSerializer(data=request.data)
        if serializer.is_valid():
            try:
                search = serializer.save()
                results = search.get_search_result()
            except Exception as E:
                print E
                return Response('Internal Error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(results, status=status.HTTP_200_OK)
        else:
            print serializer.errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)