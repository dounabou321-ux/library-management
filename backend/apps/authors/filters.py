import django_filters
from .models import Author


class AuthorFilter(django_filters.FilterSet):
    nationality = django_filters.CharFilter(lookup_expr="icontains")
    name = django_filters.CharFilter(method="filter_name")

    def filter_name(self, qs, name, value):
        return qs.filter(first_name__icontains=value) | qs.filter(last_name__icontains=value)

    class Meta:
        model = Author
        fields = ["nationality"]
