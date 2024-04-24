from rest_framework import serializers
from kpi.models import Kpi

class KpiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kpi

        fields = ['id', 'name', 'description']
