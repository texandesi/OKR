from django.urls import include, path
from rest_framework import routers

from . import views

# app_name = 'Groups'

router = routers.DefaultRouter()
router.register(r'', views.GroupViewSet)
# router.register(r'Groups/<pk>', views.GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('/', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    # path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    # path('<int:question_id>/vote/', views.vote, name='vote'),

]

