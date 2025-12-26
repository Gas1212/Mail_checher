from rest_framework import serializers
from .models import EmailValidation, DisposableEmailDomain


class EmailValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailValidation
        fields = [
            'id', 'email', 'is_valid_syntax', 'is_valid_dns',
            'is_valid_smtp', 'is_disposable', 'mx_records',
            'validation_message', 'created_at', 'ip_address'
        ]
        read_only_fields = ['id', 'created_at']


class EmailCheckRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    check_smtp = serializers.BooleanField(default=True, required=False)


class DisposableEmailDomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisposableEmailDomain
        fields = ['id', 'domain', 'added_at', 'is_active']
        read_only_fields = ['id', 'added_at']
