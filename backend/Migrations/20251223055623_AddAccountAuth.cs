using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Staffs");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Staffs");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Members");

            migrationBuilder.AddColumn<int>(
                name: "AccountId",
                table: "Staffs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AccountId",
                table: "Members",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    AccountId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.AccountId);
                });

            migrationBuilder.CreateTable(
                name: "AccountRoles",
                columns: table => new
                {
                    AccountRoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountRoles", x => x.AccountRoleId);
                    table.ForeignKey(
                        name: "FK_AccountRoles_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "AccountId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Staffs_AccountId",
                table: "Staffs",
                column: "AccountId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Members_AccountId",
                table: "Members",
                column: "AccountId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AccountRoles_AccountId",
                table: "AccountRoles",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_Username",
                table: "Accounts",
                column: "Username",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Members_Accounts_AccountId",
                table: "Members",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "AccountId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Staffs_Accounts_AccountId",
                table: "Staffs",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "AccountId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Members_Accounts_AccountId",
                table: "Members");

            migrationBuilder.DropForeignKey(
                name: "FK_Staffs_Accounts_AccountId",
                table: "Staffs");

            migrationBuilder.DropTable(
                name: "AccountRoles");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropIndex(
                name: "IX_Staffs_AccountId",
                table: "Staffs");

            migrationBuilder.DropIndex(
                name: "IX_Members_AccountId",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "AccountId",
                table: "Staffs");

            migrationBuilder.DropColumn(
                name: "AccountId",
                table: "Members");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Staffs",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Staffs",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Staff");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Members",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");
        }
    }
}
