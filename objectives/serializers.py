from rest_framework import serializers

from keyresults.serializers import KeyResultsSerializer
from objectives.models import Objective

class ObjectiveSerializer(serializers.ModelSerializer):
    keyresults = KeyResultsSerializer( many=True, required=True)
    print(keyresults.data)

    class Meta:
        model = Objective

        fields = ['id', 'name', 'description', 'keyresults']
