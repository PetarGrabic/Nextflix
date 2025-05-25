import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <AiOutlineLoading3Quarters className="animate-spin text-white text-3xl" />
    </div>
  );
}
