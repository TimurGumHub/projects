#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sqlite3.h>

// Обработчик коллбэка выполнения SQL-запросов
int callback(void *data, int argc, char **argv, char **azColName) {
    return 0;
}

int main() {
    sqlite3 *db;
    char *errMsg = 0;
    int rc;
    
    // Открытие или создание базы данных
    rc = sqlite3_open("database.db", &db);
    if (rc) {
        fprintf(stderr, "Error opening or creating database: %s\n", sqlite3_errmsg(db));
        return rc;
    }
    
    // Создание таблицы, если она не существует
    char *sql = "CREATE TABLE IF NOT EXISTS Strings (hash TEXT PRIMARY KEY, value TEXT);";;
    rc = sqlite3_exec(db, sql, callback, 0, &errMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Error creating table: %s\n", errMsg);
        sqlite3_free(errMsg);
        sqlite3_close(db);
        return rc;
    }
    
    // Установка кодировки UTF-8
    char *pragmaSql = "PRAGMA encoding = 'UTF-8';";
    rc = sqlite3_exec(db, pragmaSql, callback, 0, &errMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Error setting encoding: %s\n", errMsg);
        sqlite3_free(errMsg);
        sqlite3_close(db);
        return rc;
    }

    // Получение строки от пользователя
    char input[256];
    printf("Enter the string: ");
    fgets(input, sizeof(input), stdin);
    
    // Удаление символа новой строки
    input[strcspn(input, "\n")] = '\0';
    
    // Вычисление хеша строки
    unsigned long hash = 5381;
    char *ptr = input;
    while (*ptr) {
        hash = ((hash << 5) + hash) + *ptr;
        ptr++;
    }
    
    // Начало транзакции
    rc = sqlite3_exec(db, "BEGIN TRANSACTION;", callback, 0, &errMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Error starting transaction: %s\n", errMsg);
        sqlite3_free(errMsg);
        sqlite3_close(db);
        return rc;
    }
    
    // Подготовка SQL-запроса для поиска хеша в БД
    char query[100];
    snprintf(query, sizeof(query), "SELECT hash FROM Strings WHERE hash = '%lu';", hash);
    
    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, query, -1, &stmt, 0);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Error preparing SQL statement: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return rc;
    }
    
    // Выполнение подготовленного выражения
    rc = sqlite3_step(stmt);
    if (rc == SQLITE_ROW) {
        fprintf(stderr, "Error!\n");
        sqlite3_finalize(stmt);
        sqlite3_close(db);
        return 1;
    }

    // Очистка подготовленного выражения
    sqlite3_finalize(stmt);

    // Выполнение SQL-запроса для поиска
    rc = sqlite3_exec(db, query, callback, 0, &errMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Error while executing SQL query: %s\n", errMsg);
        sqlite3_free(errMsg);
        sqlite3_close(db);
        return rc;
    }
    
   
    if (sqlite3_data_count(stmt) > 0) {
        fprintf(stderr, "Error!\n");
        sqlite3_finalize(stmt);
        sqlite3_close(db);
        return 1;
    }
    
    // Подготовка SQL-запроса для сохранения строки и хеша в БД
    snprintf(query, sizeof(query), "INSERT INTO Strings (hash, value) VALUES ('%lu', '%s');", hash, input);
    
    // Выполнение SQL-запроса для сохранения
    rc = sqlite3_exec(db, query, callback, 0, &errMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Error while saving to database: %s\n", errMsg);
        sqlite3_free(errMsg);
        sqlite3_close(db);
        return rc;
    }
    
    // Фиксация изменений (коммит транзакции)
    rc = sqlite3_exec(db, "COMMIT;", callback, 0, &errMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Error committing transaction: %s\n", errMsg);
        sqlite3_free(errMsg);
        sqlite3_close(db);
        return rc;
    }

    // Закрытие базы данных
    sqlite3_close(db);
    
    printf("Row saved successfully! \n");
    
    return 0;
}
