import { IconUserFilled, IconMapPinFilled , IconMessageCircleFilled, IconArchiveFilled } from '@tabler/icons-react';

export default function OrderHistoryCard({ orderId, orderDate, orderBy, orderLocation, orderVia, orderModeTransport, orderItems, orderTotal }) {
  return (
    <div key={orderId} className="flex flex-col gap-2 w-full rounded-2xl p-3 shadow-md border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 bg-white/80 border-white/40" data-aos="fade-right">
      <div className="flex flex-row items-center justify-between">
        <div>
            <h2 className="font-bold text-green-800">Order #{orderId}</h2>
        <p className="text-sm text-gray-600">Date: {orderDate}</p>
        </div>
        <div>
            <p className="font-black text-green-800">₱{orderTotal}</p>
        </div>
      </div>
      <div>
        {orderItems.map((item) => (
            <div key={item.id} className="flex flex-row items-center justify-between w-full rounded-2xl p-2">
                <div className="flex flex-row items-center gap-2">
                    <p className="text-sm font-semibold text-green-800">{item.quantity} • {item.name}</p>
                    <p className="text-xs text-gray-600">({item.size}) • {item.pieces} + {item.freebies} pcs</p>
                </div>
                <div>
                    <p className="font-bold text-gray-600">₱{item.price}</p>
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
