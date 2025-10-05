import django_filters
from payment.models import Payment

class PaymentFilter(django_filters.FilterSet):
    date = django_filters.DateFilter(
        field_name='timestamp', lookup_expr='date'
    )

    class Meta:
        model = Payment
        fields = ['status', 'payment_for', 'date']
