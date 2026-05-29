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

export const pengirimanList = [
  { kode: "REG", nama: "Reguler (3-5 hari)" },
  { kode: "EXP", nama: "Ekspres (1-2 hari)" }
];

export const paketList: PaketBahanAjar[] = [
  { 
    kode: 'PAKET-UT-001', 
    nama: 'PAKET IPS Dasar', 
    isi: ['EKMA4116', 'EKMA4115'],
    items: [
      { kode: 'EKMA4116', nama: 'Pengantar Manajemen' },
      { kode: 'EKMA4115', nama: 'Pengantar Akuntansi' }
    ],
    harga: 120000 
  },
  { 
    kode: 'PAKET-UT-002', 
    nama: 'PAKET IPA Dasar', 
    isi: ['BIOL4201', 'FISIP4001'],
    items: [
      { kode: 'BIOL4201', nama: 'Biologi Umum (Praktikum)' },
      { kode: 'FISIP4001', nama: 'Dasar-Dasar Sosiologi' }
    ],
    harga: 140000 
  },
  { 
    kode: 'PKT-01', 
    nama: 'Paket Sarjana Hukum', 
    isi: ['HKUM4101', 'HKUM4201'],
    items: [
      { kode: 'HKUM4101', nama: 'Pengantar Ilmu Hukum' },
      { kode: 'HKUM4201', nama: 'Hukum Tata Negara' }
    ],
    harga: 250000 
  },
  { 
    kode: 'PKT-02', 
    nama: 'Paket Sarjana Manajemen', 
    isi: ['EKMA4111', 'EKMA4116'],
    items: [
      { kode: 'EKMA4111', nama: 'Pengantar Bisnis' },
      { kode: 'EKMA4116', nama: 'Manajemen' }
    ],
    harga: 300000 
  },
  { 
    kode: 'PKT-03', 
    nama: 'Paket Sarjana Komunikasi', 
    isi: ['SKOM4101', 'SKOM4201'],
    items: [
      { kode: 'SKOM4101', nama: 'Pengantar Ilmu Komunikasi' },
      { kode: 'SKOM4201', nama: 'Teori Komunikasi' }
    ],
    harga: 280000 
  }
];

export const paket = paketList;

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

