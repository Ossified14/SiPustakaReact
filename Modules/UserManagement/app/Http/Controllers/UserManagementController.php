<?php

namespace Modules\UserManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Modules\UserManagement\Http\Requests\StoreUserRequest;
use Modules\UserManagement\Http\Requests\UpdateUserRequest;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $role = $request->query('role');

        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role) {
            $query->where('role', $role);
        }

        $users = $query->withCount([
            'peminjamans',
            'peminjamans as active_loans_count' => function ($q) {
                $q->where('status', 'dipinjam');
            },
        ])->latest()->paginate(10)->withQueryString();

        return Inertia::render('UserManagement/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'role' => $role ?? '',
            ],
            'roles' => ['admin', 'petugas', 'anggota'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('UserManagement/Create', [
            'roles' => ['admin', 'petugas', 'anggota'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('usermanagement.index')->with('success', 'Pengguna baru berhasil ditambahkan.');
    }

    /**
     * Show the specified resource.
     */
    public function show(int $id): Response
    {
        $user = User::with(['peminjamans' => function ($q) {
            $q->with('buku')->latest();
        }])->findOrFail($id);

        return Inertia::render('UserManagement/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): Response
    {
        $user = User::findOrFail($id);

        return Inertia::render('UserManagement/Edit', [
            'user' => $user,
            'roles' => ['admin', 'petugas', 'anggota'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $validated = $request->validated();

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('usermanagement.index')->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $currentUser = $request->user();
        if ($currentUser && $currentUser->id === $id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user = User::findOrFail($id);
        $activeLoans = $user->peminjamans()->where('status', 'dipinjam')->count();

        if ($activeLoans > 0) {
            return back()->with('error', "Pengguna ini masih memiliki {$activeLoans} buku yang belum dikembalikan.");
        }

        $user->delete();

        return redirect()->route('usermanagement.index')->with('success', 'Pengguna berhasil dihapus.');
    }
}
