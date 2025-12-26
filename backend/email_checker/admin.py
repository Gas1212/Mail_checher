from django.contrib import admin
from .models import EmailValidation, DisposableEmailDomain


@admin.register(EmailValidation)
class EmailValidationAdmin(admin.ModelAdmin):
    list_display = [
        'email', 'is_valid_syntax', 'is_valid_dns',
        'is_valid_smtp', 'is_disposable', 'created_at'
    ]
    list_filter = [
        'is_valid_syntax', 'is_valid_dns',
        'is_valid_smtp', 'is_disposable', 'created_at'
    ]
    search_fields = ['email', 'validation_message']
    readonly_fields = ['created_at']
    ordering = ['-created_at']


@admin.register(DisposableEmailDomain)
class DisposableEmailDomainAdmin(admin.ModelAdmin):
    list_display = ['domain', 'is_active', 'added_at']
    list_filter = ['is_active', 'added_at']
    search_fields = ['domain']
    ordering = ['domain']
