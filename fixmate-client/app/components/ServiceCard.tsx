import Link from 'next/link';
import { ServiceItem } from '../../types/fixmate';

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
      <div>
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-44 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-teal-700">
              {service.category}
            </span>
            <span className="text-slate-500">{service.serviceMode}</span>
          </div>
          <h2 className="font-semibold text-base text-slate-900 line-clamp-1">
            {service.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Area: {service.serviceArea}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Technician: {service.technicianName}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block">Starting</span>
          <span className="font-bold text-slate-900">${service.basePrice}</span>
        </div>
        <Link
          href={`/services/${service._id}`}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}