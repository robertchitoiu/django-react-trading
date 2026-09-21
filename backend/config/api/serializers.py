from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Account, Transaction

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def validate(self, data):
        password = data.get('password')
        confirm = data.get("confirm_password")

        if password != confirm:
            raise serializers.ValidationError('Passwords do not match.')
        data.pop('confirm_password')
        return data


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'balance', 'currency', 'created_at', 'user']
        extra_kwargs = {'created_at': {'read_only': True}, 'user': {'read_only': True}, 'balance': {'read_only': True}}

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'type', 'amount', 'date']
        extra_kwargs = {'date': {'read_only': True}, 'account': {'read_only': True}}