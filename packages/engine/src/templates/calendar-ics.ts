import { Template } from '../types';

export const calendarIcsTemplate: Template = {
  key: 'calendar-ics',
  title: 'Calendar ICS',
  templateVersion: '2025.1.0',
  ruleVersion: '1.0.0',
  sourceUrls: [
    'https://tools.ietf.org/rfc/rfc5545.txt',
    'https://icalendar.org/',
    'https://en.wikipedia.org/wiki/ICalendar'
  ],
  lastVerified: '2025-01-22',
  notes: [
    'Based on RFC 5545 iCalendar specification (2025)',
    'UTF-8 encoding required, comma-separated values',
    'Start/End must be valid dates or datetimes',
    'All Day events use DATE format (YYYYMMDD)',
    'Timed events use DATETIME format with timezone',
    'Duration can be used instead of End time',
    'UID will be auto-generated if not provided',
  ],
  fields: [
    {
      key: 'title',
      label: 'Title',
      required: true,
      type: 'string',
      transform: ['trim'],
      synonyms: ['name', 'event title', 'summary', 'subject', 'event name', 'título', 'titulo', 'nom', 'bezeichnung', 'nome'],
    },
    {
      key: 'start',
      label: 'Start',
      required: true,
      type: 'string', // Will be validated as date/datetime
      transform: ['trim'],
      synonyms: ['start date', 'start time', 'begin', 'from', 'dtstart', 'date', 'inicio', 'début', 'beginn', 'inizio'],
    },
    {
      key: 'end',
      label: 'End',
      required: false, // Can use Duration instead
      type: 'string', // Will be validated as date/datetime
      transform: ['trim'],
      synonyms: ['end date', 'end time', 'finish', 'to', 'dtend', 'until', 'fin', 'ende', 'fine'],
    },
    {
      key: 'duration',
      label: 'Duration',
      required: false, // Alternative to End
      type: 'string',
      transform: ['trim'],
      synonyms: ['length', 'time', 'hours', 'minutes', 'duración', 'durée', 'dauer', 'durata'],
    },
    {
      key: 'all_day',
      label: 'All Day',
      required: false,
      type: 'boolean',
      transform: ['boolean'],
      synonyms: ['all day', 'allday', 'full day', 'whole day', 'all-day', 'todo el día', 'toute la journée', 'ganztägig', 'tutto il giorno'],
    },
    {
      key: 'timezone',
      label: 'Timezone',
      required: false,
      type: 'string',
      transform: ['trim'],
      synonyms: ['tz', 'time zone', 'zona horaria', 'fuseau horaire', 'zeitzone', 'fuso orario'],
    },
    {
      key: 'location',
      label: 'Location',
      required: false,
      type: 'string',
      transform: ['trim'],
      synonyms: ['place', 'venue', 'address', 'where', 'ubicación', 'lieu', 'ort', 'luogo'],
    },
    {
      key: 'description',
      label: 'Description',
      required: false,
      type: 'string',
      transform: ['trim'],
      synonyms: ['notes', 'details', 'body', 'content', 'descripción', 'note', 'beschreibung', 'descrizione'],
    },
    {
      key: 'url',
      label: 'URL',
      required: false,
      type: 'string',
      transform: ['trim'],
      synonyms: ['link', 'website', 'web', 'site', 'enlace', 'lien', 'verknüpfung', 'collegamento'],
    },
    {
      key: 'uid',
      label: 'UID',
      required: false,
      type: 'string',
      transform: ['trim'],
      synonyms: ['id', 'unique id', 'event id', 'identifier'],
    },
    {
      key: 'organizer',
      label: 'Organizer',
      required: false,
      type: 'string',
      transform: ['trim'],
      synonyms: ['organizer email', 'host', 'created by', 'organizador', 'organisateur', 'veranstalter', 'organizzatore'],
    },
    {
      key: 'attendees',
      label: 'Attendees',
      required: false,
      type: 'string',
      transform: ['trim'],
      synonyms: ['guests', 'participants', 'invitees', 'asistentes', 'participants', 'teilnehmer', 'partecipanti'],
    },
  ],
};