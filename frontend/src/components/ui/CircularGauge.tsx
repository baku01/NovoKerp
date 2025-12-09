interface GaugeProps {
    value: number;
    max?: number;
    size?: number;
    label: string;
    color?: 'green' | 'yellow' | 'orange' | 'red';
    tone?: 'light' | 'dark';
}

const colorMap = {
    green: '#22c55e',
    yellow: '#facc15',
    orange: '#fb923c',
    red: '#f87171',
};

export function CircularGauge({ value, max = 100, size = 120, label, color = 'green', tone = 'light' }: GaugeProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const strokeColor = colorMap[color];
    const labelClass = tone === 'dark' ? 'text-slate-200/85' : 'text-slate-600';
    const trackColor = tone === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(148, 163, 184, 0.28)';

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r="45"
                    fill="none"
                    stroke={trackColor}
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
                    fontWeight="800"
                >
                    {percentage.toFixed(1)}%
                </text>
            </svg>
            <p className={`text-xs mt-2 text-center ${labelClass}`}>{label}</p>
        </div>
    );
}
