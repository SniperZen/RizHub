<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Crypt;

class HashIdHelper
{
    /**
     * Encrypt an ID for URL (URL-safe version)
     */
    public static function encrypt($id)
    {
        $encrypted = Crypt::encryptString($id);
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($encrypted));
    }

    /**
     * Decrypt an encrypted ID from URL (URL-safe version)
     */
    public static function decrypt($encryptedId)
    {
        try {
            // Replace URL-safe characters back
            $encryptedId = str_replace(['-', '_'], ['+', '/'], $encryptedId);
            // Add padding if needed
            $padding = strlen($encryptedId) % 4;
            if ($padding > 0) {
                $encryptedId .= str_repeat('=', 4 - $padding);
            }
            
            return Crypt::decryptString(base64_decode($encryptedId));
        } catch (\Exception $e) {
            \Log::error('Decryption failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Simple hash for client-side use (URL-safe)
     */
    public static function simpleHash($id)
    {
        $hash = base64_encode($id . '_' . md5($id . config('app.key')));
        return str_replace(['+', '/', '='], ['-', '_', ''], $hash);
    }

    /**
     * Simple unhash for client-side use (URL-safe)
     */
    public static function simpleUnhash($hash)
    {
        try {
            // Replace URL-safe characters back
            $hash = str_replace(['-', '_'], ['+', '/'], $hash);
            // Add padding if needed
            $padding = strlen($hash) % 4;
            if ($padding > 0) {
                $hash .= str_repeat('=', 4 - $padding);
            }
            
            $decoded = base64_decode($hash);
            $parts = explode('_', $decoded);
            if (count($parts) === 2) {
                $id = $parts[0];
                $checksum = $parts[1];
                if (md5($id . config('app.key')) === $checksum) {
                    return $id;
                }
            }
            return null;
        } catch (\Exception $e) {
            \Log::error('Unhash failed: ' . $e->getMessage());
            return null;
        }
    }
}