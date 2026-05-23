from django.urls import path
from . import views

urlpatterns = [
    path("",               views.BorrowingListCreateView.as_view(), name="borrowing-list"),
    path("<int:pk>/",      views.BorrowingDetailView.as_view(),     name="borrowing-detail"),
    path("<int:pk>/return/", views.ReturnBookView.as_view(),        name="borrowing-return"),
    path("mine/",          views.MyBorrowingsView.as_view(),        name="my-borrowings"),
]
