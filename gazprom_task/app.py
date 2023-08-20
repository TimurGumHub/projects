from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

def create_db():
    conn = sqlite3.connect('visits.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS visits
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 member_name TEXT,
                 date_visited DATE,
                 cost REAL)''')
    conn.commit()
    conn.close()

# Вызов create_db() один раз при старте приложения
create_db()


def get_visits_from_db():
    conn = sqlite3.connect('visits.db')
    c = conn.cursor()
    c.execute('SELECT * FROM visits')
    visits = c.fetchall()
    conn.close()
    return visits


@app.route('/')
def index():
    # Получить данные о посещениях из базы данных
    visits = get_visits_from_db()
    return render_template('index.html', visits=visits)

@app.route('/delete_visit/<int:visit_id>', methods=['GET', 'POST'])
def delete_visit(visit_id):
    conn = sqlite3.connect('visits.db')  # Подключитесь к вашей базе данных
    c = conn.cursor()
    c.execute('DELETE FROM visits WHERE id=?', (visit_id,))
    conn.commit()
    conn.close()

    return redirect(url_for('index'))

@app.route('/add_visit', methods=['POST'])
def add_visit():
    member_name = request.form.get('member_name')
    date_visited = request.form.get('date_visited')
    cost = request.form.get('cost')

    conn = sqlite3.connect('visits.db')
    c = conn.cursor()
    c.execute("INSERT INTO visits (member_name, date_visited, cost) VALUES (?, ?, ?)",
              (member_name, date_visited, cost))
    conn.commit()
    conn.close()

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
