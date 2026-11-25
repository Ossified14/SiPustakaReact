<?php

use Illuminate\Support\Facades\Route;
use Modules\Peminjaman\Http\Controllers\PeminjamanController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('peminjamen', [PeminjamanController::class, 'index'])->name('peminjaman.index');
    Route::get('peminjaman', [PeminjamanController::class, 'index']); // Alias

    Route::get('peminjamen/create', [PeminjamanController::class, 'create'])->name('peminjaman.create');
    Route::post('peminjamen', [PeminjamanController::class, 'store'])->name('peminjaman.store');

    Route::middleware('role:admin,petugas')->group(function () {
        Route::post('peminjamen/{peminjaman}/kembalikan', [PeminjamanController::class, 'kembalikan'])->name('peminjaman.kembalikan');
        Route::get('peminjamen/{peminjaman}/edit', [PeminjamanController::class, 'edit'])->name('peminjaman.edit');
        Route::put('peminjamen/{peminjaman}', [PeminjamanController::class, 'update'])->name('peminjaman.update');
        Route::delete('peminjamen/{peminjaman}', [PeminjamanController::class, 'destroy'])->name('peminjaman.destroy');
    });

    Route::get('peminjamen/{peminjaman}', [PeminjamanController::class, 'show'])->name('peminjaman.show');
});
