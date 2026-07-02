const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const goToPreviousPage = () => {
    onPageChange(Math.max(currentPage - 1, 1))
  }

  const goToNextPage = () => {
    onPageChange(Math.min(currentPage + 1, totalPages))
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-sm">
      <span className="text-gray-600">
        Paginacao: pagina {currentPage} de {totalPages}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1

          return (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded-lg transition ${page === currentPage
                ? 'bg-cyan-700 text-white border-cyan-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {page}
            </button>
          )
        })}

        <button
          type="button"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proxima
        </button>
      </div>
    </div>
  )
}

export default PaginationControls
