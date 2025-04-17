import { FaMinus, FaPlus } from "react-icons/fa6";
import { ProductUnit } from "../features/trans-in/pages/create-trans-in";

interface ProductCardDropDownProps {
  id: number;
  name: string;
  price: number;
  qty: number;
  product_unit: ProductUnit[]; // Menambahkan properti untuk units
  onQtyChange: (qty: number) => void;
  onUnitChange: (productId: number, unitId: number) => void; // Fungsi untuk mengubah unit
}

export default function ProductCardDropDown({
  id,
  name,
  price,
  qty,
  product_unit,
  onQtyChange,
  onUnitChange,
}: ProductCardDropDownProps) {
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
      </div>

      {/* Right: Unit Dropdown */}
      <div className="w-48 ml-4">
        {/* <label className="block text-sm font-medium text-gray-700 mb-1 mr-1">
          Pilih Unit
        </label> */}
        <select
          className="w-full border border-gray-300 rounded-md px-2 py-1 mt-3"
          onChange={(e) => onUnitChange(id, parseInt(e.target.value))}
        >
          <option value="" disabled>
            -- Choose Unit --
          </option>
          {product_unit.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
