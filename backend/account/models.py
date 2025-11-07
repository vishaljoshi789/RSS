from django.db import models
from django.contrib.auth.models import AbstractUser

def user_directory_path(instance, filename):
    return f'user_uploads/{instance.name}/{filename}'


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    user_id = models.CharField(max_length=50, unique=True)

    gender = models.CharField(max_length=10, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)

    image = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    aadhar_number = models.CharField(max_length=12, blank=True, null=True)
    pan_number = models.CharField(max_length=10, blank=True, null=True)

    # Address fields
    street = models.CharField(max_length=255, blank=True, null=True)
    sub_district = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    division = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)

    referred_by = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, related_name='user_referrals')

    #permission fields
    is_verified = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    is_volunteer = models.BooleanField(default=False)
    is_admin_account = models.BooleanField(default=False)
    is_business_account = models.BooleanField(default=False)
    is_staff_account = models.BooleanField(default=False)
    is_member_account = models.BooleanField(default=False)
    is_field_worker = models.BooleanField(default=False)

    def __str__(self):
        return self.email
    

