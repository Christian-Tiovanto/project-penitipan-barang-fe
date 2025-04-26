import { FaMinus, FaPlus } from "react-icons/fa6";
import { ProductUnit } from "../features/trans-in/pages/create-trans-in";
import RadioToggleUserRoles from "./radio-toogle-user-roles";

interface UserRolesCardProps {
  name: string;
  status: boolean;
  onStatusChange: (value: boolean) => void;
}

export default function UserRoleCard({
  name,
  status,
  onStatusChange,
}: UserRolesCardProps) {
  return (
    <div className="d-flex justify-content-between align-items-center p-2">
      <div className="d-flex align-items-center">
        <span className="fw-bold text-black">{name}</span>
      </div>
      <div className="d-flex align-items-center">
        <RadioToggleUserRoles
          name="status"
          isActive={status}
          onChange={onStatusChange}
          error={false}
        />
      </div>
    </div>
  );
}
