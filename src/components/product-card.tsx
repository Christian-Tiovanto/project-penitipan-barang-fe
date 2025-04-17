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
    <div className="flex items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white">
      {/* Left: Product Info */}
      <div className="flex-1">
        <h6 className="text-base font-bold text-black">{name}</h6>
        <h6 className="text-sm text-black mt-1">
          Rp {price.toLocaleString("id-ID")}
        </h6>
      </div>

      {/* Middle: Quantity Control */}
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          onClick={decrement}
          className="btn btn-light p-0 rounded-circle btn-sm d-flex align-items-center justify-content-center shadow-md hover:bg-green-600 hover:scale-105 active:scale-95 transition-all border-2 border-black "
          style={{ width: "30px", height: "30px" }}
        >
          <FaMinus color="black" size={18} />
        </button>
        <input
          type="text"
          value={qty}
          onChange={handleInputChange}
          className="w-10 h-10 text-center border border-gray-300 rounded-lg bg-white text-gray-800 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all"
          style={{ width: "100px" }}
        />
        <button
          type="button"
          onClick={increment}
          className="btn btn-light p-0 rounded-circle btn-sm d-flex align-items-center justify-content-center shadow-md hover:bg-green-600 hover:scale-105 active:scale-95 transition-all border-2 border-black "
          style={{ width: "30px", height: "30px" }}
        >
          <FaPlus color="black" size={18} />
        </button>
      </div>
    </div>
  );
}
