using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamePortal.Migrations
{
    public partial class RefreshTokenState : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "Player",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "Player",
                type: "date",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "Player");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "Player");
        }
    }
}
