# Create your views here.
import django_filters
from rest_framework import viewsets
from django_filters import rest_framework as filters

from rest_framework.pagination import PageNumberPagination

from objectives.serializers import ObjectiveSerializer
from objectives.models import Objective

class ObjectiveFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr='icontains')
    description = filters.CharFilter(field_name="description", lookup_expr='icontains')

    class Meta:
        model = Objective
        fields = ['name', 'description']

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 1000

class ObjectiveViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed/created/edited/deleted.
    """
    queryset = Objective.objects.all().order_by('id')
    serializer_class = ObjectiveSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = (
        django_filters.rest_framework.DjangoFilterBackend,
    )
    filterset_class = ObjectiveFilter

    # permission_classes = [permissions.IsAuthenticated]

    # print('request received is ' + requests.request('POST', ))

    # HttpResponse ()

    # def pretty_request(ObjectiveViewSet, request):
    #     headers = ''
    #     for header, value in request.META.items():
    #         if not header.startswith('HTTP'):
    #             continue
    #         header = '-'.join([h.capitalize() for h in header[5:].lower().split('_')])
    #         headers += '{}: {}\n'.format(header, value)
    #
    #     return (
    #         '{method} HTTP/1.1\n'
    #         'Content-Length: {content_length}\n'
    #         'Content-Type: {content_type}\n'
    #         '{headers}\n\n'
    #         '{body}'
    #     ).format(
    #         method=request.method,
    #         content_length=request.META['CONTENT_LENGTH'],
    #         content_type=request.META['CONTENT_TYPE'],
    #         headers=headers,
    #         body=request.body,
    #     )
    #
    # def create(self, request, *args, **kwargs):
    #     print(self.pretty_request(request));
    #     return super().create(request, *args, **kwargs)

