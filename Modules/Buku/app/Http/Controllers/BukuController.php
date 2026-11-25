<?php

namespace Modules\Buku\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Buku\Http\Requests\StoreBukuRequest;
use Modules\Buku\Http\Requests\UpdateBukuRequest;
use Modules\Buku\Models\Buku;

class BukuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $kategori = $request->query('kategori');

        $query = Buku::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('penulis', 'like', "%{$search}%")
                    ->orWhere('penerbit', 'like', "%{$search}%");
            });
        }

        if ($kategori) {
            $query->where('kategori', $kategori);
        }

        $bukus = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = Buku::select('kategori')
            ->distinct()
            ->whereNotNull('kategori')
            ->orderBy('kategori')
            ->pluck('kategori');

        return Inertia::render('Buku/Index', [
            'bukus' => $bukus,
            'filters' => [
                'search' => $search ?? '',
                'kategori' => $kategori ?? '',
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Buku/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBukuRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('buku-covers', 'public');
            $validated['cover'] = $coverPath;
        }

        Buku::create($validated);

        return redirect()->route('buku.index')->with('success', 'Buku berhasil ditambahkan.');
    }

    /**
     * Show the specified resource.
     */
    public function show(int $id): Response
    {
        $buku = Buku::with(['peminjamans' => function ($q) {
            $q->with('user')->latest()->limit(5);
        }])->findOrFail($id);

        return Inertia::render('Buku/Show', [
            'buku' => $buku,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): Response
    {
        $buku = Buku::findOrFail($id);

        return Inertia::render('Buku/Edit', [
            'buku' => $buku,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBukuRequest $request, int $id): RedirectResponse
    {
        $buku = Buku::findOrFail($id);
        $validated = $request->validated();

        if ($request->hasFile('cover')) {
            if ($buku->cover && Storage::disk('public')->exists($buku->cover)) {
                Storage::disk('public')->delete($buku->cover);
            }
            $coverPath = $request->file('cover')->store('buku-covers', 'public');
            $validated['cover'] = $coverPath;
        }

        $buku->update($validated);

        return redirect()->route('buku.index')->with('success', 'Buku berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $buku = Buku::findOrFail($id);

        $hasActiveLoan = $buku->peminjamans()->where('status', 'dipinjam')->exists();
        if ($hasActiveLoan) {
            return back()->with('error', 'Tidak dapat menghapus buku yang sedang dalam status dipinjam.');
        }

        if ($buku->cover && Storage::disk('public')->exists($buku->cover)) {
            Storage::disk('public')->delete($buku->cover);
        }

        $buku->delete();

        return redirect()->route('buku.index')->with('success', 'Buku berhasil dihapus.');
    }
}
