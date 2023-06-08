#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <openssl/sha.h>
#include "./sqlite3.h"

sqlite3 *db;

void init_db() {
    int rc = sqlite3_open("test.db", &db);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при открытии базы данных: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    char *sql = "CREATE TABLE IF NOT EXISTS entries (string TEXT, hash BLOB);";
    char *err_msg;
    rc = sqlite3_exec(db, sql, 0, 0, &err_msg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при создании таблицы: %s\n", err_msg);
        sqlite3_free(err_msg);
        exit(1);
    }
}

int search_hash(unsigned char *hash) {
    char *sql = "SELECT * FROM entries WHERE hash = ?;";
    sqlite3_stmt *stmt;
    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при подготовке выражения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    rc = sqlite3_bind_blob(stmt, 1, hash, SHA256_DIGEST_LENGTH, SQLITE_STATIC);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при привязке значения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    int found = 0;
    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
        found = 1;
    }
    if (rc != SQLITE_DONE) {
        fprintf(stderr, "Ошибка при выполнении выражения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    rc = sqlite3_finalize(stmt);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при завершении выражения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    return found;
}

void insert_entry(char *string, unsigned char *hash) {
    char *sql = "INSERT INTO entries (string, hash) VALUES (?, ?);";
    sqlite3_stmt *stmt;
    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при подготовке выражения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    rc = sqlite3_bind_text(stmt, 1, string, -1, SQLITE_STATIC);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при привязке значения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    rc = sqlite3_bind_blob(stmt, 2, hash, SHA256_DIGEST_LENGTH, SQLITE_STATIC);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при привязке значения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    rc = sqlite3_step(stmt);
    if (rc != SQLITE_DONE) {
        fprintf(stderr, "Ошибка при выполнении выражения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }

    rc = sqlite3_finalize(stmt);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Ошибка при завершении выражения: %s\n", sqlite3_errmsg(db));
        exit(1);
    }
}

int main() {
    init_db();

    char buffer[1024];
    while (fgets(buffer, 1024, stdin)) {
        buffer[strcspn(buffer, "\n")] = 0;

        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256(buffer, strlen(buffer), hash);

        if (search_hash(hash)) {
            printf("Ошибка: повторяющаяся строка\n");
        } else {
            insert_entry(buffer, hash);
            printf("Строка и хэш сохранены в базе данных\n");
        }
    }

    return 0;
}
