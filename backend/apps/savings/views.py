from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Savings
from .serializers import SavingsSerializer
from apps.users.models import Users

# view para mostrar todos los datos de los ahorros de todos los usuarios
@permission_classes([AllowAny])
class AllSavings(viewsets.ModelViewSet):
    serializer_class = SavingsSerializer
    queryset = Savings.objects.all()

# view para mostrar solo los datos de un usuario especifico y que este autenticado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def specific_user_savings(request, user_id):
    user = get_object_or_404(Users, pk=user_id)
    if user != request.user:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    savings = Savings.objects.filter(user=user)
    serializer = SavingsSerializer(savings, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

# view para ingresar nuevos ahorros a un usuario especifico
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_saving(request, user_id):
    user = get_object_or_404(Users, pk=user_id)
    
    if user != request.user:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()
    data['user'] = user.id
    
    serializer = SavingsSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# view para editar ahorros de un usuario en especifico
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def put_saving(request, user_id, saving_id):
    try:
        user = get_object_or_404(Users, pk=user_id)
        if user != request.user:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        saving = get_object_or_404(Savings, pk=saving_id, user=user)

        serializer = SavingsSerializer(saving, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# view para eliminar un ahorro especifico de un usuario especifico 
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_saving(request, user_id, saving_id):
    user = get_object_or_404(Users, pk=user_id)
    if user != request.user:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    saving = get_object_or_404(Savings, pk=saving_id, user=user)
    saving.delete()
    return Response({"message": "saving deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    
