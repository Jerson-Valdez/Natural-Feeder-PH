import logo from '../../../public/logo.svg'

export default function Header() {
    return(
        <header className="fixed top-4 left-1/2 z-50 px-4 flex h-12 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 flex-row items-center justify-between rounded-full border-b border-white/20 bg-white/40 shadow-lg backdrop-blur-sm" data-aos='fade-down'>
            <div className="flex flex-row items-center gap-2">
                <img src={logo} alt="Natural Feeder PH" loading="eager" className="h-auto w-12" />
                <h1 className="text-lg font-black text-green-800">
                Natural Feeder <span className="text-amber-900">PH</span>
                </h1>
            </div>
        </header>
    )
}