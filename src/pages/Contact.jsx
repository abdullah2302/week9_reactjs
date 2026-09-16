import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setSent(true);
        setName("");
        setEmail("");
        setMessage("");
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-16">
            <h1 className="mb-10 text-2xl font-semibold text-slate-900 dark:text-white">
                Contact Us
            </h1>

            <div className="grid gap-14 md:grid-cols-2">
                <div>
                    <p className="mb-8 leading-relaxed text-slate-500 dark:text-slate-400">
                        Have a question or just want to say hi? Drop by our
                        store or reach out using the details below.
                    </p>

                    <ul className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex items-start gap-3">
                            <FontAwesomeIcon
                                icon={faLocationDot}
                                className="mt-0.5 text-slate-400"
                            />
                            <span>
                                123 Market Street, Gulberg III,
                                <br />
                                Lahore, Punjab, Pakistan
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FontAwesomeIcon
                                icon={faPhone}
                                className="text-slate-400"
                            />
                            <span>+92 300 1234567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="text-slate-400"
                            />
                            <span>support@shoply.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <FontAwesomeIcon
                                icon={faClock}
                                className="mt-0.5 text-slate-400"
                            />
                            <span>
                                Mon – Sat: 10:00 AM – 9:00 PM
                                <br />
                                Sunday: Closed
                            </span>
                        </li>
                    </ul>

                    <div className="mt-8 overflow-hidden rounded-lg">
                        <iframe
                            title="Store location"
                            className="h-48 w-full"
                            style={{ border: 0 }}
                            loading="lazy"
                            src="https://www.google.com/maps?q=Gulberg%20III%2C%20Lahore%2C%20Pakistan&output=embed"
                        ></iframe>
                    </div>
                </div>

                <div>
                    {sent && (
                        <p className="mb-4 text-sm text-slate-900 dark:text-white">
                            Thanks! Your message has been sent (demo only).
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="border-b border-slate-200 bg-transparent py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:text-white "
                        />
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border-b border-slate-200 bg-transparent py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:text-white"
                        />
                        <textarea
                            placeholder="Your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={4}
                            className="resize-none border-b border-slate-200 bg-transparent py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:text-white"
                        />
                        <button
                            type="submit"
                            className="mt-2 rounded-full bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Contact;