from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('accounts/', views.accounts, name='accounts'),
    path('accounts/<int:id>/', views.accounts_detail, name='account_detail'),
    path('accounts/<int:id>/transactions/', views.transactions, name='transactions'),
    path('user/me/', views.user_details, name='user_details'),  
]