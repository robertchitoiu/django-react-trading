from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Account, Transaction
from .serializers import TransactionSerializer, AccountSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def accounts(request):
    if request.method == 'GET':
        accounts = Account.objects.filter(user=request.user)
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, balance=10000)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'DELETE'])
def accounts_detail(request, id):
    try:
        account = Account.objects.get(id=id)
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if account.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'DELETE':
        account.is_active = False
        account.save()
        return Response(status=status.HTTP_200_OK)
    elif request.method == 'PATCH':
        data = request.data
        serializer = AccountSerializer(account, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def transactions(request, id):
    try:
        account = Account.objects.get(id=id)
    except Account.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if account.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        transactions =  Transaction.objects.filter(account=account)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(account=account)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)