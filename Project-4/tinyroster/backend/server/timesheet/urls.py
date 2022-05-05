from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.CreateOrAddTimeSheet.as_view(), name='create-timesheet'),
    path('<str:id>/', views.TimeSheetList.as_view(), name='view-timesheet'),
    path('<str:id>/<str:timesheet>', views.TimeSheetItemList.as_view(), name='view-timesheet-item'),
]
