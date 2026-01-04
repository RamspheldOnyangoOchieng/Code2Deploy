from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import AuditLog, SecurityEvent, SystemHealth, RateLimitLog, DataPrivacyLog
from rest_framework import serializers


class MessageSerializer(serializers.Serializer):
    detail = serializers.CharField()

class SecurityStatsSerializer(serializers.Serializer):
    audit_logs = serializers.DictField()
    security_events = serializers.DictField()
    rate_limiting = serializers.DictField()
    system_health = serializers.DictField()


class SecurityDashboardView(APIView):
    """Admin: Security dashboard with comprehensive statistics"""
    permission_classes = [IsAdminUser]
    serializer_class = SecurityStatsSerializer
    
    def get(self, request):
        # Get date ranges
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        seven_days_ago = now - timedelta(days=7)
        twenty_four_hours_ago = now - timedelta(hours=24)
        
        # Audit log statistics
        total_audit_logs = AuditLog.objects.count()
        recent_audit_logs = AuditLog.objects.filter(created_at__gte=seven_days_ago).count()
        audit_logs_24h = AuditLog.objects.filter(created_at__gte=twenty_four_hours_ago).count()
        
        # Security event statistics
        total_security_events = SecurityEvent.objects.count()
        unresolved_security_events = SecurityEvent.objects.filter(resolved=False).count()
        critical_security_events = SecurityEvent.objects.filter(severity='critical', resolved=False).count()
        recent_security_events = SecurityEvent.objects.filter(created_at__gte=seven_days_ago).count()
        
        # Rate limiting statistics
        total_rate_limit_logs = RateLimitLog.objects.count()
        blocked_requests_24h = RateLimitLog.objects.filter(
            action_taken='blocked',
            created_at__gte=twenty_four_hours_ago
        ).count()
        
        # System health statistics
        system_health_status = SystemHealth.objects.filter(
            created_at__gte=twenty_four_hours_ago
        ).order_by('-created_at').first()
        
        # Top security events by type
        security_events_by_type = SecurityEvent.objects.values('event_type').annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        # Top IP addresses with security events
        top_suspicious_ips = SecurityEvent.objects.values('ip_address').annotate(
            count=Count('id')
        ).filter(ip_address__isnull=False).order_by('-count')[:10]
        
        # Recent audit logs
        recent_audit_logs_list = AuditLog.objects.select_related('user').order_by('-created_at')[:20]
        
        stats = {
            'audit_logs': {
                'total': total_audit_logs,
                'recent_7_days': recent_audit_logs,
                'last_24_hours': audit_logs_24h,
                'recent_logs': [
                    {
                        'action': log.action,
                        'user': log.user.username if log.user else 'System',
                        'description': log.description,
                        'created_at': log.created_at.isoformat()
                    } for log in recent_audit_logs_list
                ]
            },
            'security_events': {
                'total': total_security_events,
                'unresolved': unresolved_security_events,
                'critical': critical_security_events,
                'recent_7_days': recent_security_events,
                'by_type': list(security_events_by_type),
                'top_suspicious_ips': list(top_suspicious_ips)
            },
            'rate_limiting': {
                'total_logs': total_rate_limit_logs,
                'blocked_24h': blocked_requests_24h
            },
            'system_health': {
                'status': system_health_status.status if system_health_status else 'unknown',
                'component': system_health_status.component if system_health_status else None,
                'message': system_health_status.message if system_health_status else None
            }
        }
        
        return Response(stats)


