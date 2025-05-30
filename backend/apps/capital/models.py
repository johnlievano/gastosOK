from django.db import models
# from apps.users.models import Users
from django.conf import settings
from apps.gastos.models import Expenses
from django.db.models import Sum

class CapitalManager(models.Manager):
    def total_income_for(self, user):
        agg = self.filter(user=user).aggregate(total=Sum('income'))
        return agg['total'] or 0

    def total_expenses_for(self, user):
        agg = Expenses.objects.filter(user=user).aggregate(total=Sum('expense'))
        return agg['total'] or 0

    def net_capital_for(self, user):
        return self.total_income_for(user) - self.total_expenses_for(user)

class Capitals(models.Model):
    date_time = models.DateField(auto_now_add=True)
    income = models.BigIntegerField()
    # user = models.ForeignKey(
    #     Users, on_delete=models.CASCADE,
    # )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    objects = CapitalManager()
    
    def __str__(self):
        # net = Capitals.objects.net_capital()
        return f"{self.user.username} - Capital ingreado: ${self.income}"