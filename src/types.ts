export interface User {
  id: number;
  nama: string;
  email: string;
  password: string;
  role: string;
  lokasi: string;
}

export interface BahanAjar {
  kodeLokasi: string;
  kodeBarang: string;
  namaBarang: string;
  jenisBarang: string;
  edisi: string;
  stok: number;
  cover: string;
  kategori: string;
  upbjj: string;
  safety: number;
  harga: number;
  catatanHTML: string;
}

export interface UPBJJData {
  kode: string;
  nama: string;
  expeditions: string[];
}

export interface PaketBahanAjar {
  kode: string;
  nama: string;
  items: { kode: string; nama: string }[];
  harga: number;
}

export interface Perjalanan {
  waktu: string;
  keterangan: string;
}

export interface TransactionHistory {
  id: string;
  tanggal: string;
  item: string;
  jenis: 'Masuk' | 'Keluar';
  jumlah: number;
  petugas: string;
  keterangan: string;
  paket: string;
  catatanHTML?: string;
}

export interface TrackingData {
  nomorDO: string;
  nim: string;
  nama: string;
  status: string;
  ekspedisi: string;
  tanggalKirim: string;
  paket: string;
  total: number;
  perjalanan: Perjalanan[];
}
