<?php

return [
    'auth' => [
        'access_denied' => 'Truy cập bị từ chối: Yêu cầu quyền Admin.',
        'missing_code' => 'Không nhận được mã xác thực từ máy chủ.',
        'exchange_failed' => 'Trao đổi mã xác thực thất bại.',
        'auth_failed' => 'Xác thực thất bại.',
        'expired_session' => 'Phiên đăng nhập đã hết hạn. Vui lòng thử lại.',
        'no_access_token' => 'Không có access_token trong phản hồi',
    ],
    'user' => [
        'fetch_failed' => 'Không thể tải danh sách người dùng: :message',
        'fetch_failed_single' => 'Không thể tải thông tin người dùng: :message',
        'deleted' => 'Đã xóa user thành công',
        'delete_failed' => 'Xóa thất bại: :message',
        'updated' => 'Cập nhật người dùng thành công.',
        'update_failed' => 'Cập nhật người dùng thất bại.',
    ],
    'product' => [
        'fetch_failed' => 'Không thể tải danh sách sản phẩm: :message',
        'fetch_failed_single' => 'Không thể tải sản phẩm: :message',
    ],
    'order' => [
        'fetch_failed' => 'Không thể tải danh sách đơn hàng: :message',
        'fetch_failed_single' => 'Không thể tải đơn hàng: :message',
        'cancelled' => 'Đơn hàng đã được hủy',
        'cancel_failed' => 'Không thể hủy đơn hàng: :message',
    ],
    'error' => [
        'token_exchange' => 'Trao đổi token thất bại: :message',
        'jwt_validation' => 'Xác thực JWT thất bại: :message',
        'spring_api' => 'Lỗi Spring API: :message',
        'spring_api_default' => 'Lỗi Spring API',
    ],
    'log' => [
        'token_exchange_failed' => 'OIDC token exchange thất bại',
        'missing_access_token' => 'OIDC token exchange thiếu access_token',
        'jwt_validation_failed' => 'OIDC JWT validation thất bại',
    ],
];
