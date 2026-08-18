import { IconTruckFilled } from '@tabler/icons-react';

export default function Status({icon, description, color}) {

    switch (icon) {
        case 'truck':
            icon = <IconTruckFilled size={24} />
            break;
        default:
            icon = null;
            break;
    }

    switch (color) {
        case 'green':
            color = 'text-green-800 bg-green-800/20'
            break;
        default:
            color = 'text-black bg-black/20'
            break;
    }
    
    return(
        <div className={`w-fit px-4 py-1.5 flex flex-row gap-2 items-center justify-center rounded-full ${color}`}>
            {icon}
            <p className="text-sm font-semibold">{description}</p>
        </div>
    )
}