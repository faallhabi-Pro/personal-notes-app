import React from 'react';
import NoteItem from './NoteItem';

function NoteList({
  notes, emptyMessage, busyId, onArchive, onUnarchive,
}) {
  if (notes.length === 0) {
    return (
      <section className="notes-list-empty">
        <p>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="notes-list">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          {...note}
          busy={busyId === note.id}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
        />
      ))}
    </section>
  );
}

export default NoteList;
