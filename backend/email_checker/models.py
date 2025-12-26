from djongo import models
from django.utils import timezone


class EmailValidation(models.Model):
    _id = models.ObjectIdField()
    email = models.EmailField(max_length=255)
    is_valid_syntax = models.BooleanField(default=False)
    is_valid_dns = models.BooleanField(default=False)
    is_valid_smtp = models.BooleanField(default=False)
    is_disposable = models.BooleanField(default=False)
    mx_records = models.JSONField(default=list, blank=True)
    validation_message = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        db_table = 'email_validations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} - Valid: {self.is_valid_syntax and self.is_valid_dns}"


class DisposableEmailDomain(models.Model):
    _id = models.ObjectIdField()
    domain = models.CharField(max_length=255, unique=True)
    added_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'disposable_domains'
        ordering = ['domain']

    def __str__(self):
        return self.domain
