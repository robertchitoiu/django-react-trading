from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('accounts/<int:id>/', views.accounts_detail, name='account_detail'),
    path('accounts/<int:id>/transactions/', views.transactions, name='transactions')
]