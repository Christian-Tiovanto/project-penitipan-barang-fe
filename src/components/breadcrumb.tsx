import React from "react";

interface BreadcrumbProps {
    title: string;
    items: string[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, items }) => {
    return (
        <div>
            <h2 className="fw-bold mb-0">{title}</h2> {/* Heading utama */}
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <span className="mx-2 text-muted">
                        <i className="fas fa-chevron-right"></i>
                    </span>
                    <span className="text-muted">{item}</span>
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumb;

