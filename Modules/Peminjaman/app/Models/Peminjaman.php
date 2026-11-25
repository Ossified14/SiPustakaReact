<?php

namespace Modules\Peminjaman\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Modules\Buku\Models\Buku;

/**
 * @property int $id
 * @property int $user_id
 * @property int $buku_id
 * @property Carbon $tanggal_pinjam
 * @property Carbon $tanggal_kembali
 * @property Carbon|null $tanggal_pengembalian
 * @property string $status
 * @property int $denda
 * @property string|null $catatan
 * @property string|null $bukti
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $user
 * @property-read Buku|null $buku
 * @property-read string|null $bukti_url
 */
class Peminjaman extends Model
{
    use HasFactory;

    protected $table = 'peminjamans';

    protected $fillable = [
        'user_id',
        'buku_id',
        'tanggal_pinjam',
        'tanggal_kembali',
        'tanggal_pengembalian',
        'status',
        'denda',
        'catatan',
        'bukti',
    ];

    protected $casts = [
        'tanggal_pinjam' => 'date',
        'tanggal_kembali' => 'date',
        'tanggal_pengembalian' => 'date',
        'denda' => 'integer',
    ];

    protected $appends = [
        'bukti_url',
    ];

    public function getBuktiUrlAttribute(): ?string
    {
        if (! $this->bukti) {
            return null;
        }

        if (str_starts_with($this->bukti, 'http://') || str_starts_with($this->bukti, 'https://')) {
            return $this->bukti;
        }

        return Storage::url($this->bukti);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Buku, $this>
     */
    public function buku(): BelongsTo
    {
        return $this->belongsTo(Buku::class, 'buku_id');
    }
}
