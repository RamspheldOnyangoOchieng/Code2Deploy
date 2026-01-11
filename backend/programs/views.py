from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status
from .models import Program, Enrollment
from .serializers import ProgramSerializer, EnrollmentSerializer, MessageSerializer, ProgramStatsSerializer

# Create your views here.

class ProgramListCreateView(generics.ListCreateAPIView):
    queryset = Program.objects.all().order_by('-created_at')
    serializer_class = ProgramSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class ProgramRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

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


class EnrollInProgramBodyView(APIView):
    """
    Enrollment endpoint that accepts program_id in request body.
    Also accepts optional enrollment_details for additional data.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        program_id = request.data.get('program_id')
        enrollment_details = request.data.get('enrollment_details', {})
        
        if not program_id:
            return Response({'detail': 'program_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            program = Program.objects.get(pk=program_id)
        except Program.DoesNotExist:
            return Response({'detail': 'Program not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already enrolled
        existing_enrollment = Enrollment.objects.filter(user=user, program=program).first()
        if existing_enrollment:
            return Response({'detail': 'Already enrolled in this program.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create enrollment
        enrollment = Enrollment.objects.create(
            user=user,
            program=program,
            status='ongoing',
            progress=0.0
        )
        
        # Store enrollment details as JSON if provided (you may want to add a JSONField to your model)
        # For now, we'll just log them or you can extend the Enrollment model
        if enrollment_details:
            # You could store these in a separate model or add fields to Enrollment
            # For now, we'll just include them in the response
            pass
        
        serializer = EnrollmentSerializer(enrollment)
        response_data = serializer.data
        response_data['enrollment_details'] = enrollment_details
        response_data['program_title'] = program.title
        response_data['scholarship'] = program.scholarship_available
        
        return Response(response_data, status=status.HTTP_201_CREATED)


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

