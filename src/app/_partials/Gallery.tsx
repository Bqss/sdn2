"use client"
import React, { useMemo } from 'react'

import GalleryCard from './GalleryCard'
import Masonry from 'react-responsive-masonry'
import { useMediaQuery } from 'usehooks-ts'

const Gallery = ({ items }: { items: any }) => {
  const galleries = useMemo(() => {
    if (!items) return [];
    return JSON.parse(items);
  }, [items]);

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 992px)"
  );

  const columnCount = useMemo(() => {
    if (isSmallDevice) return 1;
    if (isMediumDevice) return 2;
    return 3;
  }, [isSmallDevice, isMediumDevice]);

  const gutter = useMemo(() => {
    if (isSmallDevice) return 10;
    if (isMediumDevice) return 20;
    return 30;
  }, [isSmallDevice, isMediumDevice]);


  return (
    <div className="mt-12">
      {galleries.length > 0 ? (

        <Masonry columnsCount={columnCount} gutter='10px' className="w-full">
          {galleries.map((gallery: any, index: any) => (
            <GalleryCard key={index} data={gallery} delay={index * 0.1} />
          ))}
        </Masonry>
      ) : (
        <div className="py-12 w-full border border-white rounded-lg mt-12">
          <div className="text-center">belum ada gallery yang ditambahkan</div>
        </div>
      )}
    </div>


  )
}

export default Gallery