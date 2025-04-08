class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onSubmit = null;
  }

  connectedCallback() {
    this.render();
  }

  set onSubmit(callback) {
    this._onSubmit = callback;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          .form-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }
          
          .form-title {
            margin-bottom: 20px;
            color: #166088;
          }
          
          .form-group {
            margin-bottom: 15px;
          }
          
          .form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
          }
          
          .form-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
          }
          
          .form-textarea {
            min-height: 100px;
            resize: vertical;
          }
          
          .submit-btn {
            background-color: #4a6fa5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s;
          }
          
          .submit-btn:hover {
            background-color: #166088;
          }
        </style>
        <div class="form-container">
          <h2 class="form-title">Add New Note</h2>
          <form id="noteForm">
            <div class="form-group">
              <label for="title" class="form-label">Title</label>
              <input type="text" id="title" name="title" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="body" class="form-label">Content</label>
              <textarea id="body" name="body" class="form-input form-textarea" required></textarea>
            </div>
            <button type="submit" class="submit-btn">Add Note</button>
          </form>
        </div>
      `;

    const form = this.shadowRoot.getElementById('noteForm');
    if (form && this._onSubmit) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const note = {
          title: formData.get('title'),
          body: formData.get('body'),
        };
        this._onSubmit(note);
        form.reset();
      });
    }
  }
}

customElements.define('note-form', NoteForm);
