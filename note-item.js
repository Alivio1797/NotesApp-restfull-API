class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._note = null;
    this._onDelete = null;
    this._onArchive = null;
    this._onUnarchive = null;
  }

  static get observedAttributes() {
    return ['note'];
  }

  set note(value) {
    this._note = value;
    this.render();
  }

  set onDelete(callback) {
    this._onDelete = callback;
  }

  set onArchive(callback) {
    this._onArchive = callback;
  }

  set onUnarchive(callback) {
    this._onUnarchive = callback;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._note) return;

    this.shadowRoot.innerHTML = `
      <style>
        .note-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .note-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .note-title {
          margin-bottom: 10px;
          color: #166088;
          font-size: 1.2rem;
        }
        
        .note-body {
          margin-bottom: 15px;
          color: #555;
          line-height: 1.5;
        }
        
        .note-actions {
          display: flex;
          gap: 10px;
        }
        
        .action-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: opacity 0.3s;
        }
        
        .action-btn:hover {
          opacity: 0.8;
        }
        
        .delete-btn {
          background-color: #d64045;
          color: white;
        }
        
        .archive-btn {
          background-color: #4a6fa5;
          color: white;
        }
        
        .unarchive-btn {
          background-color: #4a9c5a;
          color: white;
        }
        
        .created-at {
          font-size: 0.8rem;
          color: #888;
          margin-top: 10px;
        }
      </style>
      <div class="note-card">
        <h3 class="note-title">${this._note.title}</h3>
        <p class="note-body">${this._note.body}</p>
        <div class="note-actions">
          ${
            this._onArchive
              ? `<button class="action-btn archive-btn" data-id="${this._note.id}">Archive</button>`
              : this._onUnarchive
              ? `<button class="action-btn unarchive-btn" data-id="${this._note.id}">Unarchive</button>`
              : ''
          }
          <button class="action-btn delete-btn" data-id="${
            this._note.id
          }">Delete</button>
        </div>
        <p class="created-at">Created: ${new Date(
          this._note.createdAt
        ).toLocaleString()}</p>
      </div>
    `;

    if (this._onDelete) {
      this.shadowRoot
        .querySelector('.delete-btn')
        .addEventListener('click', () => {
          this._onDelete(this._note.id);
        });
    }

    if (this._onArchive) {
      this.shadowRoot
        .querySelector('.archive-btn')
        ?.addEventListener('click', () => {
          this._onArchive(this._note.id);
        });
    }

    if (this._onUnarchive) {
      this.shadowRoot
        .querySelector('.unarchive-btn')
        ?.addEventListener('click', () => {
          this._onUnarchive(this._note.id);
        });
    }
  }
}

customElements.define('note-item', NoteItem);
