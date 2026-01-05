import styles from './WeeklyCalendar.module.css';
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

interface WeekStreak {
    activityDates: string[];
    onDateClick?: (date: string) => void;
}

function WeeklyCalendar ({ activityDates, onDateClick }: WeekStreak) {
    const [weekDays, setWeekDays] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    useEffect(() => {

        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d);
        }
        setWeekDays(days);
    }, []);


    const isToday = (date: Date) => {
        return date.toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA');
    };

    const isActive = (date: Date) => {
        return activityDates.includes(date.toLocaleDateString('en-CA'));
    };

    const getDayName = (date: Date) => {
        return date.toLocaleDateString('pl-PL', { weekday: 'short' });
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);

        const dateString = date.toLocaleDateString('en-CA');
        if (onDateClick) {
            onDateClick(dateString);
        }
    }

    return (
        <div className={styles.weekContainer}>
            {weekDays.map((date, index) => {
                const active = isActive(date);
                const today = isToday(date);

                return (
                    <div
                        key={index}
                        className={`${styles.dayColumn} 
                        ${today ? styles.today : ''}
                        ${selectedDate?.toDateString() === date.toDateString() ? styles.selected : ''}`}

                        onClick={() => handleDayClick(date)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className={styles.dayName}>{getDayName(date)}</span>

                        <div className={`${styles.dayCircle} ${active ? styles.active : ''}`}>
                            {active ? <FontAwesomeIcon icon={faCheck} /> : date.getDate()}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default WeeklyCalendar