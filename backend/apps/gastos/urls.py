from django.urls import path
from .views import gastos

urlpatterns = [
    path('gastos/', gastos, name = 'gastos'),
]