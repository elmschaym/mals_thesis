import sys
from django.http  import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, render_to_response, redirect, RequestContext
from mals.models import *
from django.core.paginator import Paginator, InvalidPage, EmptyPage
from django.views.decorators.http import require_http_methods
import json

def home(request):
	area_name = AreaName.objects.all()
	queries_without_page = request.GET.copy()
	if queries_without_page.has_key('page'):
		del queries_without_page['page']
    
	paginator = Paginator(area_name, 5)
	try: page = int(request.GET.get("page", '1'))
	except ValueError: page = 1

	try:
		area_name = paginator.page(page)
	except (InvalidPage, EmptyPage):
		area_name = paginator.page(paginator.num_pages)
	data ={
      'area_name':area_name,
      'query_params':queries_without_page
    }
	return render(request,'./home.html',data)

def search_name(request):
	query = request.GET.get('search_name') 

	area_name = AreaName.objects.filter(name__contains=query)

	queries_without_page = request.GET.copy()
	if queries_without_page.has_key('page'):
		del queries_without_page['page']
    
	paginator = Paginator(area_name, 5)
	try: page = int(request.GET.get("page", '1'))
	except ValueError: page = 1

	try:
		area_name = paginator.page(page)
	except (InvalidPage, EmptyPage):
		area_name = paginator.page(paginator.num_pages)
	data ={
      'area_name':area_name,
      'query_params':queries_without_page
    }
	return render(request,'./result_table.html',data)

def save_multiple_area(request):
	context = RequestContext(request)
	coordinates = request.GET.getlist('coordinates[]')
	#print coordinates

#	area_save = AreaName(name=area_name,area_measured=area_value)
#	area_save.save()

	for x in coordinates:
		x = x.split(',')
		if x != "":
			if x[0] == 'area name':
				area_save = AreaName(name=x[1],sitio=x[2],barangay=x[3],municipality=x[4],province=x[5])
				area_save.save()
			else:
				geo_save=GeographicalCoordinates(area_id=area_save.id,lat=x[0], lng=x[1])
				geo_save.save()



	area_name = AreaName.objects.all()
	return render(request,'./response_home.html',{'area_name':area_name})

def save_area(request):
	context = RequestContext(request)
	coordinates = request.GET.getlist('coordinates[]')
	area_name = request.GET.get('area_name')
	prov = request.GET.get('prov')
	sitio = request.GET.get('sitio')
	barangay = request.GET.get('barangay')
	municipality = request.GET.get('municipality')
	area_value = request.GET.get('_area_value')


	area_save = AreaName(name=area_name, sitio=sitio, barangay=barangay, municipality=municipality, province=prov)
	area_save.save()

	for x in coordinates:
		x = x.split(',')
		print x[0], x[1]
		if x != "":
			geo_save=GeographicalCoordinates(area_id=area_save.id,lat=x[0], lng=x[1])
			geo_save.save()



	area_name = AreaName.objects.all()
	return render(request,'./response_home.html',{'area_name':area_name})

#@require_http_methods(["POST"]) 
def getAreaName(request):
	#params = json.loads(request.body)
	s = request.GET.get('area_name_id')
	print s, 'sadsa'
	areas = []
	#area_name_id = params['area_name_id']
	area_name = AreaName.objects.get(id=s)
	geo_area = GeographicalCoordinates.objects.filter(area=s)
	for x in geo_area:
		areas.append([x.lat+','+x.lng])

	
	data ={ 'coordins': areas, 
			'area_name':area_name.name,
			'sitio':area_name.sitio,
			'barangay':area_name.barangay,
			'municipality':area_name.municipality,
			'province':area_name.province
			}
	json_response = json.dumps(data)
	return HttpResponse(json_response, content_type="application/json")