<?php

namespace Modules\Peminjaman\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePeminjamanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasRole(['admin', 'petugas']) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:dipinjam,dikembalikan,terlambat,hilang'],
            'tanggal_kembali' => ['nullable', 'date'],
            'tanggal_pengembalian' => ['nullable', 'date'],
            'denda' => ['nullable', 'integer', 'min:0'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'bukti' => ['nullable', 'file', 'mimes:pdf,jpeg,png,jpg,webp', 'max:5120'],
        ];
    }
}
