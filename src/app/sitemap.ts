import { Metadata, MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://sdnegeri2tamanharjo.web.id/",
      lastModified: "2024-08-28",
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: "https://www.sdnegeri2tamanharjo.web.id/about",
      lastModified: "2024-08-28",
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: "https://www.sdnegeri2tamanharjo.web.id/visi-misi",
      lastModified: "2024-08-28",
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: "https://www.sdnegeri2tamanharjo.web.id/berita",
      lastModified: "2024-08-28",
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: "https://www.sdnegeri2tamanharjo.web.id/prestasi",
      lastModified: "2024-08-28",
      changeFrequency: "always",
      priority: 0.5,
    },
    {
      url: "https://www.sdnegeri2tamanharjo.web.id/galeri",
      lastModified: "2024-08-28",
      changeFrequency: "always",
      priority: 0.5,
    }
  ];
}
