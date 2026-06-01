export default function Footer() {
    return (
        <footer className="h-14 border-t border-surface-border bg-surface flex items-center justify-center text-[11px] text-ink-faint flex-shrink-0">
            &copy; {new Date().getFullYear()} FEMA - Finance Exception Management Agent. All rights reserved.
        </footer>
    )
}
