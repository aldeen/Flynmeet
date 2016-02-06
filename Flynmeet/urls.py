"""Flynmeet URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from Flynmeet.views import SearchPage, IndexPage
from search_controller.views import SearchView
from rest_framework import routers


router = routers.SimpleRouter()
#router.register(r'accounts', AccountViewSet)

urlpatterns = [
    # ... URLs
    url(r'^admin/', admin.site.urls),
    #api end point
    url(r'^api/v1/CheapestDests/$', SearchView),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url('^index.*$', SearchPage.as_view(), name='search'),
    url('^.*$', IndexPage.as_view(), name='index'),
]