from django.db import models
from account.models import User

def volunteer_directory_path(instance, filename):
    return f'volunteer_uploads/{instance.user.username}/{filename}'

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
    affidavit = models.FileField(upload_to=volunteer_directory_path, blank=True, null=True)
    wing = models.ForeignKey(Wing, on_delete=models.SET_NULL, null=True, related_name='volunteers')
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, related_name='volunteers')
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, related_name='volunteers')
    joined_date = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not getattr(self.user, "is_volunteer", False):
            self.user.is_volunteer = True
            self.user.save(update_fields=["is_volunteer"])

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
    
class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='volunteer_applications')
    timestamp = models.DateTimeField(auto_now_add=True)
    wing = models.ForeignKey(Wing, on_delete=models.SET_NULL, null=True)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True)
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True)
    affidavit = models.FileField(upload_to=volunteer_directory_path, blank=True, null=True)
    status = models.CharField(max_length=50)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"ApplicationLog for {self.user.username} on {self.timestamp}"