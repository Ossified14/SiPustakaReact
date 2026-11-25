<?php

use App\Http\Controllers\DashboardController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Buku\Models\Buku;

Route::get('/', function () {
    $featuredBooks = Buku::select('id', 'judul', 'penulis', 'penerbit', 'tahun_terbit', 'kategori', 'stok', 'cover')
        ->latest()
        ->limit(6)
        ->get();

    $stats = [
        'total_buku' => Buku::count(),
        'total_stok' => (int) Buku::sum('stok'),
        'total_anggota' => User::where('role', 'anggota')->count(),
    ];

    return Inertia::render('welcome', [
        'featured_books' => $featuredBooks,
        'stats' => $stats,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
