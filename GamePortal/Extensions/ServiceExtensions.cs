using GamePortal.Models;
using GamePortal.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
            services.AddControllers();

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

            // Add UserRepositories to container
            services.AddScoped<IPlayerRepository, PlayerRepository>();

            return services;
        }

    }
}
