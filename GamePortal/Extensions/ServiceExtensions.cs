using GamePortal.Controllers;
using GamePortal.Models;
using GamePortal.Repository;
using GamePortal.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

namespace GamePortal.Extensions
{
    /* Class for adding different kind of services */
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationExtension(this IServiceCollection services, IConfiguration configuration) 
        {
            // Add SignalR to container
            services.AddSignalR();

            // Add JWT config to container
            // Source: https://code-maze.com/authentication-aspnetcore-jwt-1/
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "http://localhost:5086",
                    ValidAudience = "http://localhost:5086",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("JwtSettings").GetValue<string>("SecretKey")!))
                };
            });

            // Add Controllers to container
            services.AddControllers().AddJsonOptions(options =>
            {
                // Ignoring the cycles is JSON, which appears by the connections
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });

            // Add DatabaseContext to container
            services.AddDbContext<GamePortalDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DatabaseConnection")!);
            });

            //Add Cors to container
            services.AddCors(options =>
            {
                options.AddPolicy(name: "CorsPolicy",
                    builder => builder
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .AllowAnyOrigin()
                        .WithOrigins("http://localhost:44421"));
            });


            // Add repositories to container
            services.AddScoped<IPlayerRepository, PlayerRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IGameRepository, GameRepository>();
            services.AddScoped<ISavedGamesRepository, SavedGamesRepository>();

            // Add services to container
            services.AddTransient<ITokenService, TokenService>();

            return services;
        }
    }
}
