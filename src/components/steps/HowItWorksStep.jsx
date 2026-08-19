import Status from "../status/Status";

export default function HowItWorksStep({ step, icon, title, description, index }) {
  // Check if the step is Even (0, 2, 4) or Odd (1, 3)
  // Even steps go on the Left on large screens. Odd steps go on the Right.
  const isEven = index % 2 === 0;

  return (
    <div 
      className={`relative flex flex-col lg:flex-row items-center w-full my-8 ${
        isEven ? 'lg:justify-start' : 'lg:justify-end'
      }`}
    >
      {/* TIMELINE DOT (The Icon sitting on the line) */}
      <div className="absolute left-0 lg:left-1/2 w-10 h-10 -translate-x-1/2 flex items-center justify-center bg-green-800 text-white rounded-full border-4 border-white shadow-md z-10">
        {icon}
      </div>

      {/* STEP CONTENT CARD */}
      <div 
        className={`w-full pl-14 lg:pl-0 lg:w-[calc(50%-3rem)] flex flex-col ${
          isEven ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'
        }`}
      >
        <div className="flex flex-col gap-2 p-6 w-full bg-white/60 backdrop-blur-sm border border-green-800/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          
          {/* Status Badge inside the card */}
          <div className={`flex ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
             <Status description={step} color="green" />
          </div>
          
          <h3 className="text-xl font-bold text-green-900 mt-2">{title}</h3>
          
          <p className="text-gray-600 text-sm leading-relaxed">
             {description}
          </p>
          
        </div>
      </div>
    </div>
  );
}