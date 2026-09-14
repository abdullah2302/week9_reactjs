function EmptyState({ children }) {
    return (
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
            {children}
        </div>
    );
}

export default EmptyState;