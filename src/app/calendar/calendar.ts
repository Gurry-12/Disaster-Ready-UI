import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentYear: number;
  currentMonth: number;
  calendarDates: Date[] = [];
  selectedDate: Date = new Date();
  newEventTitle: string = '';
  events: { [date: string]: { title: string, color: string }[] } = {};

  constructor() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.generateCalendar();
  }

  get selectedDateString() {
    return this.selectedDate.toISOString().split('T')[0];
  }

  generateCalendar() {
    this.calendarDates = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDay = firstDay.getDay();
    // Fill previous month's days
    for (let i = 0; i < startDay; i++) {
      this.calendarDates.push(new Date(this.currentYear, this.currentMonth, i - startDay + 1));
    }
    // Fill current month's days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      this.calendarDates.push(new Date(this.currentYear, this.currentMonth, d));
    }
    // Fill next month's days to complete the grid
    while (this.calendarDates.length % 7 !== 0) {
      const nextDate = this.calendarDates.length - (startDay + lastDay.getDate()) + 1;
      this.calendarDates.push(new Date(this.currentYear, this.currentMonth + 1, nextDate));
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(date: Date) {
    this.selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  isSelectedDate(date: Date): boolean {
    return date.getFullYear() === this.selectedDate.getFullYear() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getDate() === this.selectedDate.getDate();
  }

  hasEvent(date: Date): boolean {
    const key = date.toISOString().split('T')[0];
    return !!this.events[key] && this.events[key].length > 0;
  }

  addEvent() {
    if (!this.newEventTitle.trim()) return;
    const key = this.selectedDateString;
    if (!this.events[key]) this.events[key] = [];
    const color = '#d32f2f'; // basic red for all events
    this.events[key].push({ title: this.newEventTitle, color });
    this.newEventTitle = '';
  }
}
