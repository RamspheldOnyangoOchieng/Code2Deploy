from django.urls import path
from .views import ContactSubmissionView, ContactMessageListView

urlpatterns = [
    path('', ContactSubmissionView.as_view(), name='contact-submit'),
    path('list/', ContactMessageListView.as_view(), name='contact-list'),
]
