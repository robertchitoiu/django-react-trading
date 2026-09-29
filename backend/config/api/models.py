from django.db import models
from django.contrib.auth.models import User

class Account(models.Model):
    CURRENCY_CHOICES = [  
    ('USD', 'USD'),  
    ('EUR', 'EUR'),  
    ('RON', 'RON'),  
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(default='New Account', max_length=50)
    balance = models.DecimalField(max_digits=9, decimal_places=2)
    currency = models.CharField(max_length=20, choices=CURRENCY_CHOICES)
    created_at = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

class Transaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    type = models.CharField(max_length=15)
    symbol = models.CharField(max_length=10, null=True)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    quantity = models.IntegerField(default=1)
    date = models.DateField(auto_now_add=True)

class WatchlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)

    class Meta:
        unique_together = [['user', 'symbol']]