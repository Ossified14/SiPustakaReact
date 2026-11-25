<?php

namespace Modules\Peminjaman\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Buku\Models\Buku;
use Modules\Peminjaman\Http\Requests\StorePeminjamanRequest;
use Modules\Peminjaman\Http\Requests\UpdatePeminjamanRequest;
use Modules\Peminjaman\Models\Peminjaman;

class PeminjamanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Peminjaman::with(['user', 'buku'])->latest();

        if ($user && $user->isAnggota()) {
            $query->where('user_id', $user->id);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('buku', function ($bq) use ($search) {
                    $bq->where('judul', 'like', "%{$search}%");
                })->orWhereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $peminjamans = $query->paginate(10)->withQueryString();

        // Get available books (stock > 0) for quick loan modal
        $availableBooks = Buku::where('stok', '>', 0)
            ->select('id', 'judul', 'penulis', 'stok', 'cover')
            ->orderBy('judul')
            ->get();

        // Get users list for admin/petugas to select
        $users = ($user && ! $user->isAnggota())
            ? User::select('id', 'name', 'email', 'role')->orderBy('name')->get()
            : [];

        return Inertia::render('Peminjaman/Index', [
            'peminjamans' => $peminjamans,
            'availableBooks' => $availableBooks,
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();

        $availableBooks = Buku::where('stok', '>', 0)
            ->select('id', 'judul', 'penulis', 'stok', 'cover')
            ->orderBy('judul')
            ->get();

        $users = ($user && ! $user->isAnggota())
            ? User::select('id', 'name', 'email', 'role')->orderBy('name')->get()
            : [];

        return Inertia::render('Peminjaman/Create', [
            'availableBooks' => $availableBooks,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePeminjamanRequest $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validated();

        $buku = Buku::findOrFail($validated['buku_id']);
        if ($buku->stok <= 0) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Stok buku ini sedang habis.'], 422);
            }

            return back()->with('error', 'Stok buku ini sedang habis.');
        }

        if ($request->hasFile('bukti')) {
            $buktiPath = $request->file('bukti')->store('bukti-peminjaman', 'public');
            $validated['bukti'] = $buktiPath;
        }

        $validated['status'] = 'dipinjam';
        $validated['denda'] = 0;

        DB::transaction(function () use ($validated, $buku) {
            Peminjaman::create($validated);
            $buku->decrement('stok');
        });

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Peminjaman berhasil dicatat.']);
        }

        return redirect()->route('peminjaman.index')->with('success', 'Peminjaman buku berhasil dicatat.');
    }

    /**
     * Show the specified resource.
     */
    public function show(int $id): Response
    {
        $peminjaman = Peminjaman::with(['user', 'buku'])->findOrFail($id);

        return Inertia::render('Peminjaman/Show', [
            'peminjaman' => $peminjaman,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): Response
    {
        $peminjaman = Peminjaman::with(['user', 'buku'])->findOrFail($id);

        return Inertia::render('Peminjaman/Edit', [
            'peminjaman' => $peminjaman,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeminjamanRequest $request, int $id): RedirectResponse|JsonResponse
    {
        $peminjaman = Peminjaman::findOrFail($id);
        $validated = $request->validated();
        $oldStatus = $peminjaman->status;
        $newStatus = $validated['status'];

        if ($request->hasFile('bukti')) {
            if ($peminjaman->bukti && Storage::disk('public')->exists($peminjaman->bukti)) {
                Storage::disk('public')->delete($peminjaman->bukti);
            }
            $buktiPath = $request->file('bukti')->store('bukti-peminjaman', 'public');
            $validated['bukti'] = $buktiPath;
        }

        DB::transaction(function () use ($peminjaman, $validated, $oldStatus, $newStatus) {
            $buku = $peminjaman->buku;

            if ($oldStatus === 'dipinjam' && $newStatus === 'dikembalikan') {
                if ($buku) {
                    $buku->increment('stok');
                }
                if (empty($validated['tanggal_pengembalian'])) {
                    $validated['tanggal_pengembalian'] = Carbon::today()->toDateString();
                }

                // Calculate fine if overdue and not provided
                if (! isset($validated['denda']) || $validated['denda'] === null) {
                    $tglKembali = Carbon::parse($peminjaman->tanggal_kembali);
                    $tglPengembalian = Carbon::parse($validated['tanggal_pengembalian']);
                    if ($tglPengembalian->gt($tglKembali)) {
                        $hariTerlambat = $tglPengembalian->diffInDays($tglKembali);
                        $validated['denda'] = $hariTerlambat * 1000;
                    } else {
                        $validated['denda'] = 0;
                    }
                }
            } elseif ($oldStatus === 'dikembalikan' && $newStatus === 'dipinjam') {
                if ($buku) {
                    $buku->decrement('stok');
                }
                $validated['tanggal_pengembalian'] = null;
            }

            $peminjaman->update($validated);
        });

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Status peminjaman berhasil diperbarui.']);
        }

        return redirect()->route('peminjaman.index')->with('success', 'Status peminjaman berhasil diperbarui.');
    }

    /**
     * Quick return action.
     */
    public function kembalikan(Request $request, int $id): RedirectResponse|JsonResponse
    {
        $peminjaman = Peminjaman::findOrFail($id);

        if ($peminjaman->status === 'dikembalikan') {
            return back()->with('error', 'Buku ini sudah dikembalikan.');
        }

        DB::transaction(function () use ($peminjaman) {
            $buku = $peminjaman->buku;
            if ($buku) {
                $buku->increment('stok');
            }

            $today = Carbon::today();
            $denda = 0;
            $tglKembali = Carbon::parse($peminjaman->tanggal_kembali);
            if ($today->gt($tglKembali)) {
                $hariTerlambat = $today->diffInDays($tglKembali);
                $denda = $hariTerlambat * 1000;
            }

            $peminjaman->update([
                'status' => 'dikembalikan',
                'tanggal_pengembalian' => $today->toDateString(),
                'denda' => $denda,
            ]);
        });

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Buku berhasil dikembalikan.']);
        }

        return back()->with('success', 'Buku berhasil dikembalikan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $peminjaman = Peminjaman::findOrFail($id);

        DB::transaction(function () use ($peminjaman) {
            if ($peminjaman->status === 'dipinjam') {
                $buku = $peminjaman->buku;
                if ($buku) {
                    $buku->increment('stok');
                }
            }

            if ($peminjaman->bukti && Storage::disk('public')->exists($peminjaman->bukti)) {
                Storage::disk('public')->delete($peminjaman->bukti);
            }

            $peminjaman->delete();
        });

        return redirect()->route('peminjaman.index')->with('success', 'Data peminjaman berhasil dihapus.');
    }
}
