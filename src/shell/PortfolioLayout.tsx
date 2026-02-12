import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'

/**
 * PortfolioLayout
 * Ensures the AppShell remains persistent across different city hub routes.
 */
export function PortfolioLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const scrollPosRef = useRef<number>(0)

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            scrollPosRef.current = window.scrollY
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Restore scroll position on route change (Sync Navigation)
    useEffect(() => {
        // Small timeout to allow the new route content to render/resize
        const timer = setTimeout(() => {
            window.scrollTo({
                top: scrollPosRef.current,
                behavior: 'auto'
            })
        }, 10)
        return () => clearTimeout(timer)
    }, [location.pathname])

    const navigationItems = [
        {
            label: 'HCMC',
            href: '/hcmc',
            isActive: location.pathname === '/hcmc' || location.pathname.includes('hcmc-hub')
        },
        {
            label: 'Hanoi',
            href: '/hanoi',
            isActive: location.pathname === '/hanoi' || location.pathname.includes('hanoi-hub')
        },
        {
            label: 'Da Nang',
            href: '/danang',
            isActive: location.pathname === '/danang' || location.pathname.includes('danang-hub')
        },
    ]

    const user = {
        name: 'Demo User',
    }

    return (
        <AppShell
            navigationItems={navigationItems}
            user={user}
            onNavigate={(href) => navigate(href)}
            onHireMe={() => window.open('resume.html', '_blank', 'noopener,noreferrer')}
        >
            <div className="flex-1">
                <Outlet />
            </div>
        </AppShell>
    )
}