class AuditLogView(APIView):
    """Admin: View audit logs with filtering"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        # Get query parameters
        action = request.query_params.get('action')
        user_id = request.query_params.get('user_id')
        ip_address = request.query_params.get('ip_address')
        days = request.query_params.get('days', 30)
        
        # Build queryset
        queryset = AuditLog.objects.select_related('user')
        
        # Apply filters
        if action:
            queryset = queryset.filter(action=action)
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        if ip_address:
            queryset = queryset.filter(ip_address=ip_address)
        
        # Filter by date range
        try:
            days = int(days)
            date_from = timezone.now() - timedelta(days=days)
            queryset = queryset.filter(created_at__gte=date_from)
        except ValueError:
            pass
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 50))
        start = (page - 1) * page_size
        end = start + page_size
        
        audit_logs = queryset[start:end]
        
        log_data = []
        for log in audit_logs:
            log_data.append({
                'id': log.id,
                'action': log.action,
                'description': log.description,
                'user': {
                    'id': log.user.id,
                    'username': log.user.username,
                    'email': log.user.email
                } if log.user else None,
                'ip_address': log.ip_address,
                'user_agent': log.user_agent,
                'metadata': log.metadata,
                'created_at': log.created_at.isoformat()
            })
        
        return Response({
            'audit_logs': log_data,
            'total_count': queryset.count(),
            'page': page,
            'page_size': page_size
        })


class SecurityEventView(APIView):
    """Admin: View and manage security events"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        # Get query parameters
        event_type = request.query_params.get('event_type')
        severity = request.query_params.get('severity')
        resolved = request.query_params.get('resolved')
        days = request.query_params.get('days', 30)
        
        # Build queryset
        queryset = SecurityEvent.objects.select_related('user', 'resolved_by')
        
        # Apply filters
        if event_type:
            queryset = queryset.filter(event_type=event_type)
        
        if severity:
            queryset = queryset.filter(severity=severity)
        
        if resolved is not None:
            resolved_bool = resolved.lower() == 'true'
            queryset = queryset.filter(resolved=resolved_bool)
        
        # Filter by date range
        try:
            days = int(days)
            date_from = timezone.now() - timedelta(days=days)
            queryset = queryset.filter(created_at__gte=date_from)
        except ValueError:
            pass
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 50))
        start = (page - 1) * page_size
        end = start + page_size
        
        security_events = queryset[start:end]
        
        event_data = []
        for event in security_events:
            event_data.append({
                'id': event.id,
                'event_type': event.event_type,
                'severity': event.severity,
                'description': event.description,
                'user': {
                    'id': event.user.id,
                    'username': event.user.username,
                    'email': event.user.email
                } if event.user else None,
                'ip_address': event.ip_address,
                'user_agent': event.user_agent,
                'details': event.details,
                'resolved': event.resolved,
                'resolved_at': event.resolved_at.isoformat() if event.resolved_at else None,
                'resolved_by': {
                    'id': event.resolved_by.id,
                    'username': event.resolved_by.username
                } if event.resolved_by else None,
                'created_at': event.created_at.isoformat()
            })
        
        return Response({
            'security_events': event_data,
            'total_count': queryset.count(),
            'page': page,
            'page_size': page_size
        })
    
    def patch(self, request, event_id):
        """Resolve a security event"""
        try:
            event = SecurityEvent.objects.get(id=event_id)
        except SecurityEvent.DoesNotExist:
            return Response({'detail': 'Security event not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if event.resolved:
            return Response({'detail': 'Security event is already resolved.'}, status=status.HTTP_400_BAD_REQUEST)
        
        event.resolved = True
        event.resolved_at = timezone.now()
        event.resolved_by = request.user
        event.save()
        
        return Response({'detail': 'Security event resolved successfully.'})


class SystemHealthView(APIView):
    """Admin: View system health and monitoring data"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        # Get query parameters
        component = request.query_params.get('component')
        status_filter = request.query_params.get('status')
        hours = request.query_params.get('hours', 24)
        
        # Build queryset
        queryset = SystemHealth.objects.all()
        
        # Apply filters
        if component:
            queryset = queryset.filter(component=component)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by time range
        try:
            hours = int(hours)
            time_from = timezone.now() - timedelta(hours=hours)
            queryset = queryset.filter(created_at__gte=time_from)
        except ValueError:
            pass
        
        # Get latest status for each component
        components = queryset.values('component').distinct()
        health_data = []
        
        for comp in components:
            latest = queryset.filter(component=comp['component']).order_by('-created_at').first()
            if latest:
                health_data.append({
                    'component': latest.component,
                    'status': latest.status,
                    'message': latest.message,
                    'response_time': latest.response_time,
                    'error_rate': latest.error_rate,
                    'uptime': latest.uptime,
                    'metrics': latest.metrics,
                    'created_at': latest.created_at.isoformat()
                })
        
        return Response({
            'system_health': health_data,
            'total_components': len(health_data),
            'healthy_components': len([h for h in health_data if h['status'] == 'healthy']),
            'warning_components': len([h for h in health_data if h['status'] == 'warning']),
            'critical_components': len([h for h in health_data if h['status'] == 'critical'])
        })


class RateLimitMonitoringView(APIView):
    """Admin: Monitor rate limiting activity"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        # Get query parameters
        limit_type = request.query_params.get('limit_type')
        action_taken = request.query_params.get('action_taken')
        hours = request.query_params.get('hours', 24)
        
        # Build queryset
        queryset = RateLimitLog.objects.select_related('user')
        
        # Apply filters
        if limit_type:
            queryset = queryset.filter(limit_type=limit_type)
        
        if action_taken:
            queryset = queryset.filter(action_taken=action_taken)
        
        # Filter by time range
        try:
            hours = int(hours)
            time_from = timezone.now() - timedelta(hours=hours)
            queryset = queryset.filter(created_at__gte=time_from)
        except ValueError:
            pass
        
        # Get statistics
        total_requests = queryset.count()
        blocked_requests = queryset.filter(action_taken='blocked').count()
        allowed_requests = queryset.filter(action_taken='allowed').count()
        
        # Top IP addresses
        top_ips = queryset.values('ip_address').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Recent logs
        recent_logs = queryset.order_by('-created_at')[:20]
        
        log_data = []
        for log in recent_logs:
            log_data.append({
                'id': log.id,
                'limit_type': log.limit_type,
                'ip_address': log.ip_address,
                'user_agent': log.user_agent,
                'request_count': log.request_count,
                'limit_threshold': log.limit_threshold,
                'window_seconds': log.window_seconds,
                'action_taken': log.action_taken,
                'user': {
                    'id': log.user.id,
                    'username': log.user.username
                } if log.user else None,
                'created_at': log.created_at.isoformat()
            })
        
        return Response({
            'statistics': {
                'total_requests': total_requests,
                'blocked_requests': blocked_requests,
                'allowed_requests': allowed_requests,
                'block_rate': (blocked_requests / total_requests * 100) if total_requests > 0 else 0
            },
            'top_ips': list(top_ips),
            'recent_logs': log_data
        })


class DataPrivacyView(APIView):
    """Admin: View data privacy and GDPR compliance logs"""
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer
    
    def get(self, request):
        # Get query parameters
        action = request.query_params.get('action')
        user_id = request.query_params.get('user_id')
        days = request.query_params.get('days', 30)
        
        # Build queryset
        queryset = DataPrivacyLog.objects.select_related('user')
        
        # Apply filters
        if action:
            queryset = queryset.filter(action=action)
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Filter by date range
        try:
            days = int(days)
            date_from = timezone.now() - timedelta(days=days)
            queryset = queryset.filter(created_at__gte=date_from)
        except ValueError:
            pass
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 50))
        start = (page - 1) * page_size
        end = start + page_size
        
        privacy_logs = queryset[start:end]
        
        log_data = []
        for log in privacy_logs:
            log_data.append({
                'id': log.id,
                'action': log.action,
                'description': log.description,
                'user': {
                    'id': log.user.id,
                    'username': log.user.username,
                    'email': log.user.email
                } if log.user else None,
                'data_categories': log.data_categories,
                'legal_basis': log.legal_basis,
                'retention_period': log.retention_period,
                'ip_address': log.ip_address,
                'user_agent': log.user_agent,
                'created_at': log.created_at.isoformat()
            })
        
        return Response({
            'privacy_logs': log_data,
            'total_count': queryset.count(),
            'page': page,
            'page_size': page_size
        }) 