import Calculator from "@/components/Country/TaxCalculator";
import Content from "@/components/Country/Content";
export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-12 py-4">
      <Content />
      <Calculator />
    </div>
  );
}
