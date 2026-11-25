<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Buku\Models\Buku;
use Modules\Peminjaman\Models\Peminjaman;

class DashboardController extends Controller
{
    /**
     * Display library dashboard statistics and recent activities.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Overall stats
        $totalBuku = Buku::count();
        $totalStok = (int) Buku::sum('stok');
        $peminjamanAktif = Peminjaman::where('status', 'dipinjam')->count();
        $totalAnggota = User::where('role', 'anggota')->count();
        $totalPetugas = User::whereIn('role', ['admin', 'petugas'])->count();

        // Recent transactions
        $transaksiTerbaru = Peminjaman::with(['user', 'buku'])
            ->latest()
            ->limit(6)
            ->get();

        // Books with low stock alert
        $bukuStokMenipis = Buku::where('stok', '<=', 2)
            ->orderBy('stok')
            ->limit(5)
            ->get();

        // User specific stats if role is anggota
        $userStats = null;
        if ($user && $user->isAnggota()) {
            $userStats = [
                'aktif' => Peminjaman::where('user_id', $user->id)->where('status', 'dipinjam')->count(),
                'dikembalikan' => Peminjaman::where('user_id', $user->id)->where('status', 'dikembalikan')->count(),
                'terlambat' => Peminjaman::where('user_id', $user->id)->where('status', 'terlambat')->count(),
                'riwayat' => Peminjaman::with('buku')->where('user_id', $user->id)->latest()->limit(5)->get(),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_buku' => $totalBuku,
                'total_stok' => $totalStok,
                'peminjaman_aktif' => $peminjamanAktif,
                'total_anggota' => $totalAnggota,
                'total_petugas' => $totalPetugas,
            ],
            'transaksi_terbaru' => $transaksiTerbaru,
            'buku_stok_menipis' => $bukuStokMenipis,
            'user_stats' => $userStats,
        ]);
    }
}
