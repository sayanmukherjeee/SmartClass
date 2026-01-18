# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Users

class UsersAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_admin', 'is_staff')
    list_filter = ('is_admin', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('ERP Information', {'fields': ('phone', 'department', 'profile_picture', 'is_admin')}),
    )

admin.site.register(Users, UsersAdmin)