from django.db import models
from django.db.models import Sum
# from apps.users.models import Users
from django.conf import settings

class SavingsManager(models.Manager):
    def total_savings_for(self, user):
        agg = self.filter(user=user).aggregate(total=Sum('saving'))
        return agg['total'] or 0

class Savings(models.Model):
    date_time = models.DateField(auto_now_add=True)
    saving = models.BigIntegerField()
    # user = models.ForeignKey(Users, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    objects   = SavingsManager()

    def __str__(self):
        # total = Savings.objects.total_savings_for(self.user)
        return f"{self.user.username} – Ahorro realizado: ${self.saving}"