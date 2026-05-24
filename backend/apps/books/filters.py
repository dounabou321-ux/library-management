import django_filters
from .models import Book


class BookFilter(django_filters.FilterSet):
    author = django_filters.NumberFilter(field_name="author__id")
    category = django_filters.CharFilter(field_name="category__slug")
    year_min = django_filters.NumberFilter(field_name="publication_year", lookup_expr="gte")
    year_max = django_filters.NumberFilter(field_name="publication_year", lookup_expr="lte")
    available = django_filters.BooleanFilter(method="filter_available", label="Disponible")

    def filter_available(self, queryset, name, value):
        if value is True:
            return queryset.filter(copies_available__gt=0)
        if value is False:
            return queryset.filter(copies_available__lte=0)
        return queryset

    class Meta:
        model = Book
        fields = ["author", "category", "is_active", "available"]
