import {
  IconLeaf ,
  IconBrandMessenger,
  IconClockCheck ,
  IconArchiveFilled
} from "@tabler/icons-react";
import HowItWorksStep from "../../components/steps/HowItWorksStep";
import PrimaryButtonLink from "../../components/buttons/PrimaryButtonLink";

export default function WhyOrderFromUs() {
    const steps = [
        {
            icon: <IconLeaf size={24} className="text-green-800" />,
            title: "Farm-Fresh & Nutritious",
            description: "Our Dubia roaches and superworms are raised in clean conditions and harvested fresh — better nutrition for your reptiles and pets."
        },
        {
            icon: <IconBrandMessenger size={24} className="text-green-800" />,
            title: "Order Through Messenger",
            description: "Your order details are auto-filled into a Messenger deep link. We get a clean, complete receipt the moment you send it."
        },
        {
            icon: <IconClockCheck size={24} className="text-green-800" />,
            title: "No More Waiting for Replies",
            description: "Prices and stock are visible upfront. Build your order and send it instantly — no waiting on a DM reply just to ask what it costs."
        },
    ];

  return (
    <section
      id="how-it-works"
      className="w-full flex flex-col justify-center items-center gap-4 py-20 border-t border-green-800/20"
      data-aos="fade-right"
    >
      <div className="flex flex-col items-center justify-start text-center px-4">
        <h1 className="text-green-800 text-lg font-semibold tracking-wider uppercase">Why Order From Us</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Built for pet keepers who value quality
        </h2>
        <p className="text-gray-600 text-sm mt-3 max-w-lg">
          We make ordering feeder insects as easy as it should be.
        </p>
      </div>
        <div className="flex flex-row flex-wrap items-stretch justify-center gap-2 mt-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center min-w-42 max-w-xs flex-1 shadow-lg p-5 rounded-xl">
              <div className="bg-green-100 p-3 rounded-xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-xs">{step.description}</p>
            </div>
          ))}
        </div>
        <PrimaryButtonLink 
          text="Order Now"
          href="/order"
          icon={<IconArchiveFilled size={20} />}
        />
    </section>
  );
}