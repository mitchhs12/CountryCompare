import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-1/3 w-full">
      <Image
        src={"/public/next.svg"}
        alt="Hero Background"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="absolute z-0"
      />
      <div className="relative z-10 flex flex-col justify-center items-center h-full w-full bg-black bg-opacity-50">
        <h1 className="text-4xl text-white font-bold">Welcome to my website</h1>
        <p className="text-xl text-white mt-4">Here you can do stuff!</p>
      </div>
    </div>
  );
}
