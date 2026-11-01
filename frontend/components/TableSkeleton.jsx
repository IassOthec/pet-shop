const TableSkeleton = ({ rows = 4 }) => (
  <div className="table-skeleton" role="status" aria-label="Carregando pets">
    <span className="sr-only">Carregando pets...</span>

    {Array.from({ length: rows }).map((_, index) => (
      <div className="table-skeleton__row" key={index} aria-hidden="true">
        <div className="table-skeleton__identity">
          <span className="skeleton skeleton--avatar" />
          <span className="table-skeleton__lines">
            <span className="skeleton skeleton--line skeleton--line-lg" />
            <span className="skeleton skeleton--line skeleton--line-sm" />
          </span>
        </div>
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line skeleton--line-sm" />
        <span className="skeleton skeleton--line skeleton--line-sm" />
      </div>
    ))}
  </div>
);

export default TableSkeleton;
