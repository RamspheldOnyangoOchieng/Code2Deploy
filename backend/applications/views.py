from django.shortcuts import render
from rest_framework import generics
from .models import Application
from .serializers import ApplicationSerializer

# Create your views here.

class ApplicationListCreateView(generics.ListCreateAPIView):
    queryset = Application.objects.all().order_by('-submission_date')
    serializer_class = ApplicationSerializer

class ApplicationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
