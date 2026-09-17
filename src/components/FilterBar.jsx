import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';

function FilterBar({
    categories,
    categoryFilter,
    onCategoryChange,
    searchTerm,
    onSearchChange,
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
            <div className="flex items-center gap-3">
                <FontAwesomeIcon
                    icon={faFilter}
                    className="text-slate-500 text-sm"
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 dark:bg-slate-500 dark:border-none dark:text-white dar"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative sm:w-56">
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:"
                />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full border-b border-slate-200 bg-transparent py-1.5 pl-5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700"
                />
            </div>
        </div>
    );
}

export default FilterBar;