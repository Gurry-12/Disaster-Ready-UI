import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  color: string;
  description?: string;
  isBroadcast?: boolean;
  location?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {
  selectedView = signal<'month' | 'week' | 'year' | 'day'>('month');
  selectedDate = signal(new Date());
  
  // Event management
  newEventTitle = '';
  newEventColor = 'blue';
  newEventStartTime = '09:00';
  newEventEndTime = '10:00';
  newEventDescription = '';
  newEventLocation = '';
  newEventIsBroadcast = false;
  
  colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'teal', 'indigo'];
  events: CalendarEvent[] = [];

  // Time slots for day view
  dayTimeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  // Month view
  displayedMonthDays = computed(() => {
    const year = this.selectedDate().getFullYear();
    const month = this.selectedDate().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  });

  // Week view
  displayedWeekDays = computed(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  displayedWeekDates = computed(() => {
    const base = new Date(this.selectedDate().getTime());
    base.setDate(base.getDate() - base.getDay());
    return Array.from({ length: 7 }, (_, i) => new Date(base.getTime() + i * 86400000));
  });

  // Year view
  displayedYearMonths = computed(() => {
    const year = this.selectedDate().getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  });

  // Navigation methods
  previousPeriod() {
    const newDate = new Date(this.selectedDate());
    switch (this.selectedView()) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    this.selectedDate.set(newDate);
  }

  nextPeriod() {
    const newDate = new Date(this.selectedDate());
    switch (this.selectedView()) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    this.selectedDate.set(newDate);
  }

  goToToday() {
    this.selectedDate.set(new Date());
  }

  // Event methods
  addEvent() {
    if (!this.newEventTitle.trim()) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: this.newEventTitle,
      date: new Date(this.selectedDate()),
      startTime: this.newEventStartTime,
      endTime: this.newEventEndTime,
      color: this.newEventColor,
      description: this.newEventDescription,
      location: this.newEventLocation,
      isBroadcast: this.newEventIsBroadcast
    };

    this.events.push(event);
    this.resetEventForm();
  }

  deleteEvent(eventId: string) {
    this.events = this.events.filter(e => e.id !== eventId);
  }

  resetEventForm() {
    this.newEventTitle = '';
    this.newEventColor = 'blue';
    this.newEventStartTime = '09:00';
    this.newEventEndTime = '10:00';
    this.newEventDescription = '';
    this.newEventLocation = '';
    this.newEventIsBroadcast = false;
  }

  // Event filtering methods
  getEventsForDate(date: Date) {
    return this.events.filter(e => e.date.toDateString() === date.toDateString());
  }

  getEventsForSelectedDate() {
    return this.getEventsForDate(this.selectedDate());
  }

  getBroadcastEvents() {
    return this.events.filter(e => e.isBroadcast);
  }

  // View methods
  setView(view: 'month' | 'week' | 'year' | 'day') {
    this.selectedView.set(view);
  }

  selectDate(date: Date) {
    this.selectedDate.set(new Date(date));
  }

  // Helper methods
  isToday(date: Date) {
    return date.toDateString() === new Date().toDateString();
  }

  isCurrentMonth(date: Date) {
    return date.getMonth() === this.selectedDate().getMonth() && 
           date.getFullYear() === this.selectedDate().getFullYear();
  }

  getMonthName(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
  
  isValidDayInMonth(day: number, month: Date) {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    return date.getMonth() === month.getMonth();
  }
  
  getDayEvents(date: Date) {
    return this.getEventsForDate(date).slice(0, 3); // Show max 3 events per day
  }
}
