import { BahanAjar, TrackingData, User, TransactionHistory, UPBJJData, PaketBahanAjar } from './types';
import { COVERS } from './assets';

export const upbjjList: UPBJJData[] = [
  { kode: 'JKT', nama: 'Jakarta', expeditions: ['JNE Regular', 'JNE Express', 'Reguler (3-5 hari)', 'Ekspres (1-2 hari)'] },
  { kode: 'BDG', nama: 'Bandung', expeditions: ['JNE Regular', 'JNE Express', 'Pos Indonesia'] },
  { kode: 'SBY', nama: 'Surabaya', expeditions: ['JNE Regular', 'JNE Express', 'Reguler (3-5 hari)', 'Ekspres (1-2 hari)'] },
  { kode: 'MLG', nama: 'Malang', expeditions: ['JNE Regular'] },
  { kode: 'MKS', nama: 'Makassar', expeditions: ['JNE Regular', 'JNE Express', 'Reguler (3-5 hari)', 'Ekspres (1-2 hari)'] },
  { kode: 'PDG', nama: 'Padang', expeditions: ['Reguler (3-5 hari)', 'Ekspres (1-2 hari)'] },
  { kode: 'DPS', nama: 'Denpasar', expeditions: ['Reguler (3-5 hari)', 'Ekspres (1-2 hari)'] }
];

export const kategoriList: string[] = ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based", "Ilmu Sosial", "Manajemen", "Sains", "Keguruan"];

export const paketList: PaketBahanAjar[] = [
  { 
    kode: 'PAKET-UT-001', 
    nama: 'PAKET IPS Dasar', 
    items: [
      { kode: 'EKMA4116', nama: 'Pengantar Manajemen' },
      { kode: 'EKMA4115', nama: 'Pengantar Akuntansi' }
    ],
    harga: 120000 
  },
  { 
    kode: 'PAKET-UT-002', 
    nama: 'PAKET IPA Dasar', 
    items: [
      { kode: 'BIOL4201', nama: 'Biologi Umum (Praktikum)' },
      { kode: 'FISIP4001', nama: 'Dasar-Dasar Sosiologi' }
    ],
    harga: 140000 
  },
  { 
    kode: 'PKT-01', 
    nama: 'Paket Sarjana Hukum', 
    items: [
      { kode: 'HKUM4101', nama: 'Pengantar Ilmu Hukum' },
      { kode: 'HKUM4201', nama: 'Hukum Tata Negara' }
    ],
    harga: 250000 
  },
  { 
    kode: 'PKT-02', 
    nama: 'Paket Sarjana Manajemen', 
    items: [
      { kode: 'EKMA4111', nama: 'Pengantar Bisnis' },
      { kode: 'EKMA4116', nama: 'Manajemen' }
    ],
    harga: 300000 
  },
  { 
    kode: 'PKT-03', 
    nama: 'Paket Sarjana Komunikasi', 
    items: [
      { kode: 'SKOM4101', nama: 'Pengantar Ilmu Komunikasi' },
      { kode: 'SKOM4201', nama: 'Teori Komunikasi' }
    ],
    harga: 280000 
  }
];

export const dataPengguna: User[] = [
  {
    id: 1,
    nama: "Rina Wulandari",
    email: "rina@ut.ac.id",
    password: "rina123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta"
  },
  {
    id: 2,
    nama: "Agus Pranoto",
    email: "agus@ut.ac.id",
    password: "agus123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Makassar"
  },
  {
    id: 3,
    nama: "Siti Marlina",
    email: "siti@ut.ac.id",
    password: "siti123",
    role: "Puslaba",
    lokasi: "Pusat"
  },
  {
    id: 4,
    nama: "Doni Setiawan",
    email: "doni@ut.ac.id",
    password: "doni123",
    role: "Fakultas",
    lokasi: "FISIP"
  },
  {
    id: 5,
    nama: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "password123",
    role: "Administrator",
    lokasi: "Pusat"
  },
  {
    id: 6,
    nama: "Admin Gudang",
    email: "gudang@ut.ac.id",
    password: "password123",
    role: "Admin",
    lokasi: "Kantor Pusat"
  }
];

