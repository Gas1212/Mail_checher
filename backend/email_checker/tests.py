from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import EmailValidation, DisposableEmailDomain
from .validators import EmailValidator


class EmailValidatorTestCase(TestCase):
    """Test cases for EmailValidator class"""

    def setUp(self):
        self.validator = EmailValidator()

    def test_valid_syntax(self):
        """Test valid email syntax"""
        is_valid, message = self.validator.validate_syntax("test@example.com")
        self.assertTrue(is_valid)

    def test_invalid_syntax(self):
        """Test invalid email syntax"""
        is_valid, message = self.validator.validate_syntax("invalid-email")
        self.assertFalse(is_valid)

    def test_check_disposable_known_domain(self):
        """Test disposable email detection"""
        DisposableEmailDomain.objects.create(
            domain="tempmail.com",
            is_active=True
        )
        is_disposable, message = self.validator.check_disposable("test@tempmail.com")
        self.assertTrue(is_disposable)

    def test_check_disposable_normal_domain(self):
        """Test non-disposable email"""
        is_disposable, message = self.validator.check_disposable("test@gmail.com")
        self.assertFalse(is_disposable)


class EmailValidationAPITestCase(APITestCase):
    """Test cases for Email Validation API"""

    def test_check_email_endpoint(self):
        """Test email check endpoint"""
        url = '/api/emails/check/'
        data = {
            'email': 'test@example.com',
            'check_smtp': False  # Disable SMTP to speed up tests
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response.data)
        self.assertIn('is_valid_syntax', response.data)

    def test_check_email_invalid_format(self):
        """Test email check with invalid format"""
        url = '/api/emails/check/'
        data = {
            'email': 'invalid-email',
            'check_smtp': False
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_valid_syntax'])

    def test_get_stats_endpoint(self):
        """Test stats endpoint"""
        url = '/api/emails/stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_validations', response.data)
        self.assertIn('valid_emails', response.data)

    def test_get_history_endpoint(self):
        """Test history endpoint"""
        url = '/api/emails/history/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)


class DisposableEmailDomainTestCase(APITestCase):
    """Test cases for Disposable Email Domain API"""

    def test_create_disposable_domain(self):
        """Test creating a disposable domain"""
        url = '/api/disposable-domains/'
        data = {
            'domain': 'fakeemail.com',
            'is_active': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DisposableEmailDomain.objects.count(), 1)

    def test_bulk_add_domains(self):
        """Test bulk adding disposable domains"""
        url = '/api/disposable-domains/bulk-add/'
        data = {
            'domains': ['temp1.com', 'temp2.com', 'temp3.com']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['added'], 3)
        self.assertEqual(DisposableEmailDomain.objects.count(), 3)
