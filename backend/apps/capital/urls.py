# urls.py en tu aplicación Django
from django.urls import path
from .views import AllCapitals, specific_user_capitals, post_capital, put_capital, delete_capital
# from .views import specific_user_capitalss, post_capitals, put_capitals, delete_capitals

urlpatterns = [
    path('all-capitalss/',
         AllCapitals.as_view({'get': 'list', 'post': 'create'}), name='all capitalss'),
    path('profile/<int:user_id>/specific-user-capitals/', specific_user_capitals, name='specific user capitals'),
    path('profile/<int:user_id>/post-capital/', post_capital, name='post capital'),
    path('profile/<int:user_id>/capitals/update-capital/<int:capital_id>', put_capital, name='put capital'),
    path('profile/<int:user_id>/capitals/delete-capital/<int:capital_id>', delete_capital, name='delete capital'),
]