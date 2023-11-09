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
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationExtension(this IServiceCollection services, IConfiguration configuration) 
        {
            // Add JWT config to container
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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345")),
                };
            });

            // Add Controllers to container
            services.AddControllers().AddJsonOptions(options =>
            {
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
                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .AllowAnyMethod()
                        .AllowAnyHeader().WithOrigins("http://localhost:44421"));
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
