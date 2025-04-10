import React from "react";

interface MenuItemProps {
    item: { label: string; icon: React.ReactNode; };
    onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onClick }) => {
    return (
        <button
            className={`list-group-item list-group-item-action d-flex align-items-center`}
            onClick={onClick}
        >
            <span className="me-3 fs-4">{item.icon}</span>
            {item.label}
        </button>
    );
};

export default MenuItem;
