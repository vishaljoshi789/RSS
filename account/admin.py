from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_verified', 'is_blocked', 'is_volunteer', 'is_admin_account')
    search_fields = ('email', 'name', 'user_id')
    list_filter = ('is_verified', 'is_blocked', 'is_volunteer', 'is_admin_account')
    ordering = ('email',)
