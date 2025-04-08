import './components/note-item';
import './components/loading-indicator';
import './components/note-form';
import './components/toast-notification';
import NotesApi from './api';
import Swal from 'sweetalert2'; // Pastikan ini diinstal via npm/yarn
import 'animate.css';
import '../styles/main.css';

class NotesApp {
  constructor() {
    this.notesContainer = document.getElementById('notes-container');
    this.archivedNotesContainer = document.getElementById(
      'archived-notes-container'
    );
    this.noteFormContainer = document.getElementById('note-form-container');
    this.toggleArchiveBtn = document.getElementById('toggle-archive-btn');
    this.loadingIndicator = null;
    this.showingArchived = false;
    this.init();
  }

  async init() {
    try {
      this.showLoading();
      await this.renderNotes();
      this.renderNoteForm();
      this.setupEventListeners();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to initialize application',
        icon: 'error',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    } finally {
      this.hideLoading();
    }
  }

  setupEventListeners() {
    if (this.toggleArchiveBtn) {
      this.toggleArchiveBtn.addEventListener('click', async () => {
        this.showingArchived = !this.showingArchived;
        await this.toggleArchiveView();
      });
    }
  }

  async toggleArchiveView() {
    try {
      this.showLoading();
      if (this.showingArchived) {
        await this.renderArchivedNotes();
        this.toggleArchiveBtn.textContent = 'Show Active Notes';
      } else {
        await this.renderNotes();
        this.toggleArchiveBtn.textContent = 'Show Archived Notes';
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to toggle notes view',
        icon: 'error',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    } finally {
      this.hideLoading();
    }
  }

  async renderNotes() {
    try {
      const notes = await NotesApi.getAllNotes();
      this.notesContainer.innerHTML = '';
      this.archivedNotesContainer.style.display = 'none';
      this.notesContainer.style.display = 'grid';

      if (!notes || notes.length === 0) {
        this.notesContainer.innerHTML =
          '<p class="empty-message animate__animated animate__fadeIn">No active notes found. Add your first note!</p>';
        return;
      }

      notes.forEach((note) => {
        const noteElement = document.createElement('note-item');
        noteElement.classList.add('animate__animated', 'animate__fadeInUp');
        noteElement.note = note;
        noteElement.onDelete = this.handleDeleteNote.bind(this);
        noteElement.onArchive = this.handleArchiveNote.bind(this);
        this.notesContainer.appendChild(noteElement);
      });
    } catch (error) {
      console.error('Error rendering notes:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load notes. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    }
  }

  async renderArchivedNotes() {
    try {
      const notes = await NotesApi.getArchivedNotes();
      this.notesContainer.style.display = 'none';
      this.archivedNotesContainer.style.display = 'grid';
      this.archivedNotesContainer.innerHTML = '';

      if (!notes || notes.length === 0) {
        this.archivedNotesContainer.innerHTML =
          '<p class="empty-message animate__animated animate__fadeIn">No archived notes found.</p>';
        return;
      }

      notes.forEach((note) => {
        const noteElement = document.createElement('note-item');
        noteElement.classList.add('animate__animated', 'animate__fadeInUp');
        noteElement.note = note;
        noteElement.onDelete = this.handleDeleteNote.bind(this);
        noteElement.onUnarchive = this.handleUnarchiveNote.bind(this);
        this.archivedNotesContainer.appendChild(noteElement);
      });
    } catch (error) {
      console.error('Error rendering archived notes:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load archived notes. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    }
  }

  renderNoteForm() {
    const formElement = document.createElement('note-form');
    formElement.onSubmit = this.handleAddNote.bind(this);
    this.noteFormContainer.appendChild(formElement);
  }

  async handleAddNote(note) {
    try {
      this.showLoading();
      await NotesApi.addNote(note);
      await this.renderNotes();
      Swal.fire({
        title: 'Success!',
        text: 'Note added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      });

      const toast = document.querySelector('toast-notification');
      if (toast) toast.show('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add note. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    } finally {
      this.hideLoading();
    }
  }

  async handleArchiveNote(id) {
    try {
      this.showLoading();
      const isSuccess = await NotesApi.archiveNote(id);
      if (isSuccess) {
        await this.renderNotes();
        Swal.fire({
          title: 'Success!',
          text: 'Note archived successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          }
        });
      } else {
        throw new Error('Archive operation failed');
      }
    } catch (error) {
      console.error('Error archiving note:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to archive note. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    } finally {
      this.hideLoading();
    }
  }

  async handleUnarchiveNote(id) {
    try {
      this.showLoading();
      const isSuccess = await NotesApi.unarchiveNote(id);
      if (isSuccess) {
        await this.renderArchivedNotes();
        Swal.fire({
          title: 'Success!',
          text: 'Note unarchived successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          }
        });
      } else {
        throw new Error('Unarchive operation failed');
      }
    } catch (error) {
      console.error('Error unarchiving note:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to unarchive note. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    } finally {
      this.hideLoading();
    }
  }

  async handleDeleteNote(id) {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      });

      if (result.isConfirmed) {
        this.showLoading();
        const isSuccess = await NotesApi.deleteNote(id);
        if (isSuccess) {
          if (this.showingArchived) {
            await this.renderArchivedNotes();
          } else {
            await this.renderNotes();
          }
          Swal.fire({
            title: 'Deleted!',
            text: 'Note deleted successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            }
          });
        } else {
          throw new Error('Delete operation failed');
        }
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete note. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    } finally {
      this.hideLoading();
    }
  }

  showLoading() {
    if (!this.loadingIndicator) {
      this.loadingIndicator = document.createElement('loading-indicator');
      document.body.appendChild(this.loadingIndicator);
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.remove();
      this.loadingIndicator = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new NotesApp();
});