const defaultBahanAjar: BahanAjar[] = [
  {
    kode: "EKMA4116",
    judul: "Pengantar Manajemen",
    jenisBarang: "BMP",
    edisi: "2024",
    qty: 28,
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    safety: 20,
    harga: 65000,
    catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
    lokasiRak: "R1-A3",
    cover: COVERS.PENGANTAR_KOMUNIKASI,
    kodeBarang: "EKMA4116",
    namaBarang: "Pengantar Manajemen",
    stok: 28,
    kodeLokasi: "R1-A3"
  },
  {
    kode: "EKMA4115",
    judul: "Pengantar Akuntansi",
    jenisBarang: "BMP",
    edisi: "1",
    qty: 7,
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    safety: 15,
    harga: 60000,
    catatanHTML: "<strong>Cover baru</strong>",
    lokasiRak: "R1-A4",
    cover: COVERS.MANAJEMEN_KEUANGAN,
    kodeBarang: "EKMA4115",
    namaBarang: "Pengantar Akuntansi",
    stok: 7,
    kodeLokasi: "R1-A4"
  },
  {
    kode: "BIOL4201",
    judul: "Biologi Umum (Praktikum)",
    jenisBarang: "BMP",
    edisi: "1",
    qty: 12,
    kategori: "Praktikum",
    upbjj: "Surabaya",
    safety: 10,
    harga: 80000,
    catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
    lokasiRak: "R3-B2",
    cover: COVERS.MIKROBIOLOGI,
    kodeBarang: "BIOL4201",
    namaBarang: "Biologi Umum (Praktikum)",
    stok: 12,
    kodeLokasi: "R3-B2"
  },
  {
    kode: "FISIP4001",
    judul: "Dasar-Dasar Sosiologi",
    jenisBarang: "BMP",
    edisi: "1",
    qty: 2,
    kategori: "MK Pilihan",
    upbjj: "Makassar",
    safety: 8,
    harga: 55000,
    catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
    lokasiRak: "R2-C1",
    cover: COVERS.KEPEMIMPINAN,
    kodeBarang: "FISIP4001",
    namaBarang: "Dasar-Dasar Sosiologi",
    stok: 2,
    kodeLokasi: "R2-C1"
  },
  {
    kode: "SKOM4101",
    judul: "Pengantar Ilmu Komunikasi",
    jenisBarang: "BMP",
    edisi: "3",
    qty: 548,
    kategori: "Ilmu Sosial",
    upbjj: "Jakarta",
    safety: 100,
    harga: 45000,
    catatanHTML: "Stok baru diterima dari percetakan.",
    lokasiRak: "R1-A5",
    cover: COVERS.PENGANTAR_KOMUNIKASI,
    kodeBarang: "SKOM4101",
    namaBarang: "Pengantar Ilmu Komunikasi",
    stok: 548,
    kodeLokasi: "R1-A5"
  },
  {
    kode: "EKMA4213",
    judul: "Manajemen Keuangan",
    jenisBarang: "BMP",
    edisi: "3",
    qty: 85,
    kategori: "Manajemen",
    upbjj: "Jakarta",
    safety: 100,
    harga: 55000,
    catatanHTML: "Perlu segera re-order.",
    lokasiRak: "R1-A7",
    cover: COVERS.MANAJEMEN_KEUANGAN,
    kodeBarang: "EKMA4213",
    namaBarang: "Manajemen Keuangan",
    stok: 85,
    kodeLokasi: "R1-A7"
  },
  {
    kode: "ADPU4334",
    judul: "Kepemimpinan",
    jenisBarang: "BMP",
    edisi: "2",
    qty: 0,
    kategori: "Ilmu Sosial",
    upbjj: "Surabaya",
    safety: 50,
    harga: 40000,
    catatanHTML: "Stok kosong, dalam proses pengiriman.",
    lokasiRak: "R1-A2",
    cover: COVERS.KEPEMIMPINAN,
    kodeBarang: "ADPU4334",
    namaBarang: "Kepemimpinan",
    stok: 0,
    kodeLokasi: "R1-A2"
  },
  {
    kode: "BIOL4223",
    judul: "Mikrobiologi",
    jenisBarang: "BMP",
    edisi: "3",
    qty: 165,
    kategori: "Sains",
    upbjj: "Malang",
    safety: 40,
    harga: 65000,
    catatanHTML: "Stok aman.",
    lokasiRak: "R1-A9",
    cover: COVERS.MIKROBIOLOGI,
    kodeBarang: "BIOL4223",
    namaBarang: "Mikrobiologi",
    stok: 165,
    kodeLokasi: "R1-A9"
  },
  {
    kode: "PAUD4306",
    judul: "Perkembangan Anak Usia Dini",
    jenisBarang: "BMP",
    edisi: "2",
    qty: 204,
    kategori: "Keguruan",
    upbjj: "Bandung",
    safety: 30,
    harga: 35000,
    catatanHTML: "-",
    lokasiRak: "R1-A1",
    cover: COVERS.PERKEMBANGAN_ANAK,
    kodeBarang: "PAUD4306",
    namaBarang: "Perkembangan Anak Usia Dini",
    stok: 204,
    kodeLokasi: "R1-A1"
  }
];

const getInitialBahanAjar = (): BahanAjar[] => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('sitta_bahan_ajar');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BahanAjar[];
        const merged = [...parsed];
        defaultBahanAjar.forEach(def => {
          if (!merged.some(m => m.kode === def.kode || m.kodeBarang === def.kode)) {
            merged.push(def);
          }
        });
        return merged;
      } catch (e) {
        return defaultBahanAjar;
      }
    }
  }
  return defaultBahanAjar;
};

