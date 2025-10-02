import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1745442576252 {
    name = ' $npmConfigName1745442576252'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY NOT NULL,
                "original_title" varchar NOT NULL,
                "release_date" varchar NOT NULL,
                "adult" boolean NOT NULL,
                "backdrop_path" varchar NOT NULL,
                "original_language" varchar NOT NULL,
                "genre_ids" text NOT NULL,
                CONSTRAINT "UQ_cb3bb4d61cf764dc035cbedd422" UNIQUE ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                "liked_movies" text NOT NULL,
                "disliked_movies" text NOT NULL,
                "adult" boolean NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
    }
}
