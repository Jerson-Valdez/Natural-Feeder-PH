import { IconUserFilled, IconMapPinFilled , IconMessageCircleFilled, IconArchiveFilled } from '@tabler/icons-react';
import Status from '../status/Status';

export default function OrderHistoryCard({ orderId, createdAt, orderBy, orderLocation, orderVia, orderModeTransport, orderItems, orderTotal, status }) {
    const color = () => {switch (status) {
        case "pending": return "yellow";
        case "awaiting messenger chat": return "blue";
        default: return "gray";
    }};

  return (
    <div key={orderId} className="flex flex-col gap-2 w-full rounded-2xl p-3 shadow-lg border cursor-pointer hover:shadow-lg hover:-translate-y-0.5 bg-white/80 border-white/40 transition-all duration-300">
      <div className="flex flex-col-reverse w-full lg:flex-row items-start lg:items-center justify-between">
        <div>
            <h2 className="font-bold text-green-800">#{orderId}</h2>
        <p className="text-sm text-gray-600">Date: {createdAt.toLocaleString()}</p>
        </div>
        <div className="flex flex-row lg:flex-col w-full items-end justify-between gap-2 mb-2">
            <Status description={status} color={color()} />
            <p className="font-black text-green-800">{orderTotal.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</p>
        </div>
      </div>
      <div>
        {orderItems.map((item) => (
            <div key={item.id} className="flex flex-row items-center justify-between w-full rounded-2xl p-2">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                    <p className="text-sm font-semibold text-green-800">{item.quantity} • {item.name}</p>
                    <p className="text-xs text-gray-600">({item.size}) • {item.pieces} + {item.freebies} pcs</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">{(item.price * item.quantity).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</p>
                </div>
            </div>
        ))}
        <hr className="border-gray-300" />
        <div className="flex flex-row flex-wrap items-center justify-start w-full rounded-2xl p-2 gap-5">
            <div className="flex flex-row items-center gap-2">
                <IconUserFilled className="text-gray-400" size={18}/>
                <p className="text-xs text-gray-600">{orderBy}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
                <IconMapPinFilled className="text-gray-400" size={18}/>
                <p className="text-xs text-gray-600">{orderLocation}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
                <IconMessageCircleFilled className="text-gray-400" size={18} />
                <p className="text-xs text-gray-600">{orderVia}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
                <IconArchiveFilled className="text-gray-400" size={18} />
                <p className="text-xs text-gray-600">{orderModeTransport}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
