import { 
    IconHomeFilled, 
    IconArchiveFilled,
    IconClipboardListFilled   
} from '@tabler/icons-react'
import { NavLink } from 'react-router-dom';

export default function Nav() {
    const navLink = [       
        {name: 'Home', to: '/', icon: <IconHomeFilled size={24} />},
        {name: 'Order Now', to: '/order-now', icon: <IconArchiveFilled size={24} />},
        {name: 'Order History', to: '/order-history', icon: <IconClipboardListFilled size={24} />},
    ]

    return (
        <nav className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 flex-row items-center justify-between rounded-full border-b border-white/20 bg-white/40 shadow-lg backdrop-blur-sm" data-aos='fade-up'>
            {navLink.map((link, index) => (
                <NavLink
                    key={index}
                    to={link.to}
                    className={({ isActive }) => 
                        `flex flex-row items-center justify-center gap-1 p-5 rounded-full transition-all duration-300 flex-1 ${
                            isActive ? 'bg-green-800 text-white flex-6' : 'text-green-800 hover:bg-green-800/20'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {link.icon}
                            <span 
                                className={`text-xs font-semibold overflow-x-hidden ${
                                    isActive ? 'block' : 'hidden'
                                }`}
                            >
                                {link.name}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}