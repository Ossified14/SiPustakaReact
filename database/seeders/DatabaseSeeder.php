<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Buku\Database\Seeders\BukuDatabaseSeeder;
use Modules\Peminjaman\Database\Seeders\PeminjamanDatabaseSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Users for each role
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@sipustaka.com'],
            [
                'name' => 'Administrator Perpustakaan',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Petugas
        User::updateOrCreate(
            ['email' => 'petugas@sipustaka.com'],
            [
                'name' => 'Petugas Perpustakaan',
                'role' => 'petugas',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Anggota 1
        User::updateOrCreate(
            ['email' => 'budi@sipustaka.com'],
            [
                'name' => 'Budi Pratama',
                'role' => 'anggota',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Anggota 2
        User::updateOrCreate(
            ['email' => 'siti@sipustaka.com'],
            [
                'name' => 'Siti Rahma',
                'role' => 'anggota',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Anggota 3
        User::updateOrCreate(
            ['email' => 'ahmad@sipustaka.com'],
            [
                'name' => 'Ahmad Fauzi',
                'role' => 'anggota',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed Books
        $this->call(BukuDatabaseSeeder::class);

        // 3. Seed Loans
        $this->call(PeminjamanDatabaseSeeder::class);
    }
}
