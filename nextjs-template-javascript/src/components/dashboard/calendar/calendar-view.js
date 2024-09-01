'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Calendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { CaretLeft as CaretLeftIcon } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import { CaretRight as CaretRightIcon } from '@phosphor-icons/react/dist/ssr/CaretRight';

import { paths } from '@/paths';
import { useDialog } from '@/hooks/use-dialog';

import { CalendarContext } from './calendar-context';
import { EventContent } from './event-content';
import { EventDialog } from './event-dialog';
import { Toolbar } from './toolbar';

const plugins = [dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin, timelinePlugin];

export function CalendarView({ view = 'dayGridMonth' }) {
  const { events, currentEventId, setCurrentEventId, createEvent, deleteEvent, updateEvent } =
    React.useContext(CalendarContext);

  const router = useRouter();

  const calendarRef = React.useRef(null);

  const [date, setDate] = React.useState(new Date());

  const createDialog = useDialog();

  const currentEvent = currentEventId ? events.get(currentEventId) : undefined;

  const handleViewChange = React.useCallback(
    (value) => {
      const calendarApi = calendarRef.current?.getApi();

      if (calendarApi) {
        calendarApi.changeView(value);
      }

      router.push(`${paths.dashboard.calendar}?view=${value}`);
    },
    [router]
  );

  const handleDateToday = React.useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi) {
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, []);

  const handleDatePrev = React.useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi) {
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, []);

  const handleDateNext = React.useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi) {
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, []);

  const handleAdd = React.useCallback(() => {
    createDialog.handleOpen();
  }, [createDialog]);

  const handleRangeSelect = React.useCallback(
    (arg) => {
      const calendarApi = calendarRef.current?.getApi();

      if (calendarApi) {
        calendarApi.unselect();
      }

      createDialog.handleOpen({ range: { start: arg.start, end: arg.end } });
    },
    [createDialog]
  );

  const handleEventSelect = React.useCallback(
    (arg) => {
      setCurrentEventId(arg.event.id);
    },
    [setCurrentEventId]
  );

  const handleEventResize = React.useCallback(
    (arg) => {
      const { event } = arg;
      updateEvent(event.id, { allDay: event.allDay, start: event.start, end: event.end });
    },
    [updateEvent]
  );

  const handleEventDrop = React.useCallback(
    (arg) => {
      const { event } = arg;
      updateEvent(event.id, { allDay: event.allDay, start: event.start, end: event.end });
    },
    [updateEvent]
  );

  return (
    <React.Fragment>
      <Stack spacing={4}>
        <Toolbar date={date} onAdd={handleAdd} onViewChange={handleViewChange} view={view} />
        <Card sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: '800px' }}>
            <Calendar
              allDayMaintainDuration
              dayMaxEventRows={3}
              droppable
              editable
              eventClick={handleEventSelect}
              eventContent={EventContent}
              eventDisplay="block"
              eventDrop={handleEventDrop}
              eventResizableFromStart
              eventResize={handleEventResize}
              events={Array.from(events.values())}
              headerToolbar={false}
              height={800}
              initialDate={date}
              initialView={view}
              plugins={plugins}
              ref={calendarRef}
              rerenderDelay={10}
              select={handleRangeSelect}
              selectable
              weekends
            />
          </Box>
        </Card>
        <Stack direction="row" spacing={3} sx={{ justifyContent: 'center' }}>
          <IconButton onClick={handleDatePrev}>
            <CaretLeftIcon />
          </IconButton>
          <Button color="secondary" onClick={handleDateToday} variant="outlined">
            Today
          </Button>
          <IconButton onClick={handleDateNext}>
            <CaretRightIcon />
          </IconButton>
        </Stack>
      </Stack>
      {createDialog.open ? (
        <EventDialog
          action="create"
          onClose={createDialog.handleClose}
          onCreate={(params) => {
            createEvent(params);
            createDialog.handleClose();
          }}
          open
          range={createDialog.data?.range}
        />
      ) : null}
      {currentEvent ? (
        <EventDialog
          action="update"
          event={currentEvent}
          onClose={() => {
            setCurrentEventId(undefined);
          }}
          onCreate={createEvent}
          onDelete={(eventId) => {
            setCurrentEventId(undefined);
            deleteEvent(eventId);
          }}
          onUpdate={(eventId, params) => {
            updateEvent(eventId, params);
            setCurrentEventId(undefined);
          }}
          open
        />
      ) : null}
    </React.Fragment>
  );
}
