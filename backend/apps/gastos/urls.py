# urls.py en tu aplicación Django
from django.urls import path
from .views import AllExpenses, specific_user_expenses, post_expense, put_expense, delete_expense
# from .views import specific_user_expensess, post_expenses, put_expenses, delete_expenses

urlpatterns = [
    path('all-expensess/',
         AllExpenses.as_view({'get': 'list', 'post': 'create'}), name='all expensess'),
    path('profile/<int:user_id>/specific-user-expenses/', specific_user_expenses, name='specific user expenses'),
    path('profile/<int:user_id>/post-expense/', post_expense, name='post expense'),
    path('profile/<int:user_id>/expenses/update-expense/<int:expense_id>', put_expense, name='put expense'),
    path('profile/<int:user_id>/expenses/delete-expense/<int:expense_id>', delete_expense, name='delete expense'),
]