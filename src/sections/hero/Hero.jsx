import { Link } from 'react-router-dom'
import hero from '../../assets/landing page assets/hero.gif'
import Status from '../../components/status/Status'

export default function Hero() {
    return (
        <section className="w-full flex flex-col flex-col-reverse justify-center items-center gap-4 min-md:flex-row" data-aos='fade-right'>
            <div className="flex flex-col gap-2 justify-center items-center w-full min-sm:justify-start min-sm:items-start min-sm:w-1/2">
                <Status icon="truck" description="Pickup & delivery available" color="green"/>
                <h1 className="text-5xl font-black text-center text-green-800">Fresh Feeders,</h1>
                <h1 className="text-5xl font-black text-center text-amber-900">Straight to You</h1>
                <p className="text-base"><strong>Welcome to Natural Feeder PH.</strong> Order superworms from Paombong, Bulacan. — browse today's prices, add to your basket, and send your order directly on Messenger.</p>
                <div classname="flex flex-row gap-2">
                    <Link to="/order-now" className="bg-green-800 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-900 transition-all duration-300">
                        Order Now
                    </Link>
                    <Link to="/how-it-works" className="border-2 border-amber-900 bg-transparent text-amber-900 px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        How it works
                    </Link>
                </div>
            </div>
            <img src={hero} alt="Hero image" className='w-full min-md:w-1/2'/>
        </section>
    )
}