import Image from 'next/image';

export default function IllustrationSection({ title, description, imageSrc, alt }) {
  return (
    <div
      className="hidden md:flex flex-col justify-center items-center relative w-1/2 min-h-screen"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dy8fe8tbe/image/upload/v1745079384/background_kajdxm.png?q_auto,f_webp')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    >
      <div className="text-center px-8 z-10">
        <h1 className="text-xl font-bold text-[#333333] mb-4">
          {title} <span className="text-[#6387CE]">Scheduro</span> It!
        </h1>
        <p className="text-[#333333] text-base mb-6">{description}</p>
        <Image src={imageSrc} alt={alt} width={500} height={500} className="object-contain" loading="lazy" />
      </div>
    </div>
  );
}
