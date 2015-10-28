from django.db import models

# Create your models here.
class AreaName(models.Model):
	name = models.CharField(max_length=500)
	sitio = models.CharField(max_length=500)
	barangay = models.CharField(max_length=500)
	municipality = models.CharField(max_length=500)
	province = models.CharField(max_length=500)

	class Meta:
		db_table = 'area_name'

	def __unicode__(self):
		return self.name

class GeographicalCoordinates(models.Model):
	area = models.ForeignKey(AreaName)
	lat = models.CharField(max_length=200)
	lng = models.CharField(max_length=200)

	class Meta:
		db_table = 'geographical_coords'
