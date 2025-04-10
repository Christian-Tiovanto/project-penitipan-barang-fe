import { FaMinus, FaPlus } from "react-icons/fa6";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  qty: number;
  onQtyChange: (qty: number) => void;
}

export default function ProductCard({
  name,
  price,
  qty,
  onQtyChange,
}: ProductCardProps) {
  const increment = () => onQtyChange(qty + 1);
  const decrement = () => onQtyChange(qty > 0 ? qty - 1 : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      onQtyChange(Number(val));
    }
  };

  return (
    <div className="flex flex-col border-b border-gray-300 py-0">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex-1">
          <h6 className="text-base font-bold text-black">{name}</h6>
          <h6 className="text-sm text-black mt-1">
            Rp {price.toLocaleString("id-ID")}
          </h6>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decrement}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
          >
            <FaMinus color="black" size={18} />
          </button>

          <input
            type="text"
            value={qty}
            onChange={handleInputChange}
            className="w-10 h-10 text-center border border-gray-300 rounded-lg bg-white text-gray-800 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all"
            style={{ width: "100px", marginLeft: "5px", marginRight: "5px" }}
          />

          <button
            type="button"
            onClick={increment}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 hover:scale-105 active:scale-95 transition-all"
          >
            <FaPlus color="black" size={18} />
          </button>
          <hr className="mt-3" />
        </div>
      </div>
    </div>
  );
}
