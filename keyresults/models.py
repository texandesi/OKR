from django.db import models

# Create your models here.
class KeyResults(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100)

    class Meta:
        db_table = "key_results"

    def __str__(self):
        return self.name