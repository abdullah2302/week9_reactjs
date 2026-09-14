import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

function NotFound() {
    return (
        <EmptyState>
            <p className="mb-6 text-slate-500">Page not found.</p>
            <FontAwesomeIcon
                icon={faCircleExclamation}
                className="mb-4 text-3xl text-red-400"
            />
            <Link
                to="/"
                className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
                Go Home
            </Link>
        </EmptyState>
    );
}

export default NotFound;
