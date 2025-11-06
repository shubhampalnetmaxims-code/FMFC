import React, { useState, useMemo } from 'react';
import Icon from './Icon';
import { UserMeasurement, DietIntakeItem, NutritionPlan } from '../types';

// --- OPTIONS FOR FILTERS ---
const TIME_OPTIONS = ['This Week', 'This Month'];
const NUTRITION_METRICS = ['Energy', 'Carbohydrates', 'Proteins', 'Fats', 'Fibre', 'Water'];
const SESSION_METRICS = ['Sessions', 'Sessions Missed'];
const MEASUREMENT_METRICS = ['Weight', 'Height', 'Chest', 'Waist', 'Hips', 'Neck', 'Thigh', 'Biceps', 'Triceps', 'Subscapular', 'Suprailiac', 'Body fat'];

// --- PROPS ---
interface ProgressGraphsProps {
    userMeasurements: UserMeasurement[];
    additionalDietItems: DietIntakeItem[];
    activePlan: NutritionPlan | undefined;
    checkedNutritionItems: Record<string, Set<string>>;
}

interface BarChartProps {
    data: { label: string; value: number }[];
    colorClass?: string;
}

interface GraphCardProps {
    title: string;
    metric: string;
    setMetric: (value: string) => void;
    metricOptions: string[];
    timePeriod: string;
    setTimePeriod: (value: string) => void;
    offset: number;
    setOffset: (fn: (prev: number) => number) => void;
    chartData: { label: string; value: number }[];
}


// --- BAR CHART COMPONENT ---
const BarChart: React.FC<BarChartProps> = ({ data, colorClass = 'bg-amber-700' }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

    return (
        <div className="h-48 flex items-end justify-around gap-2 pt-4">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center h-full">
                    <div className="text-xs text-zinc-300 font-semibold mb-1">{item.value > 0 ? item.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : ''}</div>
                    <div 
                        className={`w-full rounded-t-md transition-all duration-300 ${colorClass}`}
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                    />
                    <div className="text-xs font-semibold text-zinc-400 mt-2">{item.label}</div>
                </div>
            ))}
        </div>
    );
};


// --- GRAPH CARD COMPONENT ---
const GraphCard: React.FC<GraphCardProps> = ({ title, metric, setMetric, metricOptions, timePeriod, setTimePeriod, offset, setOffset, chartData }) => {
    return (
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-200 mb-4">{title}</h3>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <select
                        value={timePeriod}
                        onChange={e => setTimePeriod(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                    >
                        {TIME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                     <select
                        value={metric}
                        onChange={e => setMetric(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                    >
                        {metricOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setOffset(p => p + 1)} className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                        <Icon type="arrow-left" className="w-4 h-4 text-zinc-400"/>
                    </button>
                     <button onClick={() => setOffset(p => p - 1)} className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors" disabled={offset === 0}>
                        <Icon type="arrow-right" className="w-4 h-4 text-zinc-400"/>
                    </button>
                </div>
            </div>
            <BarChart data={chartData} />
        </div>
    );
};

// --- MAIN COMPONENT ---
const ProgressGraphs: React.FC<ProgressGraphsProps> = ({ userMeasurements }) => {
    // Shared state
    const [timePeriod, setTimePeriod] = useState(TIME_OPTIONS[0]);
    const [offset, setOffset] = useState(0);

    // Individual state for metrics
    const [nutritionMetric, setNutritionMetric] = useState(NUTRITION_METRICS[0]);
    const [sessionMetric, setSessionMetric] = useState(SESSION_METRICS[0]);
    const [measurementMetric, setMeasurementMetric] = useState(MEASUREMENT_METRICS[0]);

    // MOCKED DATA
    const mockNutritionData = {
        'Energy': [{ label: 'Mon', value: 1309 }, { label: 'Tue', value: 3178 }, { label: 'Wed', value: 1800 }, { label: 'Thu', value: 2200 }, { label: 'Fri', value: 2500 }, { label: 'Sat', value: 3000 }, { label: 'Sun', value: 2800 }],
        'Carbohydrates': [{ label: 'Mon', value: 150 }, { label: 'Tue', value: 200 }, { label: 'Wed', value: 180 }, { label: 'Thu', value: 220 }, { label: 'Fri', value: 250 }, { label: 'Sat', value: 300 }, { label: 'Sun', value: 280 }],
        'Proteins': [{ label: 'Mon', value: 80 }, { label: 'Tue', value: 120 }, { label: 'Wed', value: 100 }, { label: 'Thu', value: 110 }, { label: 'Fri', value: 130 }, { label: 'Sat', value: 150 }, { label: 'Sun', value: 140 }],
    };
    
    const mockSessionData = {
        'Sessions': [{ label: 'Mon', value: 1 }, { label: 'Tue', value: 1 }, { label: 'Wed', value: 0 }, { label: 'Thu', value: 1 }, { label: 'Fri', value: 1 }, { label: 'Sat', value: 2 }, { label: 'Sun', value: 0 }],
        'Sessions Missed': [{ label: 'Mon', value: 0 }, { label: 'Tue', value: 0 }, { label: 'Wed', value: 1 }, { label: 'Thu', value: 0 }, { label: 'Fri', value: 0 }, { label: 'Sat', value: 0 }, { label: 'Sun', value: 0 }],
    };
    
    const measurementData = useMemo(() => {
        const data: { label: string; value: number }[] = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay() - (offset * 7)));
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + i);
            const dateKey = currentDate.toISOString().split('T')[0];
            const measurementForDay = userMeasurements.find(m => m.date === dateKey);
            const metricKey = measurementMetric.toLowerCase().replace(' ', '') as keyof UserMeasurement;
            
            data.push({
                label: days[currentDate.getDay()],
                value: (measurementForDay && measurementForDay[metricKey]) ? Number(measurementForDay[metricKey]) : 0,
            });
        }
        return data;

    }, [userMeasurements, measurementMetric, offset]);

    return (
        <div className="p-4 space-y-4">
            <GraphCard
                title="Nutrition"
                metric={nutritionMetric}
                setMetric={setNutritionMetric}
                metricOptions={NUTRITION_METRICS}
                timePeriod={timePeriod}
                setTimePeriod={setTimePeriod}
                offset={offset}
                setOffset={setOffset}
                chartData={mockNutritionData[nutritionMetric as keyof typeof mockNutritionData] || []}
            />
            <GraphCard
                title="Sessions"
                metric={sessionMetric}
                setMetric={setSessionMetric}
                metricOptions={SESSION_METRICS}
                timePeriod={timePeriod}
                setTimePeriod={setTimePeriod}
                offset={offset}
                setOffset={setOffset}
                chartData={mockSessionData[sessionMetric as keyof typeof mockSessionData]}
            />
            <GraphCard
                title="Measurements"
                metric={measurementMetric}
                setMetric={setMeasurementMetric}
                metricOptions={MEASUREMENT_METRICS}
                timePeriod={timePeriod}
                setTimePeriod={setTimePeriod}
                offset={offset}
                setOffset={setOffset}
                chartData={measurementData}
            />
        </div>
    );
};

export default ProgressGraphs;
