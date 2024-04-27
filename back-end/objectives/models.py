from django.db import models

# Create your models here.
class Objective(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    # keyresults = ()
    # keyresults = models.aggregates

    class Meta:
        db_table = "objectives"

    def __str__(self):
        return self.name
