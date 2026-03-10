import React from 'react';
import { TitleH1 } from '../Titles/Titles';
import { StaticImageData } from 'next/image';
import Image from 'next/image';

interface EmptyContentInterface {
  title: string;
  description?: string;
  image?: StaticImageData;
  alt?: string;
}

export default function EmptyContent({
  title,
  description,
  image,
  alt,
}: EmptyContentInterface) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center gap-3">
        <TitleH1 className="mb-0">{title}</TitleH1>
        <p className="text-xs text-text-secondary sm:text-base">
          {description}
        </p>
        <Image src={image || ''} alt={alt || ''} width={200} />
      </div>
    </div>
  );
}
