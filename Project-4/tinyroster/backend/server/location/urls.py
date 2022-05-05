from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreateLocation.as_view(), name='create-location'),
    path('<str:id>/', views.LocationDetails.as_view(), name='location-details'),
    path('<str:id>/edit/', views.UpdateLocation.as_view(), name='location-update'),
    path('<str:id>/delete/', views.DeleteLocation.as_view(), name='location-delete'),
    path('', views.LocationList.as_view(), name='location-list'),
]
