from rest_framework import serializers
from objectives.models import Objective

class ObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objective

        fields = ['id', 'name', 'description']
