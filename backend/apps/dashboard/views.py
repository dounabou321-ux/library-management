from datetime import timedelta

from django.db.models import Count
from django.utils import timezone

from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authors.models import Author
from apps.books.models import Book
from apps.borrowings.models import Borrowing
from apps.categories.models import Category
from apps.users.models import User


class DashboardStatsView(APIView):
    """GET /api/dashboard/stats/ — Admin only"""

    permission_classes = [IsAdminUser]

    def get(self, request):
        today = timezone.now().date()

        total_books = Book.objects.filter(
            is_active=True
        ).count()

        total_users = User.objects.filter(
            role="MEMBER"
        ).count()

        active_borrowings = Borrowing.objects.filter(
            status="ACTIVE"
        ).count()

        returned_books = Borrowing.objects.filter(
            status="RETURNED"
        ).count()

        overdue_count = Borrowing.objects.filter(
            status="ACTIVE",
            due_date__lt=today,
        ).count()

        new_borrowings_today = Borrowing.objects.filter(
            borrowed_at=today
        ).count()

        daily = []

        for i in range(6, -1, -1):
            d = today - timedelta(days=i)

            cnt = Borrowing.objects.filter(
                borrowed_at=d
            ).count()

            daily.append({
                "date": d.isoformat(),
                "count": cnt,
            })

        top_books = list(
            Book.objects.annotate(
                borrow_count=Count("borrowings")
            ).order_by(
                "-borrow_count"
            ).values(
                "id",
                "title",
                "borrow_count",
            )[:5]
        )

        by_category = list(
            Borrowing.objects.values(
                "book__category__name"
            ).annotate(
                count=Count("id")
            ).order_by(
                "-count"
            )[:8]
        )

        recent = Borrowing.objects.select_related(
            "user",
            "book",
        ).order_by(
            "-borrowed_at"
        )[:5]

        recent_data = [
            {
                "id": b.id,
                "user": b.user.full_name,
                "book": b.book.title,
                "borrowed_at": b.borrowed_at.isoformat(),
                "due_date": b.due_date.isoformat(),
                "status": b.status,
                "is_overdue": b.is_overdue,
            }
            for b in recent
        ]

        return Response({
            "total_books": total_books,
            "total_users": total_users,
            "active_borrowings": active_borrowings,
            "returned_books": returned_books,
            "overdue_count": overdue_count,
            "total_authors": Author.objects.count(),
            "total_categories": Category.objects.count(),
            "new_borrowings_today": new_borrowings_today,
            "daily_borrowings": daily,
            "top_books": top_books,
            "by_category": by_category,
            "recent_borrowings": recent_data,
        })
