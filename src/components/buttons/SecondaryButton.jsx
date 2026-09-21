export default function SecondaryButton({ icon, text, action, isDisabled }) {
  return (
    <button
      onClick={action}
      className="flex flex-row items-center justify-center gap-2 text-amber-900 px-4 py-2 rounded-full font-medium border border-amber-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer 
      disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:hover:shadow-none disabled:hover:-translate-y-0 disabled:active:scale-100 disabled:text-white disabled:border-gray-400"
      disabled={isDisabled}
    >
      {icon ? icon : null}
      {text? text : null}
    </button>
  )
}
