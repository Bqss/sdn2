import { HiOutlineHome } from "react-icons/hi2";
import { GiNotebook } from "react-icons/gi";
import { PiNetwork } from "react-icons/pi";
import { LuNewspaper } from "react-icons/lu";
import { BiSlideshow } from "react-icons/bi";
import { FaPeopleLine } from "react-icons/fa6";
import { TfiMedall } from "react-icons/tfi";
import { VscFileSubmodule } from "react-icons/vsc";
import { url } from "inspector";

export const menus = [
  {
    name: "Dashboard",
    type: "menu",
    icon: HiOutlineHome,
    url: "/admin/dashboard",
  },
  {
    name: "Profil Sekolah",
    type: "menu",
    icon: GiNotebook,
    url: "/admin/profil-sekolah",
  },
  {
    name: "Data Pokok",
    type: "group",
    url: null,
    children: [
      {
        name: "Data Guru dan Karyawan",
        type: "menu",
        url: "/admin/data-guru-dan-karyawan",
        icon: PiNetwork,
      },
    ],
  },
  {
    name: "CMS",
    type: "group",
    url: null,
    children: [
      {
        name: "Slideshow",
        type: "menu",
        url: "/admin/slideshow",
        icon: BiSlideshow,
      },
      {
        name: "Berita",
        type: "menu",
        url: "/admin/berita",
        icon: LuNewspaper,
      },
      {
        name: "Galeri",
        type: "menu",
        url: "/admin/galeri",
        icon: GiNotebook,
      },
      {
        name: "Ekstrakurikuler",
        type: "menu",
        url: "/admin/ekstrakurikuler",
        icon: FaPeopleLine,
      },
      {
        name: "Prestasi",
        type: "menu",
        url: "/admin/prestasi",
        icon: TfiMedall,
      },
      {
        name: "Arsip File",
        url: "/admin/arsip-file",
        type: "menu",
        icon: VscFileSubmodule,
      },
    ],
  },
];

export const landingmenus = [
  {
    name: "Beranda",
    url: "/",
  },
  {
    name: "Tentang",
    url: "/about",
  },
  {
    name: "Visi Misi",
    url: "/visi-misi",
  },
  {
    name: "Berita",
    url: "/berita"
  },
  {
    name: "Prestasi",
    url: "/prestasi"
  },
  {
    name: "Gallery",
    url: "/gallery"
  },
  {
    name: "Arsip File",
    url: "/arsip-file"
  }
];
