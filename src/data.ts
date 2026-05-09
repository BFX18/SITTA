import { BahanAjar, TrackingData, User, TransactionHistory } from './types';
import { COVERS } from './assets';

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
    password: "admin123",
    role: "Administrator",
    lokasi: "Pusat"
  }
];

export const dataBahanAjar: BahanAjar[] = [
  {
    kodeLokasi: "0TMP01",
    kodeBarang: "SKOM4101",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 548,
    cover: COVERS.PENGANTAR_KOMUNIKASI
  },
  {
    kodeLokasi: "0JKT01",
    kodeBarang: "EKMA4213",
    namaBarang: "Manajemen Keuangan",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 392,
    cover: COVERS.MANAJEMEN_KEUANGAN
  },
  {
    kodeLokasi: "0SBY02",
    kodeBarang: "ADPU4334",
    namaBarang: "Kepemimpinan",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 278,
    cover: COVERS.KEPEMIMPINAN
  },
  {
    kodeLokasi: "0MLG01",
    kodeBarang: "BIOL4223",
    namaBarang: "Mikrobiologi",
    jenisBarang: "BMP",
    edisi: "3",
    stok: 165,
    cover: COVERS.MIKROBIOLOGI
  },
  {
    kodeLokasi: "0UPBJJBDG",
    kodeBarang: "PAUD4306",
    namaBarang: "Perkembangan Anak Usia Dini",
    jenisBarang: "BMP",
    edisi: "2",
    stok: 204,
    cover: COVERS.PERKEMBANGAN_ANAK
  }
];

export const dataTracking: Record<string, TrackingData> = {
  "2023001234": {
    nomorDO: "2023001234",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-25",
    paket: "0JKT01",
    total: "Rp 180.000",
    perjalanan:[
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      },      
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Diteruskan ke Kantor Jakarta Selatan"
      },
    ]
  },
  "2023005678": {
    nomorDO: "2023005678",
    nama: "Agus Pranoto",
    status: "Dikirim",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-25",
    paket: "0UPBJJBDG",
    total: "Rp 220.000",
    perjalanan:[
      {
        waktu: "2025-08-25 10:12:20",
        keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka"
      },
      {
        waktu: "2025-08-25 14:07:56",
        keterangan: "Tiba di Hub: TANGERANG SELATAN"
      },      
      {
        waktu: "2025-08-25 16:30:10",
        keterangan: "Diteruskan ke Kantor Kota Bandung"
      },
      {
        waktu: "2025-08-26 12:15:33",
        keterangan: "Tiba di Hub: Kota BANDUNG"
      },
      {
        waktu: "2025-08-26 15:06:12",
        keterangan: "Proses antar ke Cimahi"
      },
      {
        waktu: "2025-08-26 20:00:00",
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
