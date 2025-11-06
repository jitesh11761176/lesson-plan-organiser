import React, { useState, useMemo } from 'react';
import { LessonPlan } from '../types';

interface DashboardViewProps {
  history: LessonPlan[];
  onSelectPlan: (plan: LessonPlan) => void;
}

type SortKey = keyof LessonPlan['meta'] | 'timestamp';

const SortableHeader: React.FC<{
    sortKey: SortKey;
    label: string;
    sortConfig: { key: SortKey; direction: 'ascending' | 'descending' };
    requestSort: (key: SortKey) => void;
}> = ({ sortKey, label, sortConfig, requestSort }) => {
    const isSorted = sortConfig.key === sortKey;
    const icon = isSorted ? (sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort';

    return (
        <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => requestSort(sortKey)}
        >
            <div className="flex items-center">
                {label}
                <i className={`fas ${icon} ml-2 text-gray-400`}></i>
            </div>
        </th>
    );
};

const DashboardView: React.FC<DashboardViewProps> = ({ history, onSelectPlan }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({
        key: 'timestamp',
        direction: 'descending',
    });

    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedHistory = useMemo(() => {
        const sortableItems = [...history];
        sortableItems.sort((a, b) => {
            const aValue = sortConfig.key === 'timestamp' ? a.timestamp : a.meta[sortConfig.key];
            const bValue = sortConfig.key === 'timestamp' ? b.timestamp : b.meta[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [history, sortConfig]);
    
    if (history.length === 0) {
        return (
             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center py-20">
                <i className="fas fa-tachometer-alt text-6xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Dashboard is Empty</h2>
                <p className="text-gray-500">Generate a lesson plan to see its summary here.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lesson Plan Dashboard</h2>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader sortKey="timestamp" label="Date Generated" sortConfig={sortConfig} requestSort={requestSort} />
                                        <SortableHeader sortKey="classNumber" label="Class" sortConfig={sortConfig} requestSort={requestSort} />
                                        <SortableHeader sortKey="subject" label="Subject" sortConfig={sortConfig} requestSort={requestSort} />
                                        <SortableHeader sortKey="dateRange" label="Fortnight" sortConfig={sortConfig} requestSort={requestSort} />
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">View</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedHistory.map((plan) => (
                                        <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(plan.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {plan.meta.classNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {plan.meta.subject}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {plan.meta.dateRange}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => onSelectPlan(plan)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
