# urls.py en tu aplicación Django
from django.urls import path
from .views import sign_in, sign_up, UsersData, profile, update_profile, delete_user
# from .views import sign_in, sign_up, profile, update_profile, delete_user

urlpatterns = [
    path('user-data/',
         UsersData.as_view({'get': 'list', 'post': 'create'}), name='user data'),
    path('sign-in/', sign_in, name='sign-in'),
    path('sign-up/', sign_up, name='sign-up'),
    path('profile/', profile, name='profile'),
    path('profile/<int:pk>/update/', update_profile, name='update profile'),
    path('profile/<int:user_id>/delete/', delete_user, name='delete user'),
]