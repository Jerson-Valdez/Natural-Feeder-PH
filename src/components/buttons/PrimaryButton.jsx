export default function PrimaryButton({ icon, text, action }) {
  return (
    <button
      onClick={action}
      className="flex flex-row items-center justify-center gap-2 bg-green-800 text-white px-4 py-2 rounded-full font-medium hover:bg-green-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
    >
      {icon ? icon : null}
      {text? text : null}
    </button>
  );
}
