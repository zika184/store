import User from "../types/user.type";
import db from "../database";
class UserModel {
  async create(user: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO users (email, user_name, first_name, last_name, password) values ($1, $2, $3, $4, $5) returning id, email, user_name, first_name, last_name`;
      const result = await connection.query(sql, [
        user.email,
        user.user_name,
        user.first_name,
        user.last_name,
        user.password,
      ]);
      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `unable to create (${user.user_name}): ${(error as Error).message}`
      );
    }
  }
  async getMany(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, email, user_name, first_name, last_name from users`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error at retriving users ${(error as Error).message}`);
    }
  }
  async getOne(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, email, user_name, first_name, last_name FROM users WHERE id=($1)`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `could not find user ${id} , ${(error as Error).message}`
      );
    }
  }
  async updateOne(user: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET email=$1, user_name=$2, first_name=$3, last_name=$4, password=$5 
      WHERE id=$6 
      RETURNING id, email, user_name, first_name, last_name`;

      const result = await connection.query(sql, [
        user.email,
        user.user_name,
        user.first_name,
        user.last_name,
        user.password,
        user.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `could not find user ${user.user_name} , ${(error as Error).message}`
      );
    }
  }
  async deleteOne(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM users WHERE id=($1) RETURNING id, email, user_name, first_name, last_name`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `could not delete user ${id} , ${(error as Error).message}`
      );
    }
  }
}

export default UserModel;
