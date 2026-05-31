<?php

namespace App\Exceptions;

use Exception;

/**
 * SpringApiException — Exception khi Spring Boot API trả lỗi.
 */
class SpringApiException extends Exception
{
    public function __construct(
        string $message = 'Spring API error',
        int $statusCode = 500,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $statusCode, $previous);
    }
}