export const dataBahanAjar: BahanAjar[] = getInitialBahanAjar();
export const stok = dataBahanAjar;

const defaultTracking: Record<string, TrackingData> = {
  "DO2026-001": {
    nomorDO: "DO2026-001",
    nim: "042345678",
    nama: "Agus Pranoto",
    status: "Selesai",
    ekspedisi: "JNE Express",
    tanggalKirim: "2026-05-13",
    paket: "PAKET-UT-002",
    total: 140000,
    perjalanan: [
      { waktu: "2026-05-13 09:00:00", keterangan: "Penerimaan di Loket: TANGERANG SELATAN" },
      { waktu: "2026-05-14 20:00:00", keterangan: "Selesai Antar. Penerima: Agus Pranoto" }
    ]
  },
  "DO2026-002": {
    nomorDO: "DO2026-002",
    nim: "041234567",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE Regular",
    tanggalKirim: "2026-05-14",
    paket: "PAKET-UT-001",
    total: 120000,
    perjalanan: [
      { waktu: "2026-05-14 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
      { waktu: "2026-05-14 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
      { waktu: "2026-05-15 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
    ]
  },
  "DO2026-003": {
    nomorDO: "DO2026-003",
    nim: "043321987",
    nama: "Budi Santoso",
    status: "Transit",
    ekspedisi: "JNE Regular",
    tanggalKirim: "2026-05-15",
    paket: "PKT-01",
    total: 250000,
    perjalanan: [
      { waktu: "2026-05-15 11:00:00", keterangan: "Paket dipisahkan di Sortation Center Jakarta" }
    ]
  },
  "DO2026-004": {
    nomorDO: "DO2026-004",
    nim: "043456789",
    nama: "Siti Marlina",
    status: "Proses Packing",
    ekspedisi: "JNE Regular",
    tanggalKirim: "2026-05-14",
    paket: "PKT-03",
    total: 280000,
    perjalanan: [
      { waktu: "2026-05-14 08:30:00", keterangan: "DO Berhasil Dibuat. Menunggu penjemputan kurir." }
    ]
  },
  "DO2026-005": {
    nomorDO: "DO2026-005",
    nim: "044567890",
    nama: "Doni Setiawan",
    status: "Menunggu Penjemputan",
    ekspedisi: "JNE Express",
    tanggalKirim: "2026-05-14",
    paket: "PAKET-UT-001",
    total: 120000,
    perjalanan: [
      { waktu: "2026-05-14 09:15:00", keterangan: "Permintaan Penjemputan diajukan ke JNE." }
    ]
  }
};

const getInitialTracking = (): Record<string, TrackingData> => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('sitta_tracking');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, TrackingData>;
        
        // Normalize keys and values from localStorage
        const normalizedParsed: Record<string, TrackingData> = {};
        let changed = false;

        Object.entries(parsed).forEach(([key, val]) => {
          let normalizedKey = key;
          const match = key.match(/^DO(\d{4})-(\d+)$/);
          if (match) {
            const [_, year, seq] = match;
            if (seq.length !== 3) {
              normalizedKey = `DO${year}-${String(parseInt(seq, 10)).padStart(3, '0')}`;
              changed = true;
            }
          }

          const existingVal = normalizedParsed[normalizedKey];
          const newVal = {
            ...val,
            nomorDO: normalizedKey
          };

          if (existingVal) {
            const perjalananMap = new Map<string, any>();
            [...(existingVal.perjalanan || []), ...(newVal.perjalanan || [])].forEach(p => {
              perjalananMap.set(p.waktu + p.keterangan, p);
            });
            normalizedParsed[normalizedKey] = {
              ...existingVal,
              ...newVal,
              perjalanan: Array.from(perjalananMap.values())
            };
          } else {
            normalizedParsed[normalizedKey] = newVal;
          }
        });

        // Initialize merged object starting with defaultTracking
        const finalMerged: Record<string, TrackingData> = {};
        
        // Add defaults first
        Object.entries(defaultTracking).forEach(([key, val]) => {
          finalMerged[key] = { ...val };
        });

        // Add / merge the localStorage ones
        Object.entries(normalizedParsed).forEach(([key, val]) => {
          if (finalMerged[key]) {
            const existingVal = finalMerged[key];
            const perjalananMap = new Map<string, any>();
            [...(existingVal.perjalanan || []), ...(val.perjalanan || [])].forEach(p => {
              perjalananMap.set(p.waktu + p.keterangan, p);
            });
            finalMerged[key] = {
              ...existingVal,
              ...val,
              perjalanan: Array.from(perjalananMap.values())
            };
          } else {
            finalMerged[key] = val;
          }
        });

        // Always save clean structure back or if format underwent updates
        if (changed || Object.keys(parsed).length !== Object.keys(finalMerged).length) {
          localStorage.setItem('sitta_tracking', JSON.stringify(finalMerged));
        }

        return finalMerged;
      } catch (e) {
        return defaultTracking;
      }
    }
  }
  return defaultTracking;
};

