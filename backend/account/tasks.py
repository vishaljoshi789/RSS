from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings

@shared_task
def send_async_email(subject, message, recipient_list, pdf_data=None, pdf_filename=None):
    try:
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipient_list,
        )
        if pdf_data and pdf_filename:
            email.attach(pdf_filename, pdf_data, 'application/pdf')
        email.send()
        return True
    except Exception as e:
        return False