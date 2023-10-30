var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment()) { }

app.UseStaticFiles();
app.UseRouting();

app.UseCors(builder =>
    builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .WithOrigins("http://localhost:44421")
);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
