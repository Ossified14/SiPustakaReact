<?php

namespace Modules\Peminjaman\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Modules\Buku\Models\Buku;
use Modules\Peminjaman\Models\Peminjaman;

class PeminjamanDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $budi = User::where('email', 'budi@sipustaka.com')->first();
        $siti = User::where('email', 'siti@sipustaka.com')->first();
        $ahmad = User::where('email', 'ahmad@sipustaka.com')->first();

        $buku1 = Buku::first();
        $buku2 = Buku::skip(1)->first();
        $buku3 = Buku::skip(2)->first();
        $buku4 = Buku::skip(3)->first();

        if ($budi && $buku1) {
            // Active loan
            Peminjaman::firstOrCreate([
                'user_id' => $budi->id,
                'buku_id' => $buku1->id,
            ], [
                'tanggal_pinjam' => Carbon::today()->subDays(3)->toDateString(),
                'tanggal_kembali' => Carbon::today()->addDays(4)->toDateString(),
                'status' => 'dipinjam',
                'denda' => 0,
                'catatan' => 'Referensi bahan penelitian dan kajian literatur ilmiah.',
            ]);
        }

        if ($budi && $buku4) {
            // Returned loan
            Peminjaman::firstOrCreate([
                'user_id' => $budi->id,
                'buku_id' => $buku4->id,
            ], [
                'tanggal_pinjam' => Carbon::today()->subDays(14)->toDateString(),
                'tanggal_kembali' => Carbon::today()->subDays(7)->toDateString(),
                'tanggal_pengembalian' => Carbon::today()->subDays(7)->toDateString(),
                'status' => 'dikembalikan',
                'denda' => 0,
                'catatan' => 'Buku dikembalikan dalam kondisi sangat baik.',
            ]);
        }

        if ($siti && $buku2) {
            // Active loan
            Peminjaman::firstOrCreate([
                'user_id' => $siti->id,
                'buku_id' => $buku2->id,
            ], [
                'tanggal_pinjam' => Carbon::today()->subDays(2)->toDateString(),
                'tanggal_kembali' => Carbon::today()->addDays(5)->toDateString(),
                'status' => 'dipinjam',
                'denda' => 0,
                'catatan' => 'Referensi bahan riset metodologi.',
            ]);
        }

        if ($ahmad && $buku3) {
            // Overdue loan
            Peminjaman::firstOrCreate([
                'user_id' => $ahmad->id,
                'buku_id' => $buku3->id,
            ], [
                'tanggal_pinjam' => Carbon::today()->subDays(12)->toDateString(),
                'tanggal_kembali' => Carbon::today()->subDays(5)->toDateString(),
                'status' => 'terlambat',
                'denda' => 5000,
                'catatan' => 'Terlambat 5 hari dari tenggat waktu semula.',
            ]);
        }
    }
}
