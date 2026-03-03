<div align="center">

# tabl.design

**A free, open-source database schema designer that runs entirely in your browser.**

Design your database visually, define relationships, and export production-ready SQL — no sign-up, no server, no data leaves your machine.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-tabl.design-blue?style=for-the-badge)](https://tabl.design)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

</div>

---

## ✨ What is tabl.design?

`tabl.design` is a visual, browser-based **Entity Relationship Diagram (ERD) tool**. Think of it like a lightweight, privacy-first alternative to tools like dbdiagram.io or Lucidchart — but all your data stays local in your browser via IndexedDB.

### Key Highlights

- 🗂️ **Project-based workflow** — Organise your schemas into separate projects
- 🧩 **Visual canvas editor** — Drag-and-drop tables powered by React Flow
- 🔗 **Relationship modeling** — Define `one-to-one`, `one-to-many`, and `many-to-many` relationships visually
- 📋 **Rich column editor** — Set types, constraints (PK, FK, Unique, Nullable, Auto Increment), and default values
- 🎨 **Table color coding** — Assign accent colours to tables for visual clarity
- 📤 **SQL Export** — Generate SQL for **PostgreSQL**, **MySQL**, and **Oracle** with one click
- 💾 **100% offline & private** — All data is stored locally in IndexedDB (via Dexie.js), nothing is sent to any server
- 🌗 **Light & Dark mode** — Full theme support

---

## 🖥️ Live Demo

Try it now at **[https://tabl.design](https://tabl.design)** — no account required.

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/LionsLeo/tabl.git
cd tabl

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This outputs a fully static site to the `./out` directory, ready to be served from any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.).

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Static Export) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Canvas / Diagramming | [React Flow (@xyflow/react)](https://reactflow.dev) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Local Storage / DB | [Dexie.js](https://dexie.org/) (IndexedDB wrapper) |
| UI Components | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard — list & manage projects
│   └── editor/               # Visual schema editor route
├── components/
│   ├── dashboard/            # ProjectCard, CreateProjectDialog
│   ├── editor/               # Canvas, Toolbar, TableNode, RelationshipEdge, PropertiesPanel, ExportDialog
│   └── ui/                   # Reusable shadcn/ui components
├── lib/
│   ├── db.ts                 # Dexie (IndexedDB) setup
│   └── sql/                  # SQL generators (PostgreSQL, MySQL, Oracle)
├── stores/
│   ├── project-store.ts      # Zustand store for project CRUD
│   └── editor-store.ts       # Zustand store for canvas state
└── types/
    └── index.ts              # Shared TypeScript types (Project, TableSchema, Column, Relationship)
```

---

## 🗂️ Supported Column Types

`INT` · `VARCHAR` · `TEXT` · `BOOLEAN` · `DATE` · `DATETIME` · `DECIMAL` · `FLOAT` · `UUID` · `JSON` · `ENUM`

## 🔗 Supported Relationship Types

- **One-to-One**
- **One-to-Many**
- **Many-to-Many**

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feat/your-feature-name`
5. **Open a Pull Request** against the `main` branch

### Ideas for Contribution

- [ ] Add more SQL dialects (SQLite, MSSQL)
- [ ] Import existing SQL schema to auto-generate diagrams
- [ ] Export diagram as PNG/SVG image
- [ ] Keyboard shortcuts
- [ ] Undo / Redo history
- [ ] Schema validation and linting
- [ ] Shareable diagram links (via URL encoding)

Please open an [issue](https://github.com/LionsLeo/tabl/issues) first for major changes so we can discuss the approach.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/LionsLeo">LionsLeo</a> and contributors
</div>
