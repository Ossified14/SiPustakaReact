<?php

namespace Modules\Buku\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Buku\Models\Buku;

class BukuDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            [
                'judul' => 'Clean Code: A Handbook of Agile Software Craftsmanship',
                'penulis' => 'Robert C. Martin',
                'penerbit' => 'Prentice Hall',
                'tahun_terbit' => 2008,
                'kategori' => 'Teknologi & Komputer',
                'stok' => 5,
                'deskripsi' => 'Panduan komprehensif tentang penulisan kode yang bersih, mudah dipelihara, dan memiliki standar industri software engineering modern.',
            ],
            [
                'judul' => 'The Pragmatic Programmer: Your Journey To Mastery',
                'penulis' => 'David Thomas, Andrew Hunt',
                'penerbit' => 'Addison-Wesley',
                'tahun_terbit' => 2019,
                'kategori' => 'Teknologi & Komputer',
                'stok' => 4,
                'deskripsi' => 'Salah satu buku pemrograman paling berpengaruh yang membahas filosofi, arsitektur, dan best practice rekayasa perangkat lunak.',
            ],
            [
                'judul' => 'Refactoring: Improving the Design of Existing Code',
                'penulis' => 'Martin Fowler',
                'penerbit' => 'Addison-Wesley Professional',
                'tahun_terbit' => 2018,
                'kategori' => 'Teknologi & Komputer',
                'stok' => 3,
                'deskripsi' => 'Teknik merombak kode legacy menjadi arsitektur yang solid tanpa mengubah fungsionalitas eksternalnya.',
            ],
            [
                'judul' => 'Laskar Pelangi',
                'penulis' => 'Andrea Hirata',
                'penerbit' => 'Bentang Pustaka',
                'tahun_terbit' => 2005,
                'kategori' => 'Sastra & Fiksi',
                'stok' => 6,
                'deskripsi' => 'Kisah inspiratif tentang sepuluh anak Belitong yang berjuang meraih pendidikan di tengah keterbatasan fasilitas sekolah dasar.',
            ],
            [
                'judul' => 'Bumi Manusia',
                'penulis' => 'Pramoedya Ananta Toer',
                'penerbit' => 'Hasta Mitra',
                'tahun_terbit' => 1980,
                'kategori' => 'Sastra & Fiksi',
                'stok' => 2,
                'deskripsi' => 'Karya sastra legendaris Tetralogi Buru yang merekam pergulatan batin Minke dan Annelies di masa kolonial Hindia Belanda.',
            ],
            [
                'judul' => 'Filosofi Teras: Panduan Stoikisme Hidup Tenang',
                'penulis' => 'Henry Manampiring',
                'penerbit' => 'Penerbit Buku Kompas',
                'tahun_terbit' => 2018,
                'kategori' => 'Pengembangan Diri',
                'stok' => 8,
                'deskripsi' => 'Penerapan filosofi Stoik Yunani-Romawi kuno dalam menghadapi stres, kecemasan, dan tantangan kehidupan modern di era digital.',
            ],
            [
                'judul' => 'Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa',
                'penulis' => 'James Clear',
                'penerbit' => 'Gramedia Pustaka Utama',
                'tahun_terbit' => 2019,
                'kategori' => 'Pengembangan Diri',
                'stok' => 1,
                'deskripsi' => 'Kerangka kerja praktis berbasis ilmu psikologi untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk secara bertahap.',
            ],
            [
                'judul' => 'Sapiens: Riwayat Singkat Umat Manusia',
                'penulis' => 'Yuval Noah Harari',
                'penerbit' => 'Kepustakaan Populer Gramedia (KPG)',
                'tahun_terbit' => 2014,
                'kategori' => 'Sejarah & Budaya',
                'stok' => 4,
                'deskripsi' => 'Eksplorasi mendalam mengenai bagaimana spesies kera tak penting di Afrika timur mampu menjadi penguasa dominan di planet bumi.',
            ],
            [
                'judul' => 'Thinking, Fast and Slow',
                'penulis' => 'Daniel Kahneman',
                'penerbit' => 'Farrar, Straus and Giroux',
                'tahun_terbit' => 2011,
                'kategori' => 'Bisnis & Ekonomi',
                'stok' => 3,
                'deskripsi' => 'Penjelasan peraih nobel tentang dua sistem berpikir manusia yang mengendalikan proses pengambilan keputusan rasional dan emosional.',
            ],
            [
                'judul' => 'Design Patterns: Elements of Reusable Object-Oriented Software',
                'penulis' => 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
                'penerbit' => 'Addison-Wesley',
                'tahun_terbit' => 1994,
                'kategori' => 'Teknologi & Komputer',
                'stok' => 2,
                'deskripsi' => 'Buku klasik Gang of Four (GoF) yang mempopulerkan 23 pola desain perangkat lunak berorientasi objek yang esensial.',
            ],
        ];

        foreach ($books as $book) {
            Buku::firstOrCreate(
                ['judul' => $book['judul']],
                $book
            );
        }
    }
}
