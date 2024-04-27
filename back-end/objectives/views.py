# Create your views here.
import django_filters
from rest_framework import viewsets
from django_filters import rest_framework as filters

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from objectives.serializers import ObjectiveSerializer
from objectives.models import Objective


class ObjectiveFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr='icontains')
    description = filters.CharFilter(field_name="description", lookup_expr='icontains')
    # name_sort = filters.OrderingFilter;

    class Meta:
        model = Objective
        fields = ['name', 'description']


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ObjectiveViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed/created/edited/deleted.
    """
    queryset = Objective.objects.all()
    ordering_fields = ['name', 'description']

    serializer_class = ObjectiveSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = (
        django_filters.rest_framework.DjangoFilterBackend,
    )
    filterset_class = ObjectiveFilter

    # permission_classes = [permissions.IsAuthenticated]

    # print('request received is ' + requests.request('POST', ))

    # HttpResponse ()

    def pretty_request(ObjectiveViewSet, request):
      headers = ''
      for header, value in request.META.items():
        if not header.startswith('HTTP'):
            continue
        header = '-'.join([h.capitalize() for h in header[5:].lower().split('_')])
        headers += '{}: {}\n'.format(header, value)

      return (
        '{method} HTTP/1.1\n'
        'Content-Length: {content_length}\n'
        'Content-Type: {content_type}\n'
        '{headers}\n\n'
        '{body}'
      ).format(
        method=request.method,
        content_length=request.META['CONTENT_LENGTH'],
        content_type=request.META['CONTENT_TYPE'],
        headers=headers,
        body=request.body,
      )

    def create(self, request, *args, **kwargs):
        print("content received is as follows \n")
        print(self.pretty_request(request))
        return super().create(request, *args, **kwargs)


    def list(self, request, *args, **kwargs):
        # count = Objective.objects.count()

        sort_param = self.request.query_params.get('ordering')
        queryset = self.filter_queryset(self.get_queryset())

        if sort_param:
            queryset = queryset.order_by(sort_param)
        else:
            queryset = queryset.order_by('name')

        # prev_request_url = self.request.query_params.get('previous')

        page_size = self.request.query_params.get('page_size')

        if (page_size is not None) and (int(page_size) > 0):
            self.pagination_class.page_size = int(page_size)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)

            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        r = Response(serializer.data)
        # r.data['max_records'] = Objective.objects.count()

        return r
