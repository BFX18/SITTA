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
}

export interface TrackingData {
  nomorDO: string;
  nama: string;
  status: string;
  ekspedisi: string;
  tanggalKirim: string;
  paket: string;
  total: string;
  perjalanan: Perjalanan[];
}
