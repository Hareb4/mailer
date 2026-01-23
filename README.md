# Mailer

## Overview

Mailer is a comprehensive email management application designed to streamline the process of sending emails efficiently. It is built using a modern tech stack and offers a range of features to enhance user experience.

## Features

- **Email Sending**: Send emails with attachments and inline images.
- **Progress Tracking**: Real-time tracking of email sending progress with Socket.IO.
- **Error Handling**: Detailed error reporting for failed email deliveries.
- **File Management**: Upload and manage attachments and poster images.

## Tech Stack

- **Backend**: Flask, Flask-SocketIO, Flask-CORS
- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: MongoDB, Mongoose
- **Email**: smtplib, MIME libraries
- **Utilities**: Axios, XLSX for Excel file handling

## Installation

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Hareb4/mailer.git
   cd mailer
   ```

2. Install frontend dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Rename `.env.example` to `.env.local` and update the necessary variables.

4. Run the React frontend on port 8080:

   ```bash
   pnpm dev -- --port 8080
   ```

### Backend Setup

To set up the backend, follow the instructions below. You can also check the backend code on [GitHub](https://github.com/Hareb4/mailer-python).

1. Clone the backend repository:

   ```bash
   git clone https://github.com/Hareb4/mailer-python.git
   cd mailer-python
   ```

2. Set up a virtual environment (optional but recommended):

   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the Python backend:

   ```bash
   python app.py
   ```

## Usage

- Access the application at `http://localhost:8080`.
- Use the `/send-email` endpoint to send emails via the Flask backend.
