from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Q
from django.utils import timezone
from .models import Notification, NotificationPreference
from .serializers import (
    NotificationSerializer, NotificationListSerializer,
    NotificationPreferenceSerializer, NotificationStatsSerializer,
    MessageSerializer
)


class UserNotificationsView(generics.ListAPIView):
    """User: Get their notifications with filtering"""
    serializer_class = NotificationListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user)
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by notification type
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Filter by date range
        days = self.request.query_params.get('days')
        if days:
            try:
                days = int(days)
                from datetime import timedelta
                date_from = timezone.now() - timedelta(days=days)
                queryset = queryset.filter(created_at__gte=date_from)
            except ValueError:
                pass
        
        return queryset


class NotificationDetailView(generics.RetrieveAPIView):
    """User: Get detailed notification"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class MarkNotificationReadView(APIView):
    """User: Mark notification as read"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id, 
                user=request.user
            )
        except Notification.DoesNotExist:
            return Response({'detail': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        notification.mark_as_read()
        return Response({'detail': 'Notification marked as read.'})


class MarkAllNotificationsReadView(APIView):
    """User: Mark all notifications as read"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def post(self, request):
        user = request.user
        unread_notifications = Notification.objects.filter(
            user=user, 
            status='unread'
        )
        
        for notification in unread_notifications:
            notification.mark_as_read()
        
        return Response({'detail': f'Marked {unread_notifications.count()} notifications as read.'})


class ArchiveNotificationView(APIView):
    """User: Archive notification"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id, 
                user=request.user
            )
        except Notification.DoesNotExist:
            return Response({'detail': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        notification.mark_as_archived()
        return Response({'detail': 'Notification archived.'})


class NotificationStatsView(APIView):
    """User: Get notification statistics"""
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationStatsSerializer
    
    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user)
        
        stats = {
            'total_notifications': notifications.count(),
            'unread_count': notifications.filter(status='unread').count(),
            'read_count': notifications.filter(status='read').count(),
            'archived_count': notifications.filter(status='archived').count(),
            'by_type': {},
            'by_priority': {}
        }
        
        # Count by notification type
        for notification_type, _ in Notification.NOTIFICATION_TYPES:
            stats['by_type'][notification_type] = notifications.filter(
                notification_type=notification_type
            ).count()
        
        # Count by priority
        for priority, _ in Notification.PRIORITY_CHOICES:
            stats['by_priority'][priority] = notifications.filter(
                priority=priority
            ).count()
        
        return Response(stats)


class NotificationPreferencesView(generics.RetrieveUpdateAPIView):
    """User: Get and update notification preferences"""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        user = self.request.user
        preferences, created = NotificationPreference.objects.get_or_create(user=user)
        return preferences


class AdminNotificationManagementView(APIView):
    """Admin: Send notifications to users"""
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        notification_type = request.data.get('notification_type')
        title = request.data.get('title')
        message = request.data.get('message')
        user_ids = request.data.get('user_ids', [])
        priority = request.data.get('priority', 'medium')
        action_url = request.data.get('action_url')
        action_text = request.data.get('action_text')
        
        if not all([notification_type, title, message]):
            return Response(
                {'detail': 'notification_type, title, and message are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        if user_ids:
            users = User.objects.filter(id__in=user_ids)
        else:
            # Send to all users if no specific users provided
            users = User.objects.filter(is_active=True)
        
        notifications = []
        for user in users:
            notification = Notification(
                user=user,
                notification_type=notification_type,
                title=title,
                message=message,
                priority=priority,
                action_url=action_url,
                action_text=action_text
            )
            notifications.append(notification)
        
        created_notifications = Notification.objects.bulk_create(notifications)
        
        return Response({
            'detail': f'Successfully sent {len(created_notifications)} notifications.',
            'sent_count': len(created_notifications)
        })


class AdminNotificationsListView(generics.ListAPIView):
    """Admin: List all notifications across all users"""
    serializer_class = NotificationListSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = Notification.objects.all().select_related('user').order_by('-created_at')
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by notification type
        notification_type = self.request.query_params.get('notification_type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Search by title or message
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(message__icontains=search)
            )
        
        return queryset


class AdminNotificationStatsView(APIView):
    """Admin: Get system-wide notification statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = NotificationStatsSerializer
    
    def get(self, request):
        notifications = Notification.objects.all()
        
        stats = {
            'total_notifications': notifications.count(),
            'unread_count': notifications.filter(status='unread').count(),
            'read_count': notifications.filter(status='read').count(),
            'archived_count': notifications.filter(status='archived').count(),
            'by_type': {},
            'by_priority': {},
            'recent_activity': {
                'last_24_hours': notifications.filter(
                    created_at__gte=timezone.now() - timezone.timedelta(days=1)
                ).count(),
                'last_7_days': notifications.filter(
                    created_at__gte=timezone.now() - timezone.timedelta(days=7)
                ).count(),
                'last_30_days': notifications.filter(
                    created_at__gte=timezone.now() - timezone.timedelta(days=30)
                ).count(),
            }
        }
        
        # Count by notification type
        for notification_type, _ in Notification.NOTIFICATION_TYPES:
            stats['by_type'][notification_type] = notifications.filter(
                notification_type=notification_type
            ).count()
        
        # Count by priority
        for priority, _ in Notification.PRIORITY_CHOICES:
            stats['by_priority'][priority] = notifications.filter(
                priority=priority
            ).count()
        
        return Response(stats)


class DeleteNotificationView(APIView):
    """User: Delete a notification"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def delete(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id, 
                user=request.user
            )
        except Notification.DoesNotExist:
            return Response({'detail': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        notification.delete()
        return Response({'detail': 'Notification deleted.'})


class ClearAllNotificationsView(APIView):
    """User: Clear all notifications"""
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def delete(self, request):
        user = request.user
        status_filter = request.query_params.get('status')
        
        if status_filter:
            notifications = Notification.objects.filter(user=user, status=status_filter)
        else:
            notifications = Notification.objects.filter(user=user)
        
        count = notifications.count()
        notifications.delete()
        
        return Response({'detail': f'Deleted {count} notifications.'}) 