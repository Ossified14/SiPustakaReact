<?php

use App\Models\User;
use Modules\Buku\Models\Buku;
use Modules\Peminjaman\Models\Peminjaman;

test('admin can access usermanagements, anggota is forbidden', function () {
    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    $anggota = User::factory()->create(['role' => 'anggota', 'email_verified_at' => now()]);

    $this->actingAs($admin)
        ->get(route('usermanagement.index'))
        ->assertOk();

    $this->actingAs($anggota)
        ->get(route('usermanagement.index'))
        ->assertForbidden();
});

test('dashboard displays library statistics', function () {
    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);

    Buku::create([
        'judul' => 'Test Buku 1',
        'penulis' => 'Penulis 1',
        'penerbit' => 'Penerbit 1',
        'tahun_terbit' => 2024,
        'kategori' => 'Teknologi',
        'stok' => 5,
    ]);

    $response = $this->actingAs($admin)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard')
        ->has('stats.total_buku')
        ->has('stats.total_stok')
        ->has('stats.peminjaman_aktif')
        ->has('stats.total_anggota')
    );
});

test('petugas or admin can create and update buku', function () {
    $petugas = User::factory()->create(['role' => 'petugas', 'email_verified_at' => now()]);

    $response = $this->actingAs($petugas)->post(route('buku.store'), [
        'judul' => 'Laravel & React Mastery',
        'penulis' => 'Taylor & Dan',
        'penerbit' => 'Tech Press',
        'tahun_terbit' => 2025,
        'kategori' => 'Teknologi & Komputer',
        'stok' => 10,
        'deskripsi' => 'Buku panduan lengkap.',
    ]);

    $response->assertRedirect(route('buku.index'));
    $this->assertDatabaseHas('bukus', [
        'judul' => 'Laravel & React Mastery',
        'stok' => 10,
    ]);
});

test('borrowing book automatically decrements stock and returning increments stock', function () {
    $admin = User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    $anggota = User::factory()->create(['role' => 'anggota', 'email_verified_at' => now()]);

    $buku = Buku::create([
        'judul' => 'Belajar Inertia.js',
        'penulis' => 'Senior Dev',
        'penerbit' => 'Inertia Press',
        'tahun_terbit' => 2024,
        'kategori' => 'Teknologi',
        'stok' => 3,
    ]);

    // 1. Borrow book
    $borrowResponse = $this->actingAs($admin)->post(route('peminjaman.store'), [
        'user_id' => $anggota->id,
        'buku_id' => $buku->id,
        'tanggal_pinjam' => now()->toDateString(),
        'tanggal_kembali' => now()->addDays(7)->toDateString(),
    ]);

    $borrowResponse->assertRedirect(route('peminjaman.index'));

    // Stock should be decremented from 3 to 2
    $buku->refresh();
    expect($buku->stok)->toBe(2);

    $peminjaman = Peminjaman::where('buku_id', $buku->id)->first();
    expect($peminjaman)->not->toBeNull();
    expect($peminjaman->status)->toBe('dipinjam');

    // 2. Return book
    $returnResponse = $this->actingAs($admin)->post(route('peminjaman.kembalikan', $peminjaman->id));
    $returnResponse->assertRedirect();

    // Stock should be incremented back to 3
    $buku->refresh();
    expect($buku->stok)->toBe(3);

    $peminjaman->refresh();
    expect($peminjaman->status)->toBe('dikembalikan');
    expect($peminjaman->tanggal_pengembalian)->not->toBeNull();
});
