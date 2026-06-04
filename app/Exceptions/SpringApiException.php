<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

/**
 * SpringApiException — Exception khi Spring Boot API trả lỗi.
 */
class SpringApiException extends Exception
{
    public function __construct(
        string $message = '',
        int $statusCode = 500,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message ?: __('messages.error.spring_api_default'), $statusCode, $previous);
    }
}