export const dataTracking: Record<string, TrackingData> = getInitialTracking();
export const tracking = Object.entries(dataTracking).map(([key, value]) => ({ [key]: value }));

const defaultRiwayatTransaksi: TransactionHistory[] = [
  {
    id: "TRX-2025-001",
    tanggal: "2025-08-26 09:15",
    item: "Pengantar Ilmu Komunikasi (SKOM4101)",
    jenis: "Keluar",
    jumlah: 50,
    petugas: "Siti Marlina",
    keterangan: "Pengiriman ke UPBJJ Jakarta",
    paket: "0JKT01",
    catatanHTML: "<em>Prioritas Utama</em>"
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
    paket: "0MLG01",
    catatanHTML: "<strong>Urgent</strong>"
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
  },
  // Previous/Old uniquely defined ones
  {
    id: "TRX-2025-001-OLD",
    tanggal: "2025-08-26 09:15",
    item: "Pengantar Manajemen (EKMA4116)",
    jenis: "Keluar",
    jumlah: 50,
    petugas: "Siti Marlina",
    keterangan: "Pengiriman ke UPBJJ Jakarta",
    paket: "PAKET-UT-001",
    catatanHTML: "<em>Prioritas Utama (Kemarin)</em>"
  },
  {
    id: "TRX-2025-002-OLD",
    tanggal: "2025-08-25 14:30",
    item: "Pengantar Akuntansi (EKMA4115)",
    jenis: "Keluar",
    jumlah: 120,
    petugas: "Doni Setiawan",
    keterangan: "Pengiriman Masif Semester 2025.1 (Kemarin)",
    paket: "PAKET-UT-001"
  },
  {
    id: "TRX-2025-003-OLD",
    tanggal: "2025-08-24 11:00",
    item: "Biologi Umum (BIOL4201)",
    jenis: "Masuk",
    jumlah: 500,
    petugas: "Admin Pusat",
    keterangan: "Penerimaan dari Percetakan (Kemarin)",
    paket: "PAKET-UT-002"
  }
];

const getInitialRiwayat = (): TransactionHistory[] => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('sitta_riwayat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TransactionHistory[];
        const merged = [...parsed];
        defaultRiwayatTransaksi.forEach(def => {
          if (!merged.some(m => m.id === def.id)) {
            merged.push(def);
          }
        });
        return merged;
      } catch (e) {
        return defaultRiwayatTransaksi;
      }
    }
  }
  return defaultRiwayatTransaksi;
};

export const dataRiwayatTransaksi: TransactionHistory[] = getInitialRiwayat();
