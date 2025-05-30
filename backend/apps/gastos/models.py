from django.db import models
from django.db.models import Sum
# from apps.users.models import Users
from django.conf import settings

class ExpensesManager(models.Manager):
    def total_expenses_for(self, user):
        agg = self.filter(user=user).aggregate(total=Sum('expense'))
        return agg['total'] or 0

class Expenses(models.Model):
    date_time = models.DateField(auto_now_add=True)
    expense = models.BigIntegerField()
    # user = models.ForeignKey(Users, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    objects   = ExpensesManager()

    def __str__(self):
        # total = Expenses.objects.total_expenses_for(self.user)
        return f"{self.user.username} – Gasto realizado: ${self.expense}"