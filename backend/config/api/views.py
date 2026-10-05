from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Account, Transaction, PortfolioItem, WatchlistItem
from .serializers import TransactionSerializer, AccountSerializer,  UserSerializer, PortfolioItemSerializer, WatchlistItemSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from django.db.models import Sum  
import requests
import os
from django.db import transaction
from concurrent.futures import ThreadPoolExecutor

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
def accounts_detail(request, id):
    try:
        account = Account.objects.get(id=id)
    except Account.DoesNotExist:
        return Response({'error': 'Account not found'}, status=status.HTTP_404_NOT_FOUND)

    if account.user != request.user:
        return Response({'error': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)

    if not account.is_active:
        return Response({'error': 'Access forbidden'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = AccountSerializer(account)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        account.is_active = False
        account.save()
        return Response(status=status.HTTP_200_OK)
    elif request.method == 'PATCH':
        data = request.data
        serializer = AccountSerializer(account, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

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
            price = serializer.validated_data.get('price')
            quantity = serializer.validated_data.get('quantity')
            symbol = serializer.validated_data.get('symbol')
            cost = price * quantity
            transaction_type = serializer.validated_data.get('type')

            if transaction_type == 'buy':
                if account.balance < cost:  
                    return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    port_item = PortfolioItem.objects.get(account=account, symbol=symbol)
                    port_item.quantity += quantity
                except PortfolioItem.DoesNotExist:
                    port_item = PortfolioItem(account=account, symbol=symbol, quantity=quantity)
            elif transaction_type == 'sell':
                try:
                    port_item = PortfolioItem.objects.get(account=account, symbol=symbol)
                    if port_item.quantity >= quantity:
                        port_item.quantity -= quantity
                    else:
                        return Response({'error': 'Not enough holdings.'}, status=status.HTTP_400_BAD_REQUEST)
                except PortfolioItem.DoesNotExist:
                    return Response({'error': 'You do not hold this stock.'}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                if transaction_type == 'buy':
                    port_item.save()
                    account.balance = account.balance - cost
                elif transaction_type == 'sell':
                    if port_item.quantity == 0:
                        port_item.delete()
                    else:
                        port_item.save()
                    account.balance = account.balance + cost 
                serializer.save(account=account)
                account.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])  
def user_details(request):
    try:  
        serializer = UserSerializer(request.user)  
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Failed to load user data'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_news(request):
    api_key = os.environ.get('FINNHUB_API_KEY')
    url = f'https://finnhub.io/api/v1/news?category=general&token={api_key}'
    try:
        response = requests.get(url)
        if 200 <= response.status_code <= 203:
            return Response(response.json(), status=response.status_code)
        else:
            return Response(status=response.status_code)
    except:
        return Response({'error': 'There was a problem with FINNHUB api'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def dashboard(request):
    try:
        total_accounts = Account.objects.filter(user=request.user).count()
        total_transactions = Transaction.objects.filter(account__user=request.user).count()
        result = Account.objects.filter(user=request.user, is_active=True).aggregate(total=Sum('balance'))
        total_balance = result['total'] or 0

        response = {
            'total_accounts': total_accounts,
            'total_transactions': total_transactions,
            'total_balance': total_balance
        }

        return Response(response, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Failed to load dashboard data'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def balance_chart(request):
    transactions = Transaction.objects.filter(account__user=request.user).order_by('date')
    accounts = Account.objects.filter(user=request.user).order_by('created_at')
    events = []
    for account in accounts:
        events.append({'date': account.created_at, 'type': 'account_created', 'price': 10000})
    for transaction in transactions:
        events.append({'date': transaction.date, 'type': transaction.type, 'price': transaction.price})
    events.sort(key=lambda x: x['date'])
    balance_data = []
    balance = 0

    for e in events:
        if e['type'] == 'sell':
            balance = balance + e['price']
            balance_data.append({'date': e['date'], 'balance': balance})
        elif e['type'] == 'buy':
            balance = balance - e['price']
            balance_data.append({'date': e['date'], 'balance': balance})
        elif e['type'] == 'account_created':
            balance = balance + e['price']
            balance_data.append({'date': e['date'], 'balance': balance})

    return Response(balance_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_stock(request, symbol):
    api_key = os.environ.get('FINNHUB_API_KEY')
    url_symbol_existence = f'https://finnhub.io/api/v1/search?q={symbol}&token={api_key}'
    url_symbol_data = f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={api_key}'

    try:
        response_existence = requests.get(url_symbol_existence)
        if response_existence.status_code != 200:
            return Response(
                {'error': 'There was a problem with FINNHUB api'},
                status=status.HTTP_502_BAD_GATEWAY
            )
        exist_data = response_existence.json()
        if exist_data['count'] == 0:
            return Response({"error": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)
        response_data = requests.get(url_symbol_data)
        if 200 <= response_data.status_code <= 203:
            return Response(response_data.json(), status=response_data.status_code)
        else:
            return Response({"error": "There was a problem with the transaction"}, status=response_data.status_code)
    except:
        return Response({'error': 'There was a problem with FINNHUB api'}, status=status.HTTP_502_BAD_GATEWAY)

@api_view(['GET'])
def get_portfolio(request):
    try:
        portfolio_items = PortfolioItem.objects.filter(account__user=request.user, account__is_active=True)
        serializer = PortfolioItemSerializer(portfolio_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Could not load portfolio'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def watchlist(request):
    if request.method == 'GET':
        api_key = os.environ.get('FINNHUB_API_KEY')
        def fetch_price(symbol):
            url = f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={api_key}'
            response = requests.get(url)
            if response.status_code != 200:
                return {'symbol': symbol, 'price': None, 'error': True}
            return {'symbol': symbol, 'price': response.json().get('c')}
        watchlistItems = WatchlistItem.objects.filter(user=request.user)
        symbols = [item.symbol for item in watchlistItems]
        with ThreadPoolExecutor() as executor:
            results = list(executor.map(fetch_price, symbols))
            return Response(results, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = WatchlistItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'error': 'Stock already in watchlist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_watchlist(request, id):
    try:
        item = WatchlistItem.objects.get(id=id)
    except WatchlistItem.DoesNotExist:
        return Response({'error': 'Stock does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if item.user != request.user:
        return Response({'error': 'Access forbidden'}, status=status.HTTP_401_UNAUTHORIZED)
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
