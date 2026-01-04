from django.shortcuts import render
from rest_framework import generics
from .models import Mentor
from .serializers import MentorSerializer

# Create your views here.

class MentorListCreateView(generics.ListCreateAPIView):
    queryset = Mentor.objects.all().order_by('-created_at')
    serializer_class = MentorSerializer

class MentorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer
