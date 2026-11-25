<?php

use Illuminate\Support\Facades\Route;
use Modules\UserManagement\Http\Controllers\UserManagementController;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('usermanagements', [UserManagementController::class, 'index'])->name('usermanagement.index');
    Route::get('user-management', [UserManagementController::class, 'index']); // Alias
    Route::get('usermanagements/create', [UserManagementController::class, 'create'])->name('usermanagement.create');
    Route::post('usermanagements', [UserManagementController::class, 'store'])->name('usermanagement.store');
    Route::get('usermanagements/{usermanagement}', [UserManagementController::class, 'show'])->name('usermanagement.show');
    Route::get('usermanagements/{usermanagement}/edit', [UserManagementController::class, 'edit'])->name('usermanagement.edit');
    Route::put('usermanagements/{usermanagement}', [UserManagementController::class, 'update'])->name('usermanagement.update');
    Route::delete('usermanagements/{usermanagement}', [UserManagementController::class, 'destroy'])->name('usermanagement.destroy');
});
