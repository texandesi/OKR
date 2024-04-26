from rest_framework import serializers
from keyresults.models import KeyResults

class KeyResultsSerializer(serializers.ModelSerializer):

    class Meta:
        model = KeyResults

        fields = ['id', 'name', 'description', 'objective']
