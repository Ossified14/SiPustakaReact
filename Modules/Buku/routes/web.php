<?php

use Illuminate\Support\Facades\Route;
use Modules\Buku\Http\Controllers\BukuController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('role:admin,petugas')->group(function () {
        Route::get('bukus/create', [BukuController::class, 'create'])->name('buku.create');
        Route::post('bukus', [BukuController::class, 'store'])->name('buku.store');
        Route::get('bukus/{buku}/edit', [BukuController::class, 'edit'])->name('buku.edit');
        Route::put('bukus/{buku}', [BukuController::class, 'update'])->name('buku.update');
        Route::delete('bukus/{buku}', [BukuController::class, 'destroy'])->name('buku.destroy');
    });

    Route::get('bukus', [BukuController::class, 'index'])->name('buku.index');
    Route::get('bukus/{buku}', [BukuController::class, 'show'])->name('buku.show');
});
