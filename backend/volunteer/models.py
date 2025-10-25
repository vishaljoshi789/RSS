from django.db import models
from account.models import User

class Wing(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class Level(models.Model):
    name = models.CharField(max_length=100)
    wing = models.ForeignKey(Wing, on_delete=models.CASCADE, related_name='levels')
    def __str__(self):
        return self.name
    
class Designation(models.Model):
    title = models.CharField(max_length=100)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='designations')
    total_positions = models.PositiveIntegerField()
    def __str__(self):
        return self.title
    
class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='volunteer')
    phone_number = models.CharField(max_length=15, unique=True)
    wing = models.ForeignKey(Wing, on_delete=models.SET_NULL, null=True, related_name='volunteers')
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, related_name='volunteers')
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, related_name='volunteers')
    joined_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"