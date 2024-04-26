# Create your views here.
from rest_framework import viewsets
from group.serializers import GroupSerializer
from group.models import Group

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed/created/edited/deleted.
    """
    queryset = Group.objects.all().order_by('id')
    serializer_class = GroupSerializer

    # permission_classes = [permissions.IsAuthenticated]

    # print('request received is ' + requests.request('POST', ))

    # HttpResponse ()

    # def pretty_request(GroupViewSet, request):
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

