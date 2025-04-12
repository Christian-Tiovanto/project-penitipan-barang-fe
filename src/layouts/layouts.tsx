import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { logout } from "../features/auth/services/auth.service";
import { checkAuth } from "../utils/auth";

export default function MainLayout() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      navigate("/login");
    }

    const handleClickOutside = (event: MouseEvent) => {
      const isLargeScreen = window.matchMedia("(min-width: 992px)").matches;
      if (
        !isLargeScreen &&
        wrapperRef.current &&
        sidebarRef.current &&
        toggleButtonRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        wrapperRef.current.classList.remove("toggled");
      }
    };

    const handleToggle = () => {
      if (wrapperRef.current) {
        wrapperRef.current.classList.toggle("toggled");
      }
    };

    const toggleButton = toggleButtonRef.current;
    if (toggleButton) {
      toggleButton.addEventListener("click", handleToggle);
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (toggleButton) {
        toggleButton.removeEventListener("click", handleToggle);
      }
    };
  }, [navigate, location.pathname]);

  const menuItems = [
    { path: "/master", label: "Master", icon: "fa-project-diagram" },
    { path: "/transaction", label: "Transaction", icon: "fa-warehouse" },
    { path: "/report", label: "Reports", icon: "fa-paperclip" },
    {
      path: "/cashflow",
      label: "Cashflow",
      icon: "fa-money-bill",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div id="wrapper" ref={wrapperRef}>
      <div className="primary-bg" id="sidebar-wrapper" ref={sidebarRef}>
        <div className="list-group list-group-flush my-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`list-group-item list-group-item-action bg-transparent primary-text`}
            >
              <i className={`fas ${item.icon} me-2`}></i>
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="list-group-item list-group-item-action bg-transparent text-danger fw-bold border-0 w-100 text-start"
          >
            <i className="fas fa-power-off me-2"></i>Logout
          </button>
        </div>
      </div>

      <nav className="navbar fixed-top shadow-sm navbar-light bg-white px-4">
        <div className="d-flex align-items-center">
          <i
            className="fas fa-align-left secondary-text fs-4 me-3"
            id="menu-toggle"
            ref={toggleButtonRef}
            role="button"
          ></i>
        </div>
      </nav>

      <main id="page-content-wrapper" className="py-3">
        <div className="container-again px-4 py-3 w-100">
          <div id="page-container" className="bg-white px-4 py-4">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
