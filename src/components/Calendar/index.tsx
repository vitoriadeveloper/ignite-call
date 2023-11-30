import { CaretLeft, CaretRight } from "phosphor-react";
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./styles";
import { getWeekDays } from "@/src/utils/get-week-days";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { api } from "@/src/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

interface BlockedDates {
  blockedWeekDays: number[];
  blockedDates: number[];
}

interface CalendarProps {
  selectedDate?: Date | null;
  onDateSelected: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });

  function handlePreviousMonth() {
    const previousMonth = currentDate.subtract(1, "month");

    setCurrentDate(previousMonth);
  }
  function handleNextMonth() {
    const nextMonth = currentDate.add(1, "month");

    setCurrentDate(nextMonth);
  }
  const shortWeekDays = getWeekDays({ short: true });
  const router = useRouter();
  const username = String(router.query.username);
  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      "blocked-dates",
      currentDate.get("year"),
      currentDate.get("month"),
    ],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get("year"),
          month: currentDate.get("month") + 1,
        },
      });

      return response.data;
    },
  });
  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return [];
    }
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set("date", i + 1); // date aqui quer dizer o dia, pega o dia
    });

    const fisrtWeekDay = currentDate.get("day"); // para pegar o dia da semana

    // para pegar os dias do mes passado que faltaram para preencher o calendario
    const previousMonthFillArray = Array.from({
      length: fisrtWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, "day");
      })
      .reverse();

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth(),
    );
    const lastWeekDay = lastDayInCurrentMonth.get("day");
    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, "day");
    });
    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf("day").isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get("day")) ||
            blockedDates.blockedDates.includes(date.get("date")),
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
    ];
    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        // pegando o primeiro dia de uma nova semana
        const isNewWeek = i % 7 === 0;

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          });
        }
        return weeks;
      },
      [],
    );
    return calendarWeeks;
  }, [currentDate, blockedDates]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekday, index) => (
              <th key={index}>{weekday}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ days, week }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        onClick={() => onDateSelected(date.toDate())}
                        disabled={disabled}
                      >
                        {date.get("date")}
                      </CalendarDay>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
