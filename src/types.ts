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
