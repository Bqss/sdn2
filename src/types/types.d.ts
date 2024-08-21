interface Slideshow {
  id: string;
  judul: string;
  deskripsi: string;
  gambar: string;
  order: number;
  is_active: string;
}


interface Ekstrakurikuler {
  id: string;
  thumbnail: string;
  nama: string;
  deskripsi: string;
}

interface ArsipFile {
  id: string;
  file: any;
  nama: string;
  tag: string;
}