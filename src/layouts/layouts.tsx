import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { logout } from "../features/auth/services/auth.service";

export default function MainLayout() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
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
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (toggleButton) {
        toggleButton.removeEventListener("click", handleToggle);
      }
    };
  }, []);

  return (
    <>
      <div id="wrapper" ref={wrapperRef}>
        <div className="primary-bg" id="sidebar-wrapper" ref={sidebarRef}>
          <div className="list-group list-group-flush my-3">
            {/* <a
              href="#"
              className="list-group-item list-group-item-action bg-transparent primary-text active"
            >
              <i className="fas fa-tachometer-alt me-2"></i>Dashboard
            </a> */}
            <a
              href="/master"
              className="list-group-item list-group-item-action bg-transparent primary-text fw-bold"
            >
              <i className="fas fa-project-diagram me-2"></i>Master
            </a>
            <a
              href="/transaction"
              className="list-group-item list-group-item-action bg-transparent primary-text fw-bold"
            >
              <i className="fas fa-warehouse me-2"></i>Transaction
            </a>
            <a
              href="/report"
              className="list-group-item list-group-item-action bg-transparent primary-text fw-bold"
            >
              <i className="fas fa-paperclip me-2"></i>Reports
            </a>
            <button
              onClick={logout}
              className="list-group-item list-group-item-action bg-transparent text-danger fw-bold border-0 w-100 text-start"
            >
              <i className="fas fa-power-off me-2"></i>Logout
            </button>
          </div>
        </div>
        <nav className="navbar fixed-top shadow-sm navbar-light bg-white px-4 ">
          <div className="d-flex align-items-center">
            <i
              className="fas fa-align-left secondary-text fs-4 me-3"
              id="menu-toggle"
              ref={toggleButtonRef}
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
    </>
  );
}
