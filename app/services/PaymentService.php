<?php

namespace App\Services;

class PaymentService
{
    private static $apiKey = STRIPE_SECRET_KEY;
    private static $apiUrl = 'https://api.stripe.com/v1';

    public static function createCheckoutSession($config)
    {
        $payload = [
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                    'currency' => strtolower($config['currency']),
                    'product_data' => [
                        'name' => 'Class Booking',
                        'description' => "Booking ID: " . $config['bookingId'],
                    ],
                    'unit_amount' => $config['amount'],
                ],
                'quantity' => 1,
            ]],
            'success_url' => $config['successUrl'],
            'cancel_url' => $config['cancelUrl'],
            'metadata' => array_merge([
                'userId' => $config['userId'],
                'bookingId' => $config['bookingId'],
                'classId' => $config['classId'],
            ], $config['metadata'] ?? [])
        ];

        return self::stripeRequest('checkout/sessions', $payload);
    }

    public static function verifyWebhook($payload, $signature, $webhookSecret)
    {
        // Simple manual verification for Stripe webhooks if SDK not used
        // Header looks like: t=123,v1=sha256...
        $headerParts = explode(',', $signature);
        $timestamp = 0;
        $v1Sig = '';

        foreach ($headerParts as $part) {
            $kv = explode('=', $part);
            if ($kv[0] === 't') $timestamp = $kv[1];
            if ($kv[0] === 'v1') $v1Sig = $kv[1];
        }

        $signedPayload = "$timestamp.$payload";
        $computedMac = hash_hmac('sha256', $signedPayload, $webhookSecret);

        if (hash_equals($computedMac, $v1Sig)) {
            return json_decode($payload, true);
        }

        return null;
    }

    private static function stripeRequest($endpoint, $payload)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, self::$apiUrl . '/' . $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
        curl_setopt($ch, CURLOPT_USERPWD, self::$apiKey . ":");
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);

        if ($httpCode >= 200 && $httpCode < 300) {
            return [
                'sessionId' => $data['id'],
                'url' => $data['url']
            ];
        } else {
            error_log("[Payments] Stripe API error: " . $response);
            return null;
        }
    }
}
