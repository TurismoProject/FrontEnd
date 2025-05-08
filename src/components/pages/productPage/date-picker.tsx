"use client";

import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ptBR } from "@mui/x-date-pickers/locales";
import { ptBR as pt } from "date-fns/locale";
import { IProduct } from "@/lib/interfaces";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeView } from "@mui/x-date-pickers/models";
import { useBooking } from "../../../contexts/BookingContext";

export default function DatePicker({ data }: { data: IProduct }) {
  const { duration, workingHours, availability } = data;
  const { selectedDateTime, setSelectedDateTime } = useBooking();

  const [date, setDate] = useState<Date | undefined>(
    selectedDateTime || new Date()
  );
  const [calendarWasSelected, setCalendarWasSelected] = useState<boolean>(
    !!selectedDateTime
  );
  const [timeWasSelected, setTimeWasSelected] = useState<boolean>(
    !!selectedDateTime
  );

  // Helper to update only the date part
  function handleDateChange(newDate: Date | undefined) {
    if (!newDate || !date) {
      setDate(newDate);
      return;
    }

    setCalendarWasSelected(true);

    // Keep the time from the current date
    const updated = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    setDate(updated);
  }

  // Helper to update only the time part
  function handleTimeChange(newTime: Date | null) {
    if (!newTime || !date) {
      setDate(newTime ?? undefined);
      return;
    }

    setTimeWasSelected(true);

    // Keep the date from the current date
    const updated = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      newTime.getHours(),
      0,
      0,
      newTime.getMilliseconds()
    );
    setDate(updated);
  }

  // Update context when date changes
  useEffect(() => {
    if (date && calendarWasSelected && timeWasSelected) {
      setSelectedDateTime(date);
    }
  }, [date, calendarWasSelected, timeWasSelected, setSelectedDateTime]);

  // --- New logic for min/max time and step ---
  let minTime: Date | undefined = undefined;
  let maxTime: Date | undefined = undefined;
  let minutesStep: number = 1;
  const dayOfWeekMap = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  if (date) {
    // Get JS day (0=Sunday, 1=Monday, ...)
    const jsDay = date.getDay();
    // Map JS day to WorkingHours DayOfWeek string
    const todayStr = dayOfWeekMap[jsDay];

    // Find working hours for the selected day
    const todayWorking = workingHours?.find(
      (wh) => wh.dayOfWeek === todayStr && wh.isAvailable
    );

    if (todayWorking) {
      // Parse start and end time (format: "HH:mm")
      const [startHour, startMinute] = todayWorking.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = todayWorking.endTime.split(":").map(Number);

      minTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        startHour,
        startMinute,
        0,
        0
      );

      maxTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        endHour,
        endMinute,
        0,
        0
      );
    }
  }

  // Set minutesStep based on duration (duration is in hours)
  if (duration && duration > 0) {
    minutesStep = duration * 60;
  }

  function isWorkingDay(day: Date) {
    const jsDay = day.getDay();
    const todayStr = dayOfWeekMap[jsDay];
    return workingHours?.some(
      (wh) => wh.dayOfWeek === todayStr && wh.isAvailable
    );
  }

  // Helper to get working hours for a specific day
  function getWorkingHoursForDay(day: Date) {
    const jsDay = day.getDay();
    const todayStr = dayOfWeekMap[jsDay];
    return workingHours?.find(
      (wh) => wh.dayOfWeek === todayStr && wh.isAvailable
    );
  }

  // Helper to generate all possible booking times for a day
  function getPossibleBookingTimes(day: Date) {
    const wh = getWorkingHoursForDay(day);
    if (!wh) return [];
    const [startHour, startMinute] = wh.startTime.split(":").map(Number);
    const [endHour, endMinute] = wh.endTime.split(":").map(Number);
    const slots: Date[] = [];
    let slot = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      startHour,
      startMinute,
      0,
      0
    );
    const end = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      endHour,
      endMinute,
      0,
      0
    );
    const durationMinutes = duration * 60;
    while (slot <= end) {
      slots.push(new Date(slot));
      slot = new Date(slot.getTime() + durationMinutes * 60000);
    }
    return slots;
  }

  // Helper to check if all slots for a day are booked
  function areAllSlotsBooked(day: Date) {
    const slots = getPossibleBookingTimes(day);
    if (slots.length === 0) return false; // Not a working day
    return slots.every((slot) => {
      const avail = availability?.find((a) => {
        const availDate = new Date(a.date);
        return (
          availDate.getFullYear() === slot.getFullYear() &&
          availDate.getMonth() === slot.getMonth() &&
          availDate.getDate() === slot.getDate() &&
          availDate.getHours() === slot.getHours() &&
          availDate.getMinutes() === slot.getMinutes()
        );
      });
      // If there's no availability object for this slot, it's available
      return avail && avail.isBooked;
    });
  }

  // Function for the Calendar's disabled prop
  function isDayDisabled(day: Date) {
    if (!workingHours || workingHours.length === 0) return true;
    if (!isWorkingDay(day)) return true;
    if (!availability || availability.length === 0) {
      // No availability array: only working days are enabled
      return false;
    }
    // If all slots are booked, disable the day
    return areAllSlotsBooked(day);
  }

  // Function for the TimeClock's shouldDisableTime prop
  function shouldDisableTime(timeValue: Date, viewType: TimeView) {
    if (!date) return true;

    // Compose a Date object for the slot being checked
    const slot = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      timeValue.getHours(),
      viewType === "minutes" ? timeValue.getMinutes() : 0,
      0,
      0
    );

    // Check if this slot is booked in availability
    const slotIsBooked = availability?.some((a) => {
      const availDate = new Date(a.date);
      return (
        availDate.getFullYear() === slot.getFullYear() &&
        availDate.getMonth() === slot.getMonth() &&
        availDate.getDate() === slot.getDate() &&
        availDate.getHours() === slot.getHours() &&
        availDate.getMinutes() === slot.getMinutes() &&
        a.isBooked
      );
    });

    if (slotIsBooked) return true;

    if (viewType === "hours" && duration && duration > 0) {
      if (minTime && maxTime) {
        const minHour = minTime.getHours();
        const maxHour = maxTime.getHours();
        let valid = false;
        for (let h = minHour; h <= maxHour; h += duration) {
          if (timeValue.getHours() === h) valid = true;
        }
        return !valid;
      }
      return timeValue.getHours() % duration !== 0;
    }
    if (viewType === "minutes" && duration && duration > 0) {
      return timeValue.getMinutes() !== 0;
    }
    return false;
  }
  return (
    <Popover>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        localeText={
          ptBR.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full justify-start text-left font-normal z-[60] relative border rounded-lg grid grid-cols-2 items-center text-sm gap-0 text-black hover:bg-transparent focus:bg-transparent active:bg-transparent transition duration-75 ease-in-out border-gray-800",
              !calendarWasSelected && "text-muted-foreground"
            )}
          >
            <div className="flex w-full h-full p-4">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {calendarWasSelected && date ? (
                format(date, "d/MMM/y", { locale: pt })
              ) : (
                <span>Data</span>
              )}
            </div>
            <div className="flex border-l border-gray-300 w-full h-full p-4">
              <ClockIcon className="mr-2 h-4 w-4" />
              {timeWasSelected && date ? (
                format(date, "HH:mm", { locale: pt })
              ) : (
                <span>Horário</span>
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-fit min-h-fit p-4 rounded-xl bg-white"
          avoidCollisions={false}
          sideOffset={-90}
        >
          <div className="flex items-center justify-center gap-10 mt-20">
            <Calendar
              mode="single"
              locale={pt}
              selected={date}
              onSelect={handleDateChange}
              disabled={isDayDisabled}
              initialFocus
            />

            {/* <DateCalendar
              value={date}
              onChange={handleDateChange}
              minDate={new Date()}
              maxDate={new Date(2024, 11, 31)}
              // shouldDisableDate={(day: Date) => {
              //   const dayOfWeek = day.getDay();
              //   const formattedDate = format(day, "yyyy-MM-dd");
              // }}
              dayOfWeekFormatter={(day) => {
                return format(day, "E", { locale: pt });
              }}
              
            /> */}

            {/* <DigitalClock
              value={date}
              onChange={handleTimeChange}
              minTime={minTime}
              maxTime={maxTime}
              disabled={!calendarWasSelected}
              ampm={false}
              timeStep={minutesStep}
            /> */}

            <TimeClock
              value={date}
              onChange={handleTimeChange}
              minTime={minTime}
              maxTime={maxTime}
              disabled={!calendarWasSelected}
              views={["hours"]}
              ampm={false}
              shouldDisableTime={shouldDisableTime}
            />
          </div>
        </PopoverContent>
      </LocalizationProvider>
    </Popover>
  );
}
