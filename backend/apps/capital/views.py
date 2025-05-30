from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Capitals
from .serializers import CapitalsSerializer
from apps.users.models import Users

# view para mostrar todos los datos de los ingresos de capital de todos los usuarios
@permission_classes([AllowAny])
class AllCapitals(viewsets.ModelViewSet):
    serializer_class = CapitalsSerializer
    queryset = Capitals.objects.all()

# view para mostrar solo los datos de un usuario especifico y que este autenticado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def specific_user_capitals(request, user_id):
    user = get_object_or_404(Users, pk=user_id)
    if user != request.user:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    capitals = capitals.objects.filter(user=user)
    serializer = CapitalsSerializer(Capitals, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

# view para ingresar nuevos ingresos de capital a un usuario especifico
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_capital(request, user_id):
    user = get_object_or_404(Users, pk=user_id)
    
    if user != request.user:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()
    data['user'] = user.id
    
    serializer = CapitalsSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# view para editar un ingreso de capital de un usuario en especifico
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def put_capital(request, user_id, capital_id):
    try:
        user = get_object_or_404(Users, pk=user_id)
        if user != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        capital = get_object_or_404(Capitals, pk=capital_id, user=user)

        serializer = CapitalsSerializer(capital, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# view para eliminar un ingreso de capital especifico de un usuario especifico 
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_capital(request, user_id, capital_id):
    user = get_object_or_404(Users, pk=user_id)
    if user != request.user:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    capital = get_object_or_404(Capitals, pk=capital_id, user=user)
    capital.delete()
    return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    
