using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamePortal.Migrations
{
    public partial class SavedGameExtension : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Player_SavedGame",
                table: "SavedGame");

            migrationBuilder.DropColumn(
                name: "PlayerOne",
                table: "SavedGame");

            migrationBuilder.DropColumn(
                name: "PlayerTwo",
                table: "SavedGame");

            migrationBuilder.RenameColumn(
                name: "PlayerId",
                table: "SavedGame",
                newName: "PlayerTwoId");

            migrationBuilder.RenameIndex(
                name: "IX_SavedGame_PlayerId",
                table: "SavedGame",
                newName: "IX_SavedGame_PlayerTwoId");

            migrationBuilder.AddColumn<string>(
                name: "GameUrl",
                table: "SavedGame",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PlayerOneId",
                table: "SavedGame",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "Player",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RefreshToken",
                table: "Player",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldUnicode: false,
                oldMaxLength: 500);

            migrationBuilder.CreateIndex(
                name: "IX_SavedGame_PlayerOneId",
                table: "SavedGame",
                column: "PlayerOneId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerOne_SavedGame",
                table: "SavedGame",
                column: "PlayerOneId",
                principalTable: "Player",
                principalColumn: "PlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerTwo_SavedGame",
                table: "SavedGame",
                column: "PlayerTwoId",
                principalTable: "Player",
                principalColumn: "PlayerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerOne_SavedGame",
                table: "SavedGame");

            migrationBuilder.DropForeignKey(
                name: "FK_PlayerTwo_SavedGame",
                table: "SavedGame");

            migrationBuilder.DropIndex(
                name: "IX_SavedGame_PlayerOneId",
                table: "SavedGame");

            migrationBuilder.DropColumn(
                name: "GameUrl",
                table: "SavedGame");

            migrationBuilder.DropColumn(
                name: "PlayerOneId",
                table: "SavedGame");

            migrationBuilder.RenameColumn(
                name: "PlayerTwoId",
                table: "SavedGame",
                newName: "PlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_SavedGame_PlayerTwoId",
                table: "SavedGame",
                newName: "IX_SavedGame_PlayerId");

            migrationBuilder.AddColumn<string>(
                name: "PlayerOne",
                table: "SavedGame",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PlayerTwo",
                table: "SavedGame",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "Player",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "RefreshToken",
                table: "Player",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldUnicode: false,
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Player_SavedGame",
                table: "SavedGame",
                column: "PlayerId",
                principalTable: "Player",
                principalColumn: "PlayerId");
        }
    }
}
