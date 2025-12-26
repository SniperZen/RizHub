<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VideosTableSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();
        
        $videos = [
            ['id' => 1, 'kabanata_id' => 1, 'title' => 'Kabanata 1: Ang Pagtitipon', 'youtube_id' => 'Oy-HT0nlexQ', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'kabanata_id' => 2, 'title' => 'Kabanata 2: Si Crisostomo Ibarra', 'youtube_id' => 'g_zpQPmPnaI', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'kabanata_id' => 3, 'title' => 'Kabanata 3: Ang Hapunan', 'youtube_id' => 'qP5Jgbtwq6k', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'kabanata_id' => 4, 'title' => 'Kabanata 4: Erehe at Pilibustero', 'youtube_id' => 'wUGE8RPJYRA', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'kabanata_id' => 5, 'title' => 'Kabanata 5: Pangarap sa Gabing Madilim', 'youtube_id' => 'aWFTGAqbhGs', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'kabanata_id' => 6, 'title' => 'Kabanata 6: Si Kapitan Tiyago', 'youtube_id' => 'ouGjYr4Iy_Y', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 7, 'kabanata_id' => 7, 'title' => 'Kabanata 7: Suyuan sa Asotea', 'youtube_id' => 'jfVQNQBzuvg', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 8, 'kabanata_id' => 8, 'title' => 'Kabanata 8: Mga Alaala', 'youtube_id' => 'hMa-umoNn3A', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 9, 'kabanata_id' => 9, 'title' => 'Kabanata 9: Mga Bagay-bagay Tungkol sa Bayan', 'youtube_id' => '6zuX6knG6Hs', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 10, 'kabanata_id' => 10, 'title' => 'Kabanata 10: Ang San Diego', 'youtube_id' => 'yU1QoMcFHcU', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 11, 'kabanata_id' => 11, 'title' => 'Kabanata 11: Ang mga Makapangyarihan', 'youtube_id' => '7ZEX2ji4pkQ', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 12, 'kabanata_id' => 12, 'title' => 'Kabanata 12: Araw ng mga Patay', 'youtube_id' => 'um2loURFoow', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 13, 'kabanata_id' => 13, 'title' => 'Kabanata 13: Mga Banta ng Unos', 'youtube_id' => 'QBuwbn2gb6w', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 14, 'kabanata_id' => 14, 'title' => 'Kabanata 14: Si Pilosopo Tasyo', 'youtube_id' => 'CFowB5ttrcU', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 15, 'kabanata_id' => 15, 'title' => 'Kabanata 15: Ang mga Sakristan', 'youtube_id' => 'mjhQz2RCif0', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 16, 'kabanata_id' => 16, 'title' => 'Kabanata 16: Si Sisa', 'youtube_id' => 'rUU61BIziDQ', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 17, 'kabanata_id' => 17, 'title' => 'Kabanata 17: Si Basilio', 'youtube_id' => 'OXdrq_ozh18', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 18, 'kabanata_id' => 18, 'title' => 'Kabanata 18: Mga Kaluluwang Naghihirap', 'youtube_id' => 'TJmGROV6ub4', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 19, 'kabanata_id' => 19, 'title' => 'Kabanata 19: Ang Guro', 'youtube_id' => '3qcIIWmDoVc', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 20, 'kabanata_id' => 20, 'title' => 'Kabanata 20: Ang Pulong sa Tribunal', 'youtube_id' => 'BOlIO_paMrM', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 21, 'kabanata_id' => 21, 'title' => 'Kabanata 21: Kuwento ng Isang Ina', 'youtube_id' => 'XW1hddWvAXc', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 22, 'kabanata_id' => 22, 'title' => 'Kabanata 22: Liwanag at Dilim', 'youtube_id' => '13g4jSBFdm0', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 23, 'kabanata_id' => 23, 'title' => 'Kabanata 23: Ang Piknik', 'youtube_id' => 'EB8lZ9EkRtI', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 24, 'kabanata_id' => 24, 'title' => 'Kabanata 24: Sa Kagubatan', 'youtube_id' => 'BeLmTk4oJ5I', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 25, 'kabanata_id' => 25, 'title' => 'Kabanata 25: Sa Bahay ng Pilosopo', 'youtube_id' => 'k1JymHlsOQ0', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 26, 'kabanata_id' => 26, 'title' => 'Kabanata 26: Bisperas ng Pista', 'youtube_id' => '7ejxJYRCiLk', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 27, 'kabanata_id' => 27, 'title' => 'Kabanata 27: Takipsilim sa Pista', 'youtube_id' => 'AM53CDpJEOs', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 28, 'kabanata_id' => 28, 'title' => 'Kabanata 28: Mga Unang Batingaw', 'youtube_id' => 'k1lKwp-UnOI', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 29, 'kabanata_id' => 29, 'title' => 'Kabanata 29: Umaga ng Pista', 'youtube_id' => 'X4A7pWQlDHU', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 30, 'kabanata_id' => 30, 'title' => 'Kabanata 30: Sa Simbahan', 'youtube_id' => 'GED1AUodgyE', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 31, 'kabanata_id' => 31, 'title' => 'Kabanata 31: Ang Sermon', 'youtube_id' => 'jVrfEirfHc8', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 32, 'kabanata_id' => 32, 'title' => 'Kabanata 32: Ang Dulang Pranses', 'youtube_id' => 'Q-DZmU8D_Po', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 33, 'kabanata_id' => 33, 'title' => 'Kabanata 33: Ang mga Pilibustero', 'youtube_id' => 'ozVp2VtIDsI', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 34, 'kabanata_id' => 34, 'title' => 'Kabanata 34: Ang Pananghalian', 'youtube_id' => 'FgbxUUeEfgU', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 35, 'kabanata_id' => 35, 'title' => 'Kabanata 35: Mga Komentaryo', 'youtube_id' => 'P6wf4_xDyvQ', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 36, 'kabanata_id' => 36, 'title' => 'Kabanata 36: Ang Unang Suliranin', 'youtube_id' => 'q8zCzz0BEOU', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 37, 'kabanata_id' => 37, 'title' => 'Kabanata 37: Ang Kapitan Heneral', 'youtube_id' => '8Go-fOiAM3s', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 38, 'kabanata_id' => 38, 'title' => 'Kabanata 38: Ang Prusisyon', 'youtube_id' => 'MXmONRQjbbk', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 39, 'kabanata_id' => 39, 'title' => 'Kabanata 39: Si Donya Consolacion', 'youtube_id' => 'nukaua5So6k', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 40, 'kabanata_id' => 40, 'title' => 'Kabanata 40: Parehong Karapatan, Parehong Hilig', 'youtube_id' => 'r-EsHvjgZVE', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 41, 'kabanata_id' => 41, 'title' => 'Kabanata 41: Dalawang Panauhin', 'youtube_id' => 'zZJjHxlIJns', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 42, 'kabanata_id' => 42, 'title' => 'Kabanata 42: Ang Mag-asawang de Espadaña', 'youtube_id' => 'qyIlcWjT8o0', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 43, 'kabanata_id' => 43, 'title' => 'Kabanata 43: Mga Plano', 'youtube_id' => 'cDMSJFb0NkY', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 44, 'kabanata_id' => 44, 'title' => 'Kabanata 44: Pagtitika at Pagsisisi', 'youtube_id' => 'vyE_34q1aZ0', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 45, 'kabanata_id' => 45, 'title' => 'Kabanata 45: Ang mga Inaaning Bunga', 'youtube_id' => 'w6QFrC9UMhQ', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 46, 'kabanata_id' => 46, 'title' => 'Kabanata 46: Ang Mga Kaguluhan', 'youtube_id' => 'ZmERBBCOXWs', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 47, 'kabanata_id' => 47, 'title' => 'Kabanata 47: Ang mga Paskin', 'youtube_id' => 'bECnFSQagZQ', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 48, 'kabanata_id' => 48, 'title' => 'Kabanata 48: Talinghaga', 'youtube_id' => 'p1oxLiu4aeo', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 49, 'kabanata_id' => 49, 'title' => 'Kabanata 49: Ang Tinig ng mga Nasasakdal', 'youtube_id' => 'iYr_s4D90oc', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 50, 'kabanata_id' => 50, 'title' => 'Kabanata 50: Ang mga Kaanak ni Elias', 'youtube_id' => 'vXYaQO8zDis', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 51, 'kabanata_id' => 51, 'title' => 'Kabanata 51: Mga Pagbabago', 'youtube_id' => 'FbPJsweasos', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 52, 'kabanata_id' => 52, 'title' => 'Kabanata 52: Ang Baraha ng Patay at ang mga Anino', 'youtube_id' => 'BHSkK4dPalc', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 53, 'kabanata_id' => 53, 'title' => 'Kabanata 53: Ang Mabuting Araw ay Nakikilala sa Umaga', 'youtube_id' => 'aIgZG4hIF2o', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 54, 'kabanata_id' => 54, 'title' => 'Kabanata 54: Lihim ng Isang Gabi', 'youtube_id' => 'x07hHdtwFy8', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 55, 'kabanata_id' => 55, 'title' => 'Kabanata 55: Ang Pagbagsak', 'youtube_id' => 'px8cdDIbvJE', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 56, 'kabanata_id' => 56, 'title' => 'Kabanata 56: Ang Sabi-sabi', 'youtube_id' => 'aBRinvmw9KQ', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 57, 'kabanata_id' => 57, 'title' => 'Kabanata 57: Ang mga Anino', 'youtube_id' => 'Q5GNX4pnFdM', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 58, 'kabanata_id' => 58, 'title' => 'Kabanata 58: Ang mga Sinapit', 'youtube_id' => 'RzxBtleI21Q', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 59, 'kabanata_id' => 59, 'title' => 'Kabanata 59: Ang Paghihiganti', 'youtube_id' => 'mWL40dbwgNY', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 60, 'kabanata_id' => 60, 'title' => 'Kabanata 60: Ikakasal na si Maria Clara', 'youtube_id' => 'KUMEn9ollSo', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 61, 'kabanata_id' => 61, 'title' => 'Kabanata 61: Ang Paghahabulan sa Lawa', 'youtube_id' => '06a60t0G5fg', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 62, 'kabanata_id' => 62, 'title' => 'Kabanata 62: Ang Pagtatapat ni Padre Damaso', 'youtube_id' => 'NMxd7MROBbU', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 63, 'kabanata_id' => 63, 'title' => 'Kabanata 63: Ang Noche Buena', 'youtube_id' => 'fx8J-zJ8OtE', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 64, 'kabanata_id' => 64, 'title' => 'Kabanata 64: Ang Katapusan', 'youtube_id' => 'zLGcQ4FY9IE', 'duration' => 0, 'created_at' => $now, 'updated_at' => $now],
        ];
        
        // Insert in chunks
        foreach (array_chunk($videos, 20) as $chunk) {
            DB::table('videos')->insert($chunk);
        }
        
        $this->command->info('Successfully seeded ' . count($videos) . ' video records.');
    }
}