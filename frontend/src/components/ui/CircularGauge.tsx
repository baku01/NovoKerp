interface GaugeProps {
    value: number;
    max?: number;
    size?: number;
    label: string;
    color?: 'green' | 'yellow' | 'orange' | 'red';
}

const colorMap = {
    green: 'rgb(0, 255, 0)',
    yellow: 'rgb(255, 255, 0)',
    orange: 'rgb(255, 165, 0)',
    red: 'rgb(255, 0, 0)',
};

export function CircularGauge({ value, max = 100, size = 120, label, color = 'green' }: GaugeProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const strokeColor = colorMap[color];

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r="45"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r="45"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
                {/* Center text */}
                <text
                    x={size / 2}
                    y={size / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="transform rotate-90"
                    style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
                    fill={strokeColor}
                    fontSize="20"
                    fontWeight="bold"
                >
                    {percentage.toFixed(1)}%
                </text>
            </svg>
            <p className="text-xs text-slate-400 mt-2 text-center">{label}</p>
        </div>
    );
}
