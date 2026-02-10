import Image from "next/image";

interface ChassisIconProps {
  chassis: string;
  className?: string;
}

export function ChassisIcon({ chassis, className = "" }: ChassisIconProps) {
  const chassisLower = chassis.toLowerCase();
  
  // Map chassis codes to icon filenames
  const iconPath = `/chassis-icons/${chassisLower}.avif`;
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src={iconPath}
        alt={`${chassis} chassis`}
        width={80}
        height={40}
        className="object-contain"
        onError={(e) => {
          // Fallback to text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.nextSibling) {
            (target.nextSibling as HTMLElement).style.display = 'flex';
          }
        }}
      />
      <div
        className="hidden items-center justify-center rounded border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700"
        style={{ width: '80px', height: '40px' }}
      >
        {chassis}
      </div>
    </div>
  );
}
