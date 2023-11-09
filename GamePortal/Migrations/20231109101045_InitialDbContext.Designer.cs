﻿// <auto-generated />
using System;
using GamePortal.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GamePortal.Migrations
{
    [DbContext(typeof(GamePortalDbContext))]
    [Migration("20231109101045_InitialDbContext")]
    partial class InitialDbContext
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("GamePortal.Models.Game", b =>
                {
                    b.Property<int>("GameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("GameId");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("GameId"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .IsUnicode(false)
                        .HasColumnType("varchar(100)")
                        .HasColumnName("Name");

                    b.HasKey("GameId");

                    b.ToTable("Game", (string)null);
                });

            modelBuilder.Entity("GamePortal.Models.Player", b =>
                {
                    b.Property<int>("PlayerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("PlayerId");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PlayerId"), 1L, 1);

                    b.Property<DateTime>("Birthdate")
                        .HasColumnType("date")
                        .HasColumnName("Birthdate");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("Email");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("FullName");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .IsUnicode(false)
                        .HasColumnType("varchar(100)")
                        .HasColumnName("Password");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("UserName");

                    b.HasKey("PlayerId");

                    b.ToTable("Player", (string)null);
                });

            modelBuilder.Entity("GamePortal.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("RoleId");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .IsUnicode(false)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("Name");

                    b.HasKey("RoleId");

                    b.ToTable("Role", (string)null);
                });

            modelBuilder.Entity("GamePortal.Models.SavedGame", b =>
                {
                    b.Property<int>("SavedGameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("SavedGameId");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SavedGameId"), 1L, 1);

                    b.Property<int>("GameId")
                        .HasColumnType("int")
                        .HasColumnName("GameId");

                    b.Property<string>("GameState")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("GameState");

                    b.Property<int>("PlayerId")
                        .HasColumnType("int")
                        .HasColumnName("PlayerId");

                    b.Property<string>("PlayerOne")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("PlayerOne");

                    b.Property<string>("PlayerTwo")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("PlayerTwo");

                    b.HasKey("SavedGameId");

                    b.HasIndex("GameId");

                    b.HasIndex("PlayerId");

                    b.ToTable("SavedGame", (string)null);
                });

            modelBuilder.Entity("PlayerRole", b =>
                {
                    b.Property<int>("PlayersPlayerId")
                        .HasColumnType("int");

                    b.Property<int>("RolesRoleId")
                        .HasColumnType("int");

                    b.HasKey("PlayersPlayerId", "RolesRoleId");

                    b.HasIndex("RolesRoleId");

                    b.ToTable("PlayerRole");
                });

            modelBuilder.Entity("GamePortal.Models.SavedGame", b =>
                {
                    b.HasOne("GamePortal.Models.Game", "Game")
                        .WithMany("SavedGames")
                        .HasForeignKey("GameId")
                        .IsRequired()
                        .HasConstraintName("FK_Game_SavedGame");

                    b.HasOne("GamePortal.Models.Player", "Player")
                        .WithMany("SavedGames")
                        .HasForeignKey("PlayerId")
                        .IsRequired()
                        .HasConstraintName("FK_Player_SavedGame");

                    b.Navigation("Game");

                    b.Navigation("Player");
                });

            modelBuilder.Entity("PlayerRole", b =>
                {
                    b.HasOne("GamePortal.Models.Player", null)
                        .WithMany()
                        .HasForeignKey("PlayersPlayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GamePortal.Models.Role", null)
                        .WithMany()
                        .HasForeignKey("RolesRoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("GamePortal.Models.Game", b =>
                {
                    b.Navigation("SavedGames");
                });

            modelBuilder.Entity("GamePortal.Models.Player", b =>
                {
                    b.Navigation("SavedGames");
                });
#pragma warning restore 612, 618
        }
    }
}