"""
PayPal Payment Service
Handles all PayPal API interactions
"""
import os
import requests
import base64
from django.conf import settings


class PayPalService:
    """Service class for PayPal payment operations"""
    
    def __init__(self):
        self.client_id = os.getenv('PAYPAL_CLIENT_ID', '')
        self.client_secret = os.getenv('PAYPAL_CLIENT_SECRET', '')
        self.mode = os.getenv('PAYPAL_MODE', 'sandbox')
        
        # API URLs
        if self.mode == 'live':
            self.base_url = 'https://api-m.paypal.com'
        else:
            self.base_url = 'https://api-m.sandbox.paypal.com'
        
        self._access_token = None
    
    def _get_access_token(self):
        """Get OAuth access token from PayPal"""
        if self._access_token:
            return self._access_token
        
        auth = base64.b64encode(
            f"{self.client_id}:{self.client_secret}".encode()
        ).decode()
        
        headers = {
            'Authorization': f'Basic {auth}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        response = requests.post(
            f'{self.base_url}/v1/oauth2/token',
            headers=headers,
            data={'grant_type': 'client_credentials'}
        )
        
        if response.status_code == 200:
            self._access_token = response.json().get('access_token')
            return self._access_token
        else:
            raise Exception(f"Failed to get PayPal access token: {response.text}")
    
    def _get_headers(self):
        """Get headers for API requests"""
        token = self._get_access_token()
        return {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    
    def create_order(self, amount, currency='USD', description='', order_id=None, return_url=None, cancel_url=None):
        """
        Create a PayPal order
        
        Args:
            amount: Order amount
            currency: Currency code (default: USD)
            description: Order description
            order_id: Internal order ID for reference
            return_url: URL to redirect after payment approval
            cancel_url: URL to redirect if payment is cancelled
        
        Returns:
            dict with paypal_order_id and approval_url
        """
        # Default URLs if not provided
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        if not return_url:
            return_url = f"{frontend_url}/payment/success"
        if not cancel_url:
            cancel_url = f"{frontend_url}/payment/cancel"
        
        payload = {
            'intent': 'CAPTURE',
            'purchase_units': [{
                'reference_id': str(order_id) if order_id else None,
                'description': description,
                'amount': {
                    'currency_code': currency,
                    'value': str(amount)
                }
            }],
            'application_context': {
                'return_url': return_url,
                'cancel_url': cancel_url,
                'brand_name': 'Code2Deploy',
                'landing_page': 'BILLING',
                'user_action': 'PAY_NOW'
            }
        }
        
        response = requests.post(
            f'{self.base_url}/v2/checkout/orders',
            headers=self._get_headers(),
            json=payload
        )
        
        if response.status_code in [200, 201]:
            data = response.json()
            
            # Find the approval URL
            approval_url = None
            for link in data.get('links', []):
                if link.get('rel') == 'approve':
                    approval_url = link.get('href')
                    break
            
            return {
                'paypal_order_id': data.get('id'),
                'status': data.get('status'),
                'approval_url': approval_url,
                'raw_response': data
            }
        else:
            raise Exception(f"Failed to create PayPal order: {response.text}")
    
    def capture_order(self, paypal_order_id):
        """
        Capture (complete) a PayPal order after approval
        
        Args:
            paypal_order_id: The PayPal order ID to capture
        
        Returns:
            dict with capture details
        """
        response = requests.post(
            f'{self.base_url}/v2/checkout/orders/{paypal_order_id}/capture',
            headers=self._get_headers()
        )
        
        if response.status_code in [200, 201]:
            data = response.json()
            
            # Extract capture details
            capture_details = None
            if data.get('purchase_units'):
                captures = data['purchase_units'][0].get('payments', {}).get('captures', [])
                if captures:
                    capture_details = captures[0]
            
            return {
                'paypal_order_id': data.get('id'),
                'status': data.get('status'),
                'payer': data.get('payer', {}),
                'capture_id': capture_details.get('id') if capture_details else None,
                'capture_status': capture_details.get('status') if capture_details else None,
                'raw_response': data
            }
        else:
            raise Exception(f"Failed to capture PayPal order: {response.text}")
    
    def get_order_details(self, paypal_order_id):
        """
        Get details of a PayPal order
        
        Args:
            paypal_order_id: The PayPal order ID
        
        Returns:
            dict with order details
        """
        response = requests.get(
            f'{self.base_url}/v2/checkout/orders/{paypal_order_id}',
            headers=self._get_headers()
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to get PayPal order details: {response.text}")
    
    def refund_payment(self, capture_id, amount=None, currency='USD', note=''):
        """
        Refund a captured payment
        
        Args:
            capture_id: The capture ID to refund
            amount: Amount to refund (None for full refund)
            currency: Currency code
            note: Refund note
        
        Returns:
            dict with refund details
        """
        payload = {}
        if amount:
            payload['amount'] = {
                'currency_code': currency,
                'value': str(amount)
            }
        if note:
            payload['note_to_payer'] = note
        
        response = requests.post(
            f'{self.base_url}/v2/payments/captures/{capture_id}/refund',
            headers=self._get_headers(),
            json=payload
        )
        
        if response.status_code in [200, 201]:
            return response.json()
        else:
            raise Exception(f"Failed to refund PayPal payment: {response.text}")
    
    def verify_webhook_signature(self, headers, body, webhook_id=None):
        """
        Verify a PayPal webhook signature
        
        Args:
            headers: Request headers
            body: Request body
            webhook_id: PayPal webhook ID
        
        Returns:
            bool indicating if signature is valid
        """
        if not webhook_id:
            webhook_id = os.getenv('PAYPAL_WEBHOOK_ID', '')
        
        payload = {
            'auth_algo': headers.get('PAYPAL-AUTH-ALGO'),
            'cert_url': headers.get('PAYPAL-CERT-URL'),
            'transmission_id': headers.get('PAYPAL-TRANSMISSION-ID'),
            'transmission_sig': headers.get('PAYPAL-TRANSMISSION-SIG'),
            'transmission_time': headers.get('PAYPAL-TRANSMISSION-TIME'),
            'webhook_id': webhook_id,
            'webhook_event': body
        }
        
        response = requests.post(
            f'{self.base_url}/v1/notifications/verify-webhook-signature',
            headers=self._get_headers(),
            json=payload
        )
        
        if response.status_code == 200:
            return response.json().get('verification_status') == 'SUCCESS'
        return False


# Create a singleton instance
paypal_service = PayPalService()
