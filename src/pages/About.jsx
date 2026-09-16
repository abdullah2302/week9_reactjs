function About() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
                About Shoply
            </h1>
            <p className="mb-4 leading-relaxed text-slate-500 dark:text-slate-400">
                Shoply is a demo e-commerce storefront built to showcase
                React fundamentals components, props, state, and routing.
            </p>
            <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                Every product, cart action, and page transition here is
                powered by client-side React state and React Router,
                without a backend.
            </p>
        </main>
    );
}

export default About;