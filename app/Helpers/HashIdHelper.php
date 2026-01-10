<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Crypt;

class HashIdHelper
{
    /**
     * Encrypt an ID for URL
     */
    public static function encrypt($id)
    {
        return base64_encode(Crypt::encryptString($id));
    }

    /**
     * Decrypt an encrypted ID from URL
     */
    public static function decrypt($encryptedId)
    {
        try {
            return Crypt::decryptString(base64_decode($encryptedId));
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Simple hash for client-side use (less secure but works for hiding IDs)
     */
    public static function simpleHash($id)
    {
        return base64_encode($id . '_' . md5($id . config('app.key')));
    }

    /**
     * Simple unhash for client-side use
     */
    public static function simpleUnhash($hash)
    {
        try {
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
            return null;
        }
    }
}