from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact_email(request):
    """
    Send contact form email to CONTACT_EMAIL
    """
    try:
        # Extract form data
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        subject = request.data.get('subject', '').strip()
        message = request.data.get('message', '').strip()

        # Validate required fields
        if not all([name, email, subject, message]):
            return Response(
                {'error': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate email format (basic)
        if '@' not in email or '.' not in email.split('@')[-1]:
            return Response(
                {'error': 'Invalid email format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare email content
        email_subject = f"Contact Form: {subject}"
        email_body = f"""
New contact form submission from Sugesto.xyz

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This email was sent from the contact form at sugesto.xyz
        """

        # Send email
        try:
            send_mail(
                subject=email_subject,
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=False,
            )

            logger.info(f"Contact email sent from {email}")

            return Response(
                {'message': 'Email sent successfully'},
                status=status.HTTP_200_OK
            )

        except Exception as email_error:
            logger.error(f"Failed to send email: {str(email_error)}")
            return Response(
                {'error': 'Failed to send email. Please try again later or contact us directly at contact@sugesto.xyz'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return Response(
            {'error': 'An error occurred processing your request'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
