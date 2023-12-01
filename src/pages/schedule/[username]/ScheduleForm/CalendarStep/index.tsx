import { Calendar } from "@/src/components/Calendar";
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles";
import { useState } from "react";
import dayjs from "dayjs";
import { api } from "@/src/lib/axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void;
}
export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDateSelected = !!selectedDate; // dupla negacao converte em boolean
  const router = useRouter();
  const username = String(router.query.username);
  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  const { data: availability } = useQuery<Availability>({
    queryKey: ["availability", selectedDateWithoutTime],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      });

      return response.data;
    },
    enabled: !!selectedDate,
  });

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate();

    onSelectDateTime(dateWithTime);
  }

  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const describeDate = selectedDate
    ? dayjs(selectedDate).format("DD[ de ] MMMM")
    : null;

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describeDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              const isDisabled =
                availability.availableTimes.includes(hour) ||
                dayjs(selectedDate)
                  .set("hour", hour)
                  .startOf("hour")
                  .isBefore(dayjs());
              return (
                <TimePickerItem
                  key={hour}
                  onClick={() => handleSelectTime(hour)}
                  // possivel bug
                  disabled={isDisabled}
                >
                  {String(hour).padStart(2, "0")}:00h
                </TimePickerItem>
              );
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
}
