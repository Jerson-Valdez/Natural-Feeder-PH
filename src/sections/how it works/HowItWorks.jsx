import {
  IconArchiveFilled,
  IconSearch,
  IconSend,
  IconShoppingBagCheck,
  IconMotorbike,
} from "@tabler/icons-react";
import HowItWorksStep from "../../components/steps/HowItWorksStep";

export default function HowItWorks() {
    const steps = [
        {
            step: "Step 1",
            icon: <IconSearch size={18} />,
            title: "Browse The Catalog",
            description: "Explore our live stock of Dubia roaches and superworms with transparent pricing and sizes — no need to message for quotes.",
        },
        {
            step: "Step 2",
            icon: <IconArchiveFilled size={18} />,
            title: "Build Your Order",
            description: "Pick your variants, set quantities, and your total updates instantly. Review everything in your cart before sending.",
        },
        {
            step: "Step 3",
            icon: <IconSend size={18} />,
            title: "Receipt via Messenger",
            description: "One tap generates a pre-filled Messenger deep link with your full order details. We receive it instantly — no retyping.",
        },
        {
            step: "Step 4",
            icon: <IconShoppingBagCheck size={18} />,
            title: "We Confirm & Pack",
            description: "Our admin reviews your order, confirms availability, and packs your feeders fresh — you get a status update at each step.",
        },
        {
            step: "Step 5",
            icon: <IconMotorbike size={18} />,
            title: "Delivery to Your Door",
            description: "We arrange delivery or pickup. Track the status from Pending to Packed to Delivered right from your order history.",
        },
    ];

  return (
    <section
      id="how-it-works"
      className="w-full flex flex-col justify-center items-center gap-4 py-20 border-t border-green-800/20"
      data-aos="fade-right"
    >
      <div className="flex flex-col items-center justify-start text-center px-4">
        <h1 className="text-green-800 text-lg font-semibold tracking-wider uppercase">How It Works</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          From browse to delivery in five steps
        </h2>
        <p className="text-gray-600 text-sm mt-3 max-w-lg">
          A simple, transparent ordering flow designed to save you time.
        </p>
      </div>

      {/* TIMELINE CONTAINER */}
      <div className="relative w-full max-w-4xl mx-auto mt-12 px-6 lg:px-0">
        
        {/* The Straight Vertical Line */}
        <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-1 bg-green-800/20 -translate-x-1/2 rounded-full"></div>

        {/* The Steps */}
        {steps.map((step, index) => (
          <HowItWorksStep
            key={index}
            index={index}
            step={step.step}
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </section>
  );
}