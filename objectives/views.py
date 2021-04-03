from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from objectives.serializers import ObjectiveSerializer
from objectives.models import Objective


class ObjectiveViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed/created/edited/deleted.
    """
    queryset = Objective.objects.all().order_by('id')
    serializer_class = ObjectiveSerializer
    permission_classes = [permissions.IsAuthenticated]
