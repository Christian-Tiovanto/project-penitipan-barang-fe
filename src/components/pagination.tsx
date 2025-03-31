export default function PagePaginationComponent({
  selectedPageSize,
  setSelectedPageSize,
}: {
  selectedPageSize: string;
  setSelectedPageSize: (data: string) => void;
}) {
  return (
    <div className="pagination-component mt-3 d-flex align-items-center justify-content-end flex-wrap-reverse gap-2 align-self-end">
      <div className="btn-group select-page-size me-3 text-center d-flex justify-content-center align-items-center">
        Rows Per Page :
        <button
          className="btn btn-secondary btn-sm dropdown-toggle bg-transparent text-black border-top-0 border-end-0 border-start-0 border-gray rounded-0 ms-3"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedPageSize}
        </button>
        <ul className="dropdown-menu">
          {["10", "50", "100", "All"].map((data, index) => (
            <li
              className="pagination-dropdown-item"
              key={index}
              onClick={() => setSelectedPageSize(data)}
            >
              {data}
            </li>
          ))}
        </ul>
      </div>
      <nav aria-label="Page navigation">
        <ul className="pagination m-0 primary-text">
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true" className="secondary-text">
                &laquo;
              </span>
            </a>
          </li>
          <li className="page-item">
            <a className="page-link  secondary-text" href="#">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link secondary-text" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link secondary-text" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Next">
              <span aria-hidden="true" className="secondary-text">
                &raquo;
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
