import { HiOutlineHome } from "react-icons/hi2";
import { GiNotebook } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { PiNetwork } from "react-icons/pi";
import { LuNewspaper } from "react-icons/lu";
import { BiSlideshow } from "react-icons/bi";
import { FaPeopleLine } from "react-icons/fa6";
import { TfiMedall } from "react-icons/tfi";
import { GrAnnounce } from "react-icons/gr";
import { VscFileSubmodule } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { LuMessageSquare } from "react-icons/lu";
import { GiBookshelf } from "react-icons/gi";

export const menus = [
  {
    name: 'Dashboard',
    type: 'menu',
    icon: HiOutlineHome,
    url: "/admin/dashboard"
  },
  {
    name: 'Profil Sekolah',
    type: 'menu',
    icon: GiNotebook,
    url: "/admin/profil-sekolah"
  },
  {
    name: 'Data Pokok',
    type: 'group',
    url: null,
    children : [
      {
        name: 'Data Murid',
        type: 'menu',
        url: '/admin/data-murid',
        icon: PiStudent
      },
      {
        name: 'Data Guru dan Karyawan',
        type: 'menu',
        url: '/admin/data-guru-dan-karyawan',
        icon: PiNetwork
      }
    ]
  },
  {
    name: 'CMS',
    type: 'group',
    url: null,
    children : [
      {
        name: 'Slideshow',
        type: 'menu',
        url: '/admin/slideshow',
        icon: BiSlideshow
      },
      {
        name: 'Berita',
        type: 'menu',
        url: '/admin/berita',
        icon: LuNewspaper
      },
      {
        name: 'Galeri',
        type: 'menu',
        url: '/admin/galeri',
        icon: GiNotebook
      },
      {
        name: 'Ekstrakurikuler',
        type: 'menu',
        url: '/admin/ekstrakurikuler',
        icon: FaPeopleLine
      },
      {
        name: 'Prestasi',
        type: 'menu',
        url : '/admin/prestasi',
        icon: TfiMedall
      },
      {
        name: 'Pengumuman',
        url: '/admin/pengumuman',
        type: 'menu',
        icon: GrAnnounce
      },
      {
        name: 'Arsip File',
        url: '/admin/arsip-file',
        type: 'menu',
        icon: VscFileSubmodule
      },

    ]
  },
  {
    name: 'Lainnya',
    type: 'group',
    url: null,
    children: [
      {
        name: 'Aduan Masyarakat',
        type: 'menu',
        url: '/admin/aduan-masyarakat',
        icon: LuMessageSquare
      },
      {
        name: "PPDB",
        type: 'menu',
        url: '/admin/ppdb',
        icon: GiBookshelf
      },
      {
        name: 'Pengaturan',
        type: 'menu',
        url: '/admin/pengaturan',
        icon: IoSettingsOutline
      },
      
    ] 
  }
];