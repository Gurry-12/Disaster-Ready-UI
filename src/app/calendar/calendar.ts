import { Component, signal, computed } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarEvent {
  title: string;
  date: Date;
  color: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule , DatePipe],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {
  selectedView = signal<'month' | 'week' | 'day'>('month');
  selectedDate = signal(new Date());

  newEventTitle = '';
  newEventColor = 'blue';
  colors = ['red', 'blue', 'green', 'orange', 'purple'];

  events: CalendarEvent[] = [];

  dayTimeSlots = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`);

  displayedWeekDays = computed(() =>
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  );

  displayedDates = computed(() => {
    const base = new Date(this.selectedDate().getTime());
    base.setDate(base.getDate() - base.getDay()); // start of week
    return Array.from({ length: 7 }, (_, i) => new Date(base.getTime() + i * 86400000));
  });

  addEvent() {
    this.events.push({
      title: this.newEventTitle,
      color: this.newEventColor,
      date: new Date(this.selectedDate())
    });
    this.newEventTitle = '';
    this.newEventColor = 'blue';
  }

  getEventsForSelectedDate() {
    const selected = this.selectedDate().toDateString();
    return this.events.filter(e => e.date.toDateString() === selected);
  }

  setView(view: 'month' | 'week' | 'day') {
    this.selectedView.set(view);
  }

  selectDate(date: Date) {
    this.selectedDate.set(new Date(date));
  }
}
