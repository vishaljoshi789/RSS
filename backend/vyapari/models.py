from django.db import models
from account.models import User

def vyapari_directory_path(instance, filename):
    return f'vyapari_uploads/{instance.name}/{filename}'

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='category_images/')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
class SubCategory(models.Model):
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='subcategory_images/')
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('category', 'name')

    def __str__(self):
        return f"{self.category.name} - {self.name}"

class Vyapari(models.Model):
    name = models.CharField(max_length=255, unique=True)
    short_description = models.TextField(blank=True, null=True) 
    long_description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to=vyapari_directory_path, blank=True, null=True)
    cover_image = models.ImageField(upload_to=vyapari_directory_path, blank=True, null=True)
    image1 = models.ImageField(upload_to=vyapari_directory_path, blank=True, null=True)
    image2 = models.ImageField(upload_to=vyapari_directory_path, blank=True, null=True)
    image3 = models.ImageField(upload_to=vyapari_directory_path, blank=True, null=True)
    visiting_card = models.ImageField(upload_to=vyapari_directory_path, blank=True, null=True)
    category = models.ForeignKey(Category, related_name='vyaparis', on_delete=models.SET_NULL, blank=True, null=True)
    subcategory = models.ForeignKey(SubCategory, related_name='vyaparis', on_delete=models.SET_NULL, blank=True, null=True)
    email = models.EmailField(max_length=255, unique=True, blank=True, null=True)
    phone = models.CharField(max_length=20)
    owner = models.CharField(max_length=255, blank=True, null=True)
    insta_url = models.URLField(max_length=500, blank=True, null=True)
    facebook_url = models.URLField(max_length=500, blank=True, null=True)
    website_url = models.URLField(max_length=500, blank=True, null=True)
    address = models.JSONField(default=dict, blank=True)
    location = models.JSONField(default=dict, blank=True)
    is_verified = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    tags = models.TextField(blank=True, null=True)
    referred_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='vyapari_referrals')

    def __str__(self):
        return self.name
    
class Advertisement(models.Model):
    ADVERTISEMENT_TYPE=[
        ('global', 'Global'),
        ('district', 'District'),
        ('market', 'Market'),
        ('state', 'State'),
        # ('category', 'Category'),
        # ('subcategory', 'SubCategory'),
    ]
    vyapari = models.ForeignKey(Vyapari, related_name='advertisements', on_delete=models.CASCADE)
    ad_type = models.CharField(max_length=20, choices=ADVERTISEMENT_TYPE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='advertisement_images/')
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.vyapari.name} - {self.title}"