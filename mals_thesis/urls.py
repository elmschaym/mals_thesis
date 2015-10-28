from django.conf.urls import patterns, include, url
from django.contrib import admin
from mals.views import home, save_area, getAreaName,save_multiple_area,search_name
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mals_thesis.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', home),
    url(r'^save_area?', save_area),
    url(r'^save_multiple_area?', save_multiple_area),
    url(r'^search_name?', search_name),
    url(r'^getAreaName?', getAreaName),
    url(r'^admin/', include(admin.site.urls)),
)
