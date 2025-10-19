from django.db import models
from django.db.models import JSONField
from django.contrib.postgres.indexes import GinIndex

class Payment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    # Basic fields
    name = models.CharField(max_length=100, db_index=True)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=15, db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    payment_for = models.CharField(max_length=255, db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    notes = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='payments/', blank=True, null=True)

    # IDs
    order_id = models.CharField(max_length=100, unique=True, db_index=True)
    payment_id = models.CharField(max_length=100, unique=True, db_index=True)

    # Payment metadata stored as JSON
    method = models.CharField(max_length=100, blank=True, null=True)
    payment_details = JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.order_id} - {self.amount} - {self.status}"

    class Meta:
        indexes = [
            GinIndex(fields=['payment_details']),
            models.Index(fields=['timestamp']),
        ]
        ordering = ['-timestamp']
