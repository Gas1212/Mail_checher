from rest_framework import serializers


class EmailCheckRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    check_smtp = serializers.BooleanField(default=True, required=False)
