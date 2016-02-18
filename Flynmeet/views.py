from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.conf import settings
from django.shortcuts import render


def home(req):
    return render(req,  'index.html', {'STATIC_URL': settings.STATIC_URL})

class IndexPage(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexPage, self).dispatch(*args, **kwargs)
    
class SearchPage(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(SearchPage, self).dispatch(*args, **kwargs)
    
class ResultsPage(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(ResultsPage, self).dispatch(*args, **kwargs)