export const dataBahanAjar: BahanAjar[] = [
  {
    kodeBarang: "EKMA4116",
    namaBarang: "Pengantar Manajemen",
    jenisBarang: "BMP",
    edisi: "2024",
    stok: 28,
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    safety: 20,
    harga: 65000,
    catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
    kodeLokasi: "R1-A3",
    cover: COVERS.PENGANTAR_KOMUNIKASI
  },
  {
    kodeBarang: "EKMA4115",
    namaBarang: "Pengantar Akuntansi",
    jenisBarang: "BMP",
    edisi: "1",
    stok: 7,
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    safety: 15,
    harga: 60000,
    catatanHTML: "<strong>Cover baru</strong>",
    kodeLokasi: "R1-A4",
    cover: COVERS.MANAJEMEN_KEUANGAN
  },
  {
    kodeBarang: "BIOL4201",
    namaBarang: "Biologi Umum (Praktikum)",
    jenisBarang: "BMP",
    edisi: "1",
    stok: 12,
    kategori: "Praktikum",
    upbjj: "Surabaya",
    safety: 10,
    harga: 80000,
    catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
    kodeLokasi: "R3-B2",
    cover: COVERS.MIKROBIOLOGI
  },
  {
    kodeBarang: "FISIP4001",
    namaBarang: "Dasar-Dasar Sosiologi",
    jenisBarang: "BMP",
    edisi: "1",
    stok: 2,
    kategori: "MK Pilihan",
    upbjj: "Makassar",
    safety: 8,
    harga: 55000,
    catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
    kodeLokasi: "R2-C1",
    cover: COVERS.KEPEMIMPINAN
  },
  {
    kodeLokasi: "0TMP01",
    kodeBarang: "SKOM4101",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 548,
    kategori: "Ilmu Sosial",
    upbjj: "Jakarta",
    safety: 100,
    harga: 45000,
    catatanHTML: "Stok baru diterima dari percetakan.",
    cover: COVERS.PENGANTAR_KOMUNIKASI
  },
  {
    kodeLokasi: "0JKT01",
    kodeBarang: "EKMA4213",
    namaBarang: "Manajemen Keuangan",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 85,
    kategori: "Manajemen",
    upbjj: "Jakarta",
    safety: 100,
    harga: 55000,
    catatanHTML: "Perlu segera re-order.",
    cover: COVERS.MANAJEMEN_KEUANGAN
  },
  {
    kodeLokasi: "0SBY02",
    kodeBarang: "ADPU4334",
    namaBarang: "Kepemimpinan",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 0,
    kategori: "Ilmu Sosial",
    upbjj: "Surabaya",
    safety: 50,
    harga: 40000,
    catatanHTML: "Stok kosong, dalam proses pengiriman.",
    cover: COVERS.KEPEMIMPINAN
  },
  {
    kodeLokasi: "0MLG01",
    kodeBarang: "BIOL4223",
    namaBarang: "Mikrobiologi",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 165,
    kategori: "Sains",
    upbjj: "Malang",
    safety: 40,
    harga: 65000,
    catatanHTML: "Stok aman.",
    cover: COVERS.MIKROBIOLOGI
  },
  {
    kodeLokasi: "0UPBJJBDG",
    kodeBarang: "PAUD4306",
    namaBarang: "Perkembangan Anak Usia Dini",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 204,
    kategori: "Keguruan",
    upbjj: "Bandung",
    safety: 30,
    harga: 35000,
    catatanHTML: "-",
    cover: COVERS.PERKEMBANGAN_ANAK
  }
];

export const dataTracking: Record<string, TrackingData> = {
  "DO2025-0001": {
    nomorDO: "DO2025-0001",
    nim: "123456789",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "PAKET-UT-001",
    total: 120000,
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
      { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
    ]
  },
  "DO2025-001": {
    nomorDO: "DO2025-001",
    nim: "041234567",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE Regular",
    tanggalKirim: "2025-05-14",
    paket: "PKT-01",
    total: 250000,
    perjalanan:[
      {
        waktu: "2025-05-14 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-05-14 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      }
    ]
  },
  "DO2025-002": {
    nomorDO: "DO2025-002",
    nim: "042345678",
    nama: "Agus Pranoto",
    status: "Selesai",
    ekspedisi: "JNE Express",
    tanggalKirim: "2025-05-13",
    paket: "PKT-02",
    total: 300000,
    perjalanan:[
      {
        waktu: "2025-05-13 09:00:00",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN"
      },
      {
        waktu: "2025-05-14 20:00:00",
        keterangan: "Selesai Antar. Penerima: Agus Pranoto"
      }
    ]
  }
};

export const dataRiwayatTransaksi: TransactionHistory[] = [
  {
    id: "TRX-2025-001",
    tanggal: "2025-08-26 09:15",
    item: "Pengantar Ilmu Komunikasi (SKOM4101)",
    jenis: "Keluar",
    jumlah: 50,
    petugas: "Siti Marlina",
    keterangan: "Pengiriman ke UPBJJ Jakarta",
    paket: "0JKT01"
  },
  {
    id: "TRX-2025-002",
    tanggal: "2025-08-25 14:30",
    item: "Manajemen Keuangan (EKMA4213)",
    jenis: "Keluar",
    jumlah: 120,
    petugas: "Doni Setiawan",
    keterangan: "Pengiriman Masif Semester 2025.1",
    paket: "0JKT01"
  },
  {
    id: "TRX-2025-003",
    tanggal: "2025-08-24 11:00",
    item: "Kepemimpinan (ADPU4334)",
    jenis: "Masuk",
    jumlah: 500,
    petugas: "Admin Pusat",
    keterangan: "Penerimaan dari Percetakan",
    paket: "0SBY02"
  },
  {
    id: "TRX-2025-004",
    tanggal: "2025-08-24 10:45",
    item: "Mikrobiologi (BIOL4223)",
    jenis: "Keluar",
    jumlah: 15,
    petugas: "Siti Marlina",
    keterangan: "Permintaan Khusus Mahasiswa",
    paket: "0MLG01"
  },
  {
    id: "TRX-2025-005",
    tanggal: "2025-08-23 16:20",
    item: "Perkembangan Anak Usia Dini (PAUD4306)",
    jenis: "Masuk",
    jumlah: 300,
    petugas: "Admin Pusat",
    keterangan: "Restock Gudang Pusat",
    paket: "0UPBJJBDG"
  }
];
