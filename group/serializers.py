from rest_framework import serializers
from group.models import Group

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group

        fields = ['id', 'name', 'description']
