"use client";

import React, { useState } from "react";
import Picker from "react-mobile-picker";
import { format, subYears } from "date-fns";
import { Label } from "@radix-ui/react-label";

// Define option interface
interface Option {
  value: number;
  label: string;
}

// Define date picker state interface
interface DateState {
  year: number;
  month: number;
  day: number;
}

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

const DatePicker = ({ value, onChange }: DatePickerProps) => {
  // Parse value prop or use today
  const initial = value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? {
        year: parseInt(value.slice(0, 4)),
        month: parseInt(value.slice(5, 7)),
        day: parseInt(value.slice(8, 10)),
      }
    : {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      };
  const [date, setDate] = useState<DateState>(initial);

  // Generate options for year, month, day
  const yearOptions: Option[] = Array.from({ length: 100 }, (_, i) => ({
    value: subYears(new Date(), 50).getFullYear() + i,
    label: `${subYears(new Date(), 50).getFullYear() + i}`,
  }));

  const monthOptions: Option[] = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: format(new Date(2023, i, 1), "MMMM"),
  }));

  const getDayOptions = (year: number, month: number): Option[] => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      value: i + 1,
      label: `${i + 1}`,
    }));
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-[300px]" role="dialog" aria-label="Date picker">
      <Label className="text-lg font-playfair-display font-semibold">Birth Date</Label>
      <div className="rounded-lg shadow-lg p-4 w-full max-w-[400px] border border-gray-200">
        <Picker
          value={{
            year: date.year.toString(),
            month: date.month.toString(),
            day: date.day.toString(),
          }}
          onChange={(nextValue) => {
            const year = parseInt(nextValue.year);
            const month = parseInt(nextValue.month);
            let day = parseInt(nextValue.day);
            const daysInMonth = new Date(year, month, 0).getDate();
            if (day > daysInMonth) day = daysInMonth;
            const newDate = { year, month, day };
            setDate(newDate);
            const formatted = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            onChange(formatted);
          }}
          wheelMode="natural"
          height={180}
          itemHeight={36}
          className="w-full"
        >
          {/* Year column */}
          <Picker.Column name="year">
            {yearOptions.map(option => (
              <Picker.Item key={option.value} value={option.value.toString()}>{option.label}</Picker.Item>
            ))}
          </Picker.Column>
          {/* Month column */}
          <Picker.Column name="month" className="w-[200px]">
            {monthOptions.map(option => (
              <Picker.Item key={option.value} value={option.value.toString()}>{option.label}</Picker.Item>
            ))}
          </Picker.Column>
          {/* Day column */}
          <Picker.Column name="day">
            {getDayOptions(date.year, date.month).map(option => (
              <Picker.Item key={option.value} value={option.value.toString()}>{option.label}</Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
      </div>
      <div className="flex flex-col items-center mt-4 text-lg font-playfair-display">
        <span className="text-green-500 text-xs sm:text-sm md:text-base text-center">(Use Two Fingers to Scroll For Laptop Pads)</span>
        <p className="text-primary text-sm">Selected: {format(new Date(date.year, date.month - 1, date.day), "MMMM d, yyyy")}</p>
      </div>
    </div>
  );
};

export default DatePicker;