import logo from "../../../public/logo.svg";
export default function HomeFooter() {
    return (
        <footer className="w-full text-green-800 py-2 border-t border-green-800/20">
            <div className="container mx-auto text-center">
                <img
                    src={logo}
                    alt="Natural Feeder PH"
                    loading="eager"
                    className="h-auto w-12 mx-auto mb-2"
                />
                <p className="text-sm">&copy; {new Date().getFullYear()} Natural Feeder PH. All rights reserved.</p>
            </div>
        </footer>
    );
}