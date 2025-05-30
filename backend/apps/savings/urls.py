# urls.py en tu aplicación Django
from django.urls import path
from .views import AllSavings, specific_user_savings, post_saving, put_saving, delete_saving
# from .views import specific_user_savings, post_saving, put_saving, delete_saving

urlpatterns = [
    path('all-savings/',
         AllSavings.as_view({'get': 'list', 'post': 'create'}), name='all savings'),
    path('profile/<int:user_id>/specific-user-savings/', specific_user_savings, name='specific user savings'),
    path('profile/<int:user_id>/post-saving/', post_saving, name='post saving'),
    path('profile/<int:user_id>/saving/update-saving/<int:saving_id>', put_saving, name='put saving'),
    path('profile/<int:user_id>/savings/delete-saving/<int:saving_id>', delete_saving, name='delete saving'),
]