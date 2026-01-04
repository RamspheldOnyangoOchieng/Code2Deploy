from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Program, Enrollment
from .serializers import ProgramSerializer, EnrollmentSerializer, MessageSerializer, ProgramStatsSerializer

# Create your views here.

class ProgramListCreateView(generics.ListCreateAPIView):
    queryset = Program.objects.all().order_by('-created_at')
    serializer_class = ProgramSerializer

class ProgramRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

class EnrollInProgramView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    def post(self, request, program_id):
        user = request.user
        try:
            program = Program.objects.get(pk=program_id)
        except Program.DoesNotExist:
            return Response({'detail': 'Program not found.'}, status=status.HTTP_404_NOT_FOUND)
        enrollment, created = Enrollment.objects.get_or_create(user=user, program=program)
        if not created:
            return Response({'detail': 'Already enrolled.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from users.views import UserEnrollmentsView
class UserEnrollmentsViewWithFilter(UserEnrollmentsView):
    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

class UserProgramStatsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProgramStatsSerializer
    def get(self, request):
        user = request.user
        total = Enrollment.objects.filter(user=user).count()
        ongoing = Enrollment.objects.filter(user=user, status='ongoing').count()
        completed = Enrollment.objects.filter(user=user, status='completed').count()
        return Response({'total': total, 'ongoing': ongoing, 'completed': completed})
