import django_filters
from .models import Book


class BookFilter(django_filters.FilterSet):
    author = django_filters.NumberFilter(field_name="author__id")
    category = django_filters.CharFilter(field_name="category__slug")

    published_after = django_filters.DateFilter(
        field_name="published_date",
        lookup_expr="gte",
    )
    published_before = django_filters.DateFilter(
        field_name="published_date",
        lookup_expr="lte",
    )
    year_min = django_filters.NumberFilter(
        field_name="publication_year",
        lookup_expr="gte",
    )
    year_max = django_filters.NumberFilter(
        field_name="publication_year",
        lookup_expr="lte",
    )
    available = django_filters.BooleanFilter(
        method="filter_available",
        label="Disponible",
    )

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

        fields = [
            "author",
            "category",
            "is_active",
            "available",
            "published_after",
            "published_before",
        ]

        fields = ["author", "category", "is_active", "available"]

