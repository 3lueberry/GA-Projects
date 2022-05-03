from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.Login.as_view(), name='login'),
    path('logout/', views.Logout.as_view(), name='logout'),
    path('reset-password/', views.ResetPassword.as_view(), name='reset-password'),
    path('auth/', views.Auth.as_view(), name='authenticate'),
    path('auth/refresh/', views.Refresh.as_view(), name='refresh-token'),
    path('account/create/', views.Create.as_view(), name='create-account'),
    path('account/', views.AccountList.as_view(), name='account-list'),
    path('account/<str:id>/', views.AccountDetails.as_view(), name='account-details'),
    path('account/<str:id>/edit/', views.Update.as_view(), name='update-account'),
    path('account/<str:id>/delete/', views.Delete.as_view(), name='delete-account'),
    path('account-types/', views.AccountTypeView.as_view(), name='account-types'),
    path('admin/', admin.site.urls),
]
