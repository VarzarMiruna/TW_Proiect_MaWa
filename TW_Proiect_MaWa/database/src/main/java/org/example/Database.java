package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    private static final String HOST = "postgres-1.cn62tejxkxhb.eu-north-1.rds.amazonaws.com";
    private static final int PORT = 5432;
    private static final String DATABASE = "MAWA";
    private static final String USERNAME = "postgres";
    private static final String PASSWORD = "miruna";

    public static Connection getConnection() throws SQLException {
        String url = "jdbc:postgresql://" + HOST + ":" + PORT + "/" + DATABASE;
        return DriverManager.getConnection(url, USERNAME, PASSWORD);
    }
}
