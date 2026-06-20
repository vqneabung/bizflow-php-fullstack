<?php

return [
    'auth' => [
        'access_denied' => 'Access denied: Admin role required.',
        'missing_code' => 'No authorization code received from server.',
        'exchange_failed' => 'Failed to exchange authorization code.',
        'auth_failed' => 'Authentication failed.',
        'expired_session' => 'Session expired. Please try again.',
        'no_access_token' => 'No access_token in response',
    ],
    'user' => [
        'fetch_failed' => 'Failed to fetch users: :message',
        'fetch_failed_single' => 'Failed to fetch user: :message',
        'deleted' => 'User deleted successfully',
        'delete_failed' => 'Delete failed: :message',
        'updated' => 'User updated successfully.',
        'update_failed' => 'Update failed: :message',
    ],
    'product' => [
        'fetch_failed' => 'Failed to fetch products: :message',
        'fetch_failed_single' => 'Failed to fetch product: :message',
    ],
    'order' => [
        'fetch_failed' => 'Failed to fetch orders: :message',
        'fetch_failed_single' => 'Failed to fetch order: :message',
        'cancelled' => 'Order has been cancelled',
        'cancel_failed' => 'Failed to cancel order: :message',
    ],
    'error' => [
        'token_exchange' => 'Token exchange failed: :message',
        'jwt_validation' => 'JWT validation failed: :message',
        'spring_api' => 'Spring API error: :message',
        'spring_api_default' => 'Spring API error',
    ],
    'log' => [
        'token_exchange_failed' => 'OIDC token exchange failed',
        'missing_access_token' => 'OIDC token exchange missing access_token',
        'jwt_validation_failed' => 'OIDC JWT validation failed',
    ],
];
