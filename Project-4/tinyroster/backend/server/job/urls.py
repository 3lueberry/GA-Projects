from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreateJob.as_view(), name='create-job'),
    path('<str:id>/', views.JobDetails.as_view(), name='job-details'),
    path('<str:id>/edit/', views.UpdateJob.as_view(), name='job-update'),
    path('<str:id>/delete/', views.DeleteJob.as_view(), name='job-delete'),
    path('<str:id>/job-status/', views.ApplyOrStatusJob.as_view(), name='job-status'),
    path('<str:id>/<str:user>/', views.CheckStatus.as_view(), name='job-user'),
    path('', views.JobList.as_view(), name='job-list'),
